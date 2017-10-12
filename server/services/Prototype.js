const winston = require('winston')

class Prototype {
  constructor () {
    this.logInfo = winston.info
    this.logError = winston.error
  }
}

module.exports = Prototype
