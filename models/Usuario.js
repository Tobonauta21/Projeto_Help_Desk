//Importando módulos
const db = require('./Conn')

//Criando a tabela de administradores
    const users = db.sequelize.define('users',{
        nome:{type:db.Sequelize.STRING,allowNull:false},
        empresa:{type:db.Sequelize.STRING,allowNull:false},
        nasc:{type:db.Sequelize.STRING,allowNull:false},
        cidade:{type:db.Sequelize.STRING,allowNull:false},
        email:{type:db.Sequelize.STRING,allowNull:false},
        senha:{type:db.Sequelize.STRING,allowNull:false},
    })

//Sincronizando a tabela com o banco 
    //users.sync({force:true})

//Exportando módulos
    module.exports = users