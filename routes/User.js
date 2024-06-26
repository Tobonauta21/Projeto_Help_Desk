//Módulos
    const express = require('express')
    const router = express.Router()
    const User = require('../models/Usuario.js')
    const bcrypt = require('bcryptjs')
    const Ocorrencia = require('../models/Ocorrencia.js')
    const Chamado = require('../models/Chamados.js')
    const ExcelJS = require('exceljs')
    const Usuario = require('../models/Usuario.js')
//Rotas    
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
                res.render('/src/register',{erros:erros})
            }else{

                const salt = await bcrypt.genSalt(10)
                const hashSenha = await bcrypt.hash(req.body.senha,salt)

                const user = await User.findOne({where:{email:req.body.email}})

                if(user){
                    req.flash('error_msg','Usuário já existe!')
                    res.redirect('/login')
                }else{
                    await User.create({
                        nome:req.body.nome,
                        email:req.body.email,
                        cidade:req.body.cidade,
                        nasc:req.body.nasc,
                        empresa:req.body.empresa,
                        senha:hashSenha
                    })

                    req.flash('success_msg','Usuário registrado com sucesso!')
                    res.redirect('/register')
                }

            }
        }catch(error){
            console.log('Erro ->'+error)
        }
    })

    router.get('/call',(req,res)=>{
        Ocorrencia.findAll().then((ocorrencias)=>{
            res.render('src/registroChamado',{ocorrencias:ocorrencias})
        }).catch((erro)=>{
            req.flash('error_msg','Ocorreu um erro ao acessar a página!')
            res.redirect('/login')
            console.log('Ocorreu o seguinte erro->'+erro)
        })
    })

    router.post('/regis_call', async (req, res) => {

        Chamado.create({
            nomeUser:'Usuário genérico',
            empresa:'Empresa genérica',
            codigo:req.body.ocorrencias,
            status:'Aberto',
            descricao:req.body.descricao,
            prioridade:req.body.prioridade,
            ocorrenciaId:req.body.ocorrencias
        }).then(()=>{
            req.flash('success_msg','Chamado criado com sucesso!')
            res.redirect('/user/home')
        }).catch(err=>{    
        req.flash('error_msg','Ocorreu um erro, por favor tente novamente!')
        console.log(err)
        res.redirect('/login')
        })
        
        /*Registro de um usuário autenticado
        try{
             Usuario.findOne({where:{id:req.session.nuserId}}).then(urs=>{
                Chamado.create({
                    nomeUser:urs.nome,
                    empresa:urs.empresa,
                    codigo:req.body.ocorrencias,
                    status:'Aberto',
                    descricao:req.body.descricao,
                    prioridade:req.body.prioridade,
                    ocorrenciaId:req.body.ocorrencias
                }).then(()=>{
                    req.flash('success_msg','Chamado criado com sucesso!')
                    res.redirect('/user/home')
                }).catch(err=>{    
                req.flash('error_msg','Ocorreu um erro, por favor tente novamente!')
                console.log(err)
                res.redirect('/login')
                })
            }).catch(err=>{
                console.log(err)
                req.flash('error_msg','Ocorreu um erro, por favor tente novamente!')
                res.redirect('/login')
            })
        }catch(err){
            req.flash('error_msg','Ocorreu um erro, por favor tente novamente!')
            res.redirect('/login')
        }*/
        
    })

    router.post('/login',(req,res)=>{
        try{
            Usuario.findOne({where:{email:req.body.email}}).then(usr =>{
                if(!usr){
                    req.flash('Usuário não encontrado')
                    res.redirect('/login')
                }else{
                    bcrypt.compare(req.body.senha,usr.senha,(err,match)=>{
                        if(match){
                            req.session.nuserId = usr.id
                            res.redirect('/user/home')
                            console.log(req.session.nuserId)
                        }else{
                            req.flash('error_msg','Oocrreu um erro ao tentar fazer login')
                            res.redirect('/login')
                            console.log(err)
                        }
                    })
                }
            }).catch(err =>{
                //Colocar mensagem flash aqui
                console.log(err)
            })
        }catch(err){
            //Colocar mensagem flash aqui
            console.log(err)
        }
    })

    router.get('/home',(req,res)=>{
        Chamado.findAll().then(call=>{
            res.render('src/home',{call:call})
        }).catch(err=>{
            req.flash('error_msg','Ocorreu um erro ao acessar a plataforma!')
            res.redirect('/login')
        })

        //Código para sessão e autenticação de usuário
        /*Usuario.findOne({where:{id:req.session.nuserId}}).then(usr=>{
            if(usr){
                try{
                    Chamado.findAll({where:{nomeUser:usr.nome}}).then(call=>{
                        res.render('src/home',{call:call})
                    }).catch(err=>{
                        req.flash('error_msg','Ocorreu um erro ao acessar a plataforma!')
                        res.redirect('/login')
                    })
                }catch(err){
                    req.flash('error_msg','Ocorreu um erro ao acessar a plataforma!')
                    res.redirect('/login')
                }
            }else{
                req.flash('error_msg','Faça login para ter acesso a plataforma!')
                res.redirect('/login')
            }
        }).catch(err=>{
            req.flash('error_msg','Ocorreu um erro ao acessar a plataforma!')
            res.redirect('/login')
        })*/

    })
    
    router.get('/alter/:id',async(req,res)=>{
        try{
            const ocr = await Ocorrencia.findAll();
            Chamado.findOne({where:{id:req.params.id}}).then(call=>{
                
                res.render('src/alterarChamado',{call:call,ocr:ocr})

            }).catch(err=>{
                console.log(err)
            })
        }catch(err){
            console.log(err)
        }
    })

    router.post('/altercall/:id', async (req, res) => {
        try {
            const status = req.body.ocorrencias;
            const callId = req.params.id;
            const estado = req.body.estado
            const prio = req.body.prioridade
            // Atualize os campos 'codigo' e 'ocorrenciaId' onde 'id' for igual a 'callId'
            await Chamado.update(
                { codigo: status, ocorrenciaId: status,status:estado,prioridade:prio }, // Campos a serem atualizados
                { where: { id: callId } } // Condição para a atualização
            );
    
            req.flash('success_msg', 'Chamado alterado com sucesso!');
            res.redirect('/user/home');
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Ocorreu um erro ao alterar o chamado');
            res.redirect(`/alter/${callId}`);
        }
    });

    router.get('/logoff',(req,res)=>{
        req.session.nuserId = null
        req.flash('success_msg','Logoff relizado com sucesso')
        res.redirect('/login')
    })
    
    // Função para adicionar registro ao arquivo Excel
    /*async function adicionarRegistroAoExcel(filePath, ...dados) {
        try {
            const workbook = new ExcelJS.Workbook()
            await workbook.xlsx.readFile(filePath)
            const worksheet = workbook.getWorksheet(2)
            worksheet.addRow(dados)
            await workbook.xlsx.writeFile(filePath)
        } catch (error) {
            console.log('Ocorreu o seguinte erro ao adicionar registro ao Excel -> ' + error)
            throw error
        }
    }*/

//Exportando rotas
    module.exports = router