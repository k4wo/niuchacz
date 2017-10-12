const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const Prototype = require('./services/Prototype')
const services = require('./services')
const getDirFiles = require('./lib/getDirFiles')()

class KoaLa extends Prototype {
  constructor (config) {
    super()
    this.config = config
    this.setUpApp()

    this.middleware = {}
    this.services = {}
    this.server = {}
  }

  setUpApp () {
    this.app = new Koa()
    this.app.use(bodyParser())

    this.app.context.logInfo = this.logInfo
    this.app.context.logError = this.logError
  }

  async init () {
    this.logInfo('Booting...')

    await this.loadMiddlewares()
    await this.loadServices()
    await this.loadRoutes()
    await this.start()
  }

  async loadRoutes () {
    this.logInfo('Loading routes...')

    try {
      const routes = await getDirFiles('../routes')
      routes.forEach(route => require(route)(this))
    } catch (error) {
      this.logError(error)
    }
  }

  async loadMiddlewares () {
    this.logInfo('Loading middlewares...')
    await this.loadAndAssign('../middlewares', this.middleware)
  }

  async loadServices () {
    this.logInfo('Loading services...')
    this.services = await services()(this)

    this.app.context.services = this.services
    this.app.context.mongo = await this.services.mongo
  }

  async loadAndAssign (path, assignTo) {
    try {
      const filesList = await getDirFiles(path)
      filesList.forEach((file) => {
        const loadedModule = require(file)
        const { name } = loadedModule

        if (name) {
          assignTo[name] = loadedModule
        } else {
          this.logError(`Module wasn't loaded due lack of name: ${file}`)
        }
      })
    } catch (error) {
      this.logError(error)
    }
  }

  async start (port = 6666, host = '127.0.0.1') {
    this.server = this.app.listen(port, host, () => this.logInfo(`Server is running on ${port}`))
  }

  async stop () {
    this.server.close()
  }
}

module.exports = KoaLa
