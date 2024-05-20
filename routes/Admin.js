//Módulos
    const express = require('express')
    const router = express.Router()
    const Admin = require('../models/Admin')
    const bcrypt = require('bcryptjs')
//Rotas
    router.get('/register',(req,res)=>{
        res.render('registroAdmin')
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
                res.render('/admin/register',{erros:erros})
            }else{

                const salt = await bcrypt.genSalt(10)
                const hashSenha = await bcrypt.hash(req.body.senha,salt)

                const admin = await Admin.findOne({where:{email:req.body.email}})

                if(admin){
                    //Colocar mensagem req flash de erro aqui
                }else{
                    await Admin.create({
                        nome:req.body.nome,
                        email:req.body.email,
                        senha:hashSenha
                    })

                    //Colocar mensagem flash de sucesso aqui
                    res.redirect('/admin/register')
                }

            }
        }catch(error){
            console.log('Erro ->'+error)
        }
    })

    router.get('/call',(req,res)=>{
        
    })



//Exportando módulo
    module.exports = router