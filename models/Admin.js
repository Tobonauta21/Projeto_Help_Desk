//Importando módulos
    const db = require('./Conn')

//Criando a tabela de administradores
    const Admin = db.sequelize.define('Admin',{
        nome:{type:db.Sequelize.STRING,allowNull:false},
        email:{type:db.Sequelize.STRING,allowNull:false},
        senha:{type:db.Sequelize.STRING,allowNull:false},
    })

//Sincronizando a tabela com o banco 
    Admin.sync({force:true})

//Exportando módulos
    module.exports = Admin