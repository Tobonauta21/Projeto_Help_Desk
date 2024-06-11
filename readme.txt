==========ATENÇÃO==============================================
Esté é o projeto de um help desk que tem a função de 
registrar chamados de ajuda.
Tem um crossover com PowerBi para mostrar gráficos de
 todos os chamados
===============================================================

=======================================TUTORIAL!!!!====================================
-Requisitos-> NodeJS instalado e Git instalado

Download NodeJS:https://nodejs.org/en/download/package-manager
Download Git:https://www.git-scm.com/downloads

1º Parte-> Pode dar um git clone no repositório do github e para
rodar o sistema, pode dar o comando "node index.js" dentro da pasta
do projeto

2ª Parte->Caso estiver usando o banco de dados MYSQL, você deve acessar
a pasta /models/Conn.js e comentar as linhas que fazem a conexão com o 
banco sqlite e descomentar a conexão com o banco MySQL.

3ª Parte->O sistema possui dois tipos de acesso, o de usuário normal e 
o de admin. O de admin possui as seguintes funcionalidades:
-Ver todos os chamados, e fechar os chamados abertos
-Acesso ao dashboard
-Gerar relatório dos chamados em excel
-Checar todos os usuários dos sistemas
-Logoff

4ª Parte->A parte de usuário normal possui as seguintes funcionalidades:
-Ter acesso aos chamados que apenas ele abriu.
-Registrar novos chamados.
-Alterar os chamados que ele abriu.
-Logoff

5ª Parte->Algumas ressalvas:
-Um novo admin só pode ser registrado caso insira o código de confirmação correto
-O sistema faz a criptografia das senhas de novos usuários cadastrados
-O sistema possui a funcionalidade de sessão, então algumas url só serão liberadas
caso o usuário faça login.
-O admin tem o sistema de filtro para selecionar chamados por prioridade
=======================================================================================