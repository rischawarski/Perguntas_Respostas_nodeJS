const Sequelize = require('sequelize'); // instancia sequelize ORM JS

const connection = new Sequelize('nodejs','root','',{
    host:'localhost',
    dialect:'mysql'
});//cria a conexao com o mysql

module.exports = connection; // exporta a coneção para poder usar 