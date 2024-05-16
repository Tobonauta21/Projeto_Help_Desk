//Importando o Sequelize
    const sequelize = require('sequelize')

//Configuração do sequelize
    const sequelize = new Sequelize({
        dialect:'sqlite',
        storage:'/home/igor/Documentos/Curso_NodeJS/AppExpress/models/banco.db',
    })
//Exportando módulos do sequelize
    module.exports = {
        Sequelize: Sequelize,
        sequelize: sequelize
    }   
//Autenticando o banco
    sequelize.authenticate().then(function(){
        console.log('Conectado ao banco com sucesso')
    }).catch(function(erro){
        console.log('Erro'+erro)
    })