//Importando conexão
    const db = require('./Conn')
    
//Criando a tabela
    const Call = db.sequelize.define('Call',{
        nome:{type:db.Sequelize.STRING,allowNull:false},
        email:{type:db.Sequelize.STRING,allowNull:false},
        senha:{type:db.Sequelize.STRING,allowNull:false},
    })

//Sincronização
    Call.sync({force:true})
//Exportando a tabela
