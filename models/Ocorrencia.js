//Importando módulos
    const db = require('./Conn')
    
//Criando a tabela
    const Ocorrencia = db.sequelize.define('ocorrencias',{
        status:{type:db.Sequelize.STRING,allowNull:false},
    })

//Sincronização
    Ocorrencia.sync()
//Exportando a tabela
    module.exports = Ocorrencia