const knex = require('knex')

const Mysql = ({ config }) => knex({
  client: 'mysql',
  connection: {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
  }
})

module.exports = Mysql
