//Módulos
    const express = require('express')
    const router = express.Router()
    const Admin = require('../models/Admin')
    const bcrypt = require('bcryptjs')
    const Chamado = require('../models/Chamados')
//Rotas
    router.get('/home',(req,res)=>{

    })
    router.get('/register',(req,res)=>{
        res.render('admin/registroAdmin')
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
                req.flash('error_msg','Erro ao criar perfil adm')
                res.redirect('/admin/register')
            }else{

                const salt = await bcrypt.genSalt(10)
                const hashSenha = await bcrypt.hash(req.body.senha,salt)

                const admin = await Admin.findOne({where:{email:req.body.email}})

                if(admin){
                    req.flash('error_msg','Erro ao criar perfil adm')
                    res.redirect('/admin/register')
                }else{
                    await Admin.create({
                        nome:req.body.nome,
                        email:req.body.email,
                        senha:hashSenha
                    })

                    req.flash('success_msg','Perfil de adm criado com sucesso!')
                    res.redirect('/admin/register')
                }

            }
        }catch(error){
            console.log('Erro ->'+error)
        }
    })

     router.get('/call',(req,res)=>{
        Chamado.findAll().then((ocorrencias)=>{
            res.render('admin/home',{ocorrencias:ocorrencias})
        }).catch((erro)=>{
            console.log('Ocorreu o seguinte erro->'+erro)
        })
    })

    router.post('/login',(req,res)=>{
        Admin.findOne({where:{email:req.body.email}}).then((user)=>{
            if(!user){
                req.flash('error_msg','Usuário não encontrado')
                res.redirect('/login')
            }else{
                bcrypt.compare(req.body.senha,user.senha,(error,match)=>{
                    if(match){
                        //Fazer um token para usuário poder navegar no sistema
                        req.flash('success_msg','Bem-vindo')
                        res.redirect('/admin/home')
                    }else{
                        req.flash('error_msg','Senha inválida'+error)
                        res.redirect('/login')
                    }
                })
            }
        })
    })



//Exportando módulo
    module.exports = router