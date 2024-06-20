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

    async function syncAndSeed() {
        try {
           
            await users.sync();
    
            await users.bulkCreate([
                { nome: 'Usuário 1',empresa:'Empresa genérica',nasc:'00/00/0000',cidade:'Cruzeiro',email:'user1@user',senha:'12345'},
                { nome: 'Usuário 2',empresa:'Empresa genérica',nasc:'00/00/0000',cidade:'Cruzeiro',email:'user2@user',senha:'12345'},
                { nome: 'Usuário 3',empresa:'Empresa genérica',nasc:'00/00/0000',cidade:'Cruzeiro',email:'user3@user',senha:'12345'},

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

//Sincronizando a tabela com o banco 
    users.sync()

//Exportando módulos
    module.exports = users