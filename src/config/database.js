/*
 Configuração do banco de dados
*/

module.exports = {
  dialect: 'postgres', // qual o banco
  host: 'localhost',
  port: 5432, // só é necessário se a porta da maquina for diferente da padrão
  username: 'postgres',
  password: 'postgres',
  database: 'postgres', // nome do banco no visualizador de banco usadoe2
  define: {
    timestamps: true, //cria o hsitorico de criação e update
    underscored: true,
    underscoredAll: true, //padroniza no snake case o banco
  },
};
