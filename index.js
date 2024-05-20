
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
        res.render('index')
    })
    app.use('/admin',admin)
    app.use('/user',user)
//Subindo o servidor
    app.listen(3000,(req,res)=>{
        console.log('Servidor ouvindo em localhost:3000')
    })

/*    
const ExcelJS = require('exceljs');

//Carrega o arquivo Excel existente
const workbook = new ExcelJS.Workbook();
workbook.xlsx.readFile('data.xlsx')
  .then(function() {
    // Obtém a planilha desejada (assumindo que é a primeira planilha)
    const worksheet = workbook.getWorksheet(1);

    // Insere uma nova linha de dados na planilha
    worksheet.addRow(['2001', 'MAR','REGIÃO SUDESTE','SÃO PAULO','ÓLEO DIESEL','R$ 40.4148,59']);

    // Salva o workbook atualizado
    return workbook.xlsx.writeFile('data.xlsx');
  })
  .then(function() {
    console.log("Nova linha inserida com sucesso!");
  })
  .catch(function(error) {
    console.log("Erro ao inserir nova linha:", error);
  });*/