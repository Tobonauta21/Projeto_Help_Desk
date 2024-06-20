//Importando módulos
    const db = require('./Conn')
    
//Criando a tabela
    const Ocorrencia = db.sequelize.define('ocorrencias',{
        status:{type:db.Sequelize.STRING,allowNull:false},
    })

async function syncAndSeed() {
        try {
           
            await Ocorrencia.sync();
    
            await Ocorrencia.bulkCreate([
                { status: 'Problemas com a internet, intranet ou rede local.' },
                { status: 'Bloqueio de conta por tentativas de acesso incorretas.' },
                { status: 'Erros ao usar programas ou aplicativos específicos.' },
                { status: 'Esquecimento de senha.' },
                { status: 'Dificuldades no envio, recebimento ou acesso a e-mails.' },
                { status: 'Pedidos para instalação ou atualização de softwares.' },
                { status: 'Pedidos para adquirir novos dispositivos ou equipamentos.' },
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
    Ocorrencia.sync()
//Exportando a tabela
    module.exports = Ocorrencia