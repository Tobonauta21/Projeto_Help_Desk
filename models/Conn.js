//Importando o Sequelize
    const Sequelize = require('sequelize')

//Configuração do sequelize
    /*const sequelize = new Sequelize({
        dialect:'sqlite',
        storage:'./helpdesk.db',
    })
    */
   const sequelize = new Sequelize('helpdesk', 'root', '', {
        host: 'localhost',
        dialect: 'mysql'
    });
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