const knex = require("knex");

const Mysql = ({ config }) =>
  knex({
    client: "pg",
    connection: {
      port: 5432,
      host: config.mysql.host,
      user: config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.database
    }
  });

module.exports = Mysql;
