//Módulos
    const express = require('express')
    const router = express.Router()
    const Admin = require('../models/Admin')
    const bcrypt = require('bcryptjs')
    const Chamado = require('../models/Chamados')
    const Ocorrencia = require('../models/Ocorrencia')
    const Usuario = require('../models/Usuario')
    const Exceljs = require('exceljs')
    const workbook = new Exceljs.Workbook();
//Rotas
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

            if(req.body.confirm !='admin'){
                erros.push({msg:'Código de confirmação inválido'})
            }
            if(erros.length > 0){
                console.log(erros)
                req.flash('error_msg','Erro ao criar perfil adm'+erros)
                res.render('admin/register',{error:erros})
            }else{

                const salt = await bcrypt.genSalt(10)
                const hashSenha = await bcrypt.hash(req.body.senha,salt)

                const admin = await Admin.findOne({where:{email:req.body.email}})

                if(admin){
                    req.flash('error_msg','Erro ao criar perfil adm')
                    res.redirect('/register')
                }else{
                    await Admin.create({
                        nome:req.body.nome,
                        email:req.body.email,
                        senha:hashSenha
                    })

                    req.flash('success_msg','Perfil de adm criado com sucesso!')
                    res.redirect('/register')
                }

            }
        }catch(error){
            //Colocar mensagem flash aqui
            console.log('Erro ->'+error)
        }
    })

    router.get('/home',(req,res)=>{

        Admin.findOne({where:{id:req.session.userId}}).then(admin=>{
            if(admin){
                try{
                    Chamado.findAll().then((ocorrencias)=>{
                        res.render('admin/home',{ocorrencias:ocorrencias})
                    }).catch((erro)=>{
                        req.flash('error_msg')
                        console.log('Ocorreu o seguinte erro->'+erro)
                    })
                }catch(error){
                    req.flash('error_msg','Faça login para ter acesso a plataforma!')
                    res.redirect('/login')
                    console.log('erroraquió'+error)
                }
            }else{
                req.flash('error_msg','Faça login para ter acesso a plataforma!')
                res.redirect('/login')
            }
        }).catch(err =>{
            req.flash('error_msg','Ocorreu um erro, tente novamente')
            res.redirect('/login')
            console.log('erro aqui ó '+err)
        })
    })

    router.get('/home/:prio',(req,res)=>{

        try{
            Chamado.findAll({where:{prioridade:req.params.prio}}).then(ocorrencias=>{
                res.render('admin/home',{ocorrencias:ocorrencias})
            })
        }catch(err){

        }
    })

    router.get('/ocorrencia',(req,res)=>{
        res.render('admin/registrarOcorrencia')
    })

    router.post('/ocorrenciar',(req,res)=>{
        Ocorrencia.create({
            status:req.body.descricao
        })

        req.flash('success_msg','Ocorrencia registrada com sucesso')
        res.redirect('/admin/ocorrencia')
    })


    router.post('/login', (req, res) => {
        Admin.findOne({ where: { email: req.body.email } }).then(user => {
            if (!user) {
              req.flash('error_msg', 'Usuário não encontrado')
              res.redirect('/login')
            } else {
              bcrypt.compare(req.body.senha, user.senha, (err, match) => {
                if (match) {
                  req.session.userId = user.id
                  req.flash('success_msg', 'Bem-vindo')
                  res.redirect('/admin/home')
                  console.log(req.session.userId)
                } else {
                  req.flash('error_msg', 'Senha inválida')
                  res.redirect('/login')
                }
              })
            }
          }).catch(err => {
            console.error(err)
            req.flash('error_msg', 'Ocorreu um erro ao tentar fazer login')
            res.redirect('/login')
          })
      })

    router.get('/users',(req,res)=>{
        Usuario.findAll().then((user)=>{
            res.render('admin/usersPage',{user:user})
        }).catch((error)=>{
            req.flash('error_msg','Ocorreu um erro, tente novamente!')
            console.log(error)
        })
    })

    router.get('/logoff',(req,res)=>{
        req.session.userId = null
        req.flash('success_msg','Logoff relizado com sucesso!')
        res.redirect('/login')
    })

    router.get('/gerar_relatorio', async (req, res) => {
        try {
            
            const worksheet = workbook.addWorksheet('Ocorrencias')
           
            worksheet.addRow(['id', 'Nome Usuário', 'Código', 'Empresa', 'Status', 'Prioridade', 'Criado em:', 'Alterado em:', 'Id Ocorrencia'])
            
            const chamados = await Chamado.findAll()
    
            chamados.forEach(chamado => {
                worksheet.addRow([
                    chamado.id,
                    chamado.nomeUser,
                    chamado.codigo,
                    chamado.empresa,
                    chamado.status,
                    chamado.prioridade,
                    chamado.createdAt.toString(), 
                    chamado.updatedAt.toString(), 
                    chamado.ocorrenciaId
                ])
            })
    
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            res.setHeader('Content-Disposition', 'attachment; filename="Relatorio.xlsx"')
            await workbook.xlsx.write(res)
    
            req.flash('success_msg', 'Relatório gerado com sucesso!')
        } catch (err) {
            console.error('Ocorreu o seguinte erro:', err)
            req.flash('error_msg', 'Ocorreu um erro ao gerar o relatório!!!')
        } 
    });

    router.get('/close/:id',async (req,res)=>{
        await Chamado.findOne({where:{id:req.params.id}}).then(call=>{
                call.update({status:'Fechado'},{where:{id:req.params.id}})

                req.flash('success_msg','Chamado fechado')
                res.redirect('/admin/home')
        }).catch(err=>{
            req.flash('error_msg','Ocoreu um erro')
            res.redirect('/admin/home')
            console.log(err)
        })
    })

    router.get('/detail/:id',async (req,res)=>{
        
        try{
            const call = await Chamado.findOne({where:{id:req.params.id}})
            const occ = await Ocorrencia.findOne({where:{id:call.ocorrenciaId}})

            res.render('admin/detalhes',{call:call,occ:occ})
        }catch(err){
            req.flash('error_msg','Ocorreu um erro')
            res.redirect('/admin/home')
        }
       
    })

    router.get('/dashboard',(req,res)=>{
        res.render('src/dashboard')
    })

//Exportando módulo
    module.exports = router