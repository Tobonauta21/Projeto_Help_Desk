
//Importando módulos
    const express = require('express')
    const app = new express()
    const {engine} = require('express-handlebars')
    const bodyparser = require('body-parser')
    const path = require('path')
    const admin = require('./routes/Admin')
    const user = require('./routes/User')
    const session = require('express-session')
    const flash = require('connect-flash')
//Configurações
    //Session
        app.use(session({
            secret: 'nodejs',
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    //Middleware
        app.use(function(req,res,next){
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg') 
            res.locals.error = req.flash('error')
            next()
        })

    //BodyParser
        app.use(bodyparser.urlencoded({extended:true}))
        app.use(bodyparser.json())
    //Handlebars
        app.engine('handlebars', engine({defaultLayout:'main', runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        }}));
        app.set('view engine', 'handlebars');
    //Public
        app.use(express.static(path.join(__dirname,'public')))
//Rotas
    app.get('/',(req,res)=>{
        res.redirect('/login')
    })

    app.get('/register',(req,res)=>{
        res.render('register')
    })

    app.get('/login',(req,res)=>{
        res.render('login')
    })
    app.use('/admin',admin)
    app.use('/user',user)
//Subindo o servidor
    app.listen(3000,(req,res)=>{
        console.log('Servidor ouvindo em localhost:3000')
    })

   
