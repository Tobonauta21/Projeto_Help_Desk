//Importando o Sequelize
    const Sequelize = require('sequelize')

//Configuração do sequelize

    //Caso estivar usando mysql, comentar essa função
    const sequelize = new Sequelize({
        dialect:'sqlite',
        storage:'./helpdesk.db',
    })
    
    //E descomentar essa função, e criar o banco de dados
    /*const sequelize = new Sequelize('helpdesk', 'root', '', {
        host: 'localhost',
        dialect: 'mysql'
    })*/
   
//Exportando módulos do sequelize
    module.exports = {
        Sequelize: Sequelize,
        sequelize: sequelize
    }   
//Autenticando o banco
    /*sequelize.authenticate().then(function(){
        console.log('Conectado ao banco com sucesso')
    }).catch(function(erro){
        console.log('Erro'+erro)
    })*/