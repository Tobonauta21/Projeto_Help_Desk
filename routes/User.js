//Módulos
    const express = require('express')
    const router = express.Router()
    const User = require('../models/Usuario.js')
    const bcrypt = require('bcryptjs')
    const Ocorrencia = require('../models/Ocorrencia.js')
    const Chamado = require('../models/Chamados.js')
    const ExcelJS = require('exceljs')
//Rotas
    router.get('/register',(req,res)=>{
        res.render('registroUser')
    })

    router.post('/registering',async(req,res)=>{
        try{
            const erros = []

            if(req.body.nome.length < 3){
                erros.push({msg:'Nome muito curto'})
            }

            if(req.body.senha.length < 3){
                erros.push({msg:'Senha muito curta'})
            }

            if(erros.length > 0){
                res.render('/user/register',{erros:erros})
            }else{

                const salt = await bcrypt.genSalt(10)
                const hashSenha = await bcrypt.hash(req.body.senha,salt)

                const user = await User.findOne({where:{email:req.body.email}})

                if(user){
                    //Colocar mensagem req flash de erro aqui
                }else{
                    await User.create({
                        nome:req.body.nome,
                        email:req.body.email,
                        senha:hashSenha
                    })

                    //Colocar mensagem flash de sucesso aqui
                    res.redirect('/user/register')
                }

            }
        }catch(error){
            console.log('Erro ->'+error)
        }
    })

    router.get('/call',(req,res)=>{
        Ocorrencia.findAll().then((ocorrencias)=>{
            res.render('registroChamado',{ocorrencias:ocorrencias})
        }).catch((erro)=>{
            console.log('Ocorreu o seguinte erro->'+erro)
        })
    })

    router.post('/regis_call', async (req, res) => {
        try {
            const { ocorrencias, empresa } = req.body;
    
            // Criar o registro de chamado no banco de dados
            await Chamado.create({
                nomeUser: 'Igor', // Certifique-se de ajustar isso para o usuário atual
                codigo: ocorrencias,
                empresa: empresa,
                status: 'Aberto',
                ocorrenciaId: ocorrencias,
                prioridade:req.body.prioridade
            });
    
            // Adicionar o registro ao arquivo Excel
            await adicionarRegistroAoExcel('C:\\Users\\aluno\\Desktop\\Igor\\Projeto_Help_Desk\\routes\\data.xlsx', 'igor', ocorrencias, empresa, 'ABERTO');
    
            // Se tudo ocorrer bem, enviar uma resposta de sucesso
            console.log('Chamado registrado com sucesso!');
            res.status(200).send('Chamado registrado com sucesso!');
        } catch (error) {
            console.log('Ocorreu o seguinte erro -> ' + error);
            res.status(500).send('Ocorreu um erro ao registrar o chamado.');
        }
    });
    
    // Função para adicionar registro ao arquivo Excel
    async function adicionarRegistroAoExcel(filePath, ...dados) {
        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);
            const worksheet = workbook.getWorksheet(2);
            worksheet.addRow(dados);
            await workbook.xlsx.writeFile(filePath);
        } catch (error) {
            console.log('Ocorreu o seguinte erro ao adicionar registro ao Excel -> ' + error);
            throw error; // Rejeitar a Promise para que o erro seja capturado pelo catch no pedido POST
        }
    }

//Exportando rotas
    module.exports = router