const Server = require('./server')
const config = require('../../config/config')

const KoaLa = new Server(config)
KoaLa.init()
