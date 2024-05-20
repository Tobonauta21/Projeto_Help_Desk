//Módulos
    const express = require('express')
    const router = express.Router()
    const User = require('../models/Usuario.js')
    const bcrypt = require('bcryptjs')

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

//Exportando rotas
    module.exports = router