//Importando conexão
    const db = require('./Conn')
    const Ocorrencia = require('./Ocorrencia')
//Criando a tabela
    const Call = db.sequelize.define('Call',{
        nomeUser:{type:db.Sequelize.STRING,allowNull:false},
        codigo:{type:db.Sequelize.STRING,allowNull:false},
        empresa:{type:db.Sequelize.STRING,allowNull:false},
        status:{type:db.Sequelize.STRING,allowNull:false},
        prioridade:{type:db.Sequelize.STRING,allowNull:false},
    })

    Call.belongsTo(Ocorrencia,{foreigKey:'ocorrenciaId'})

//Sincronização
    //Call.sync({force:true})
//Exportando a tabela
    module.exports = Call