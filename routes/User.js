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

                    //Colocar mensagem flash de sucesso aqui
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
            //Colocar mensagem flash aqui
            console.log('Ocorreu o seguinte erro->'+erro)
        })
    })

    router.post('/regis_call', async (req, res) => {
        try{
             Usuario.findOne({where:{id:req.session.nuserId}}).then(urs=>{
                Chamado.create({
                    nomeUser:urs.nome,
                    empresa:urs.empresa,
                    codigo:req.body.ocorrencias,
                    status:'Aberto',
                    prioridade:req.body.prioridade,
                    ocorrenciaId:req.body.ocorrencias
                }).then(()=>{
                    req.flash('success_msg','Chamado criado com sucesso!')
                    res.redirect('/user/home')
                }).catch(err=>{
                    //Colocar mensagem flash aqui
                    console.log(err)
                })
            }).catch(err=>{
                //Colocar mensagem flash aqui
                console.log(err)
            })
        }catch(err){
            //Colocar mensagem flash aqui
            console.log(err)
        }
        
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

        Usuario.findOne({where:{id:req.session.nuserId}}).then(usr=>{
            if(usr){
                try{
                    Chamado.findAll({where:{nomeUser:usr.nome}}).then(call=>{
                        res.render('src/home',{call:call})
                    }).catch(err=>{
                        console.log(err)
                    })
                }catch(err){
                    //Colocar mensagem flash aqui
                    console.log(err)
                }
            }else{
                req.flash('error_msg','Faça login para ter acesso a plataforma!')
                res.redirect('/login')
            }
        }).catch(err=>{
            //Colocar mensagem flash aqui
            console.log(err)
        })

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