//Importando conexão
    const db = require('./Conn')
    const Ocorrencia = require('./Ocorrencia')
//Criando a tabela
    const Call = db.sequelize.define('Call',{
        nomeUser:{type:db.Sequelize.STRING,allowNull:false},
        codigo:{type:db.Sequelize.STRING,allowNull:false},
        descricao:{type:db.Sequelize.STRING,allowNull:false},
        empresa:{type:db.Sequelize.STRING,allowNull:false},
        status:{type:db.Sequelize.STRING,allowNull:false},
        prioridade:{type:db.Sequelize.STRING,allowNull:false},
    })

    Call.belongsTo(Ocorrencia,{foreigKey:'ocorrenciaId'})

//Seeder
    async function syncAndSeed() {
        try {
           
            await Call.sync();
    
            await Call.bulkCreate([
                { nomeUser: 'Usuário 1',codigo:'1',descricao:'chamado1',empresa:'Empresa genérica',status:'Aberto',prioridade:'leve',ocorrenciaId:1},
                { nomeUser: 'Usuário 2',codigo:'2',descricao:'chamado2',empresa:'Empresa genérica',status:'Aberto',prioridade:'medio',ocorrenciaId:2},
                { nomeUser: 'Usuário 3',codigo:'3',descricao:'chamado3',empresa:'Empresa genérica',status:'Aberto',prioridade:'alta',ocorrenciaId:3},
            ], {
                ignoreDuplicates: true
            });
            console.log('Tabela Ocorrencia criada com sucesso e dados iniciais inseridos.');
        } catch (error) {
            console.error('Erro ao criar a tabela Ocorrencia ou inserir dados iniciais:', error);
        }
    }

    //Descomentar aqui para criar dados para as tabelas
    //syncAndSeed()

//Sincronização
    Call.sync()
//Exportando a tabela
    module.exports = Call