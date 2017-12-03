const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const winston = require('winston')

const services = require('./services')
const getDirFiles = require('./lib/getDirFiles')()

class KoaLa {
  constructor (config) {
    this.logInfo = winston.info
    this.logError = winston.error
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

    try {
      await this.loadMiddlewares()
      await this.loadServices()
      await this.loadRoutes()
      await this.start()

      setInterval(() => this.watcher(), 1200000)
    } catch (error) {
      this.logError(error)
    }
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

  async start (port = 7777) {
    this.server = this.app.listen(port, () => this.logInfo(`Server is running on ${port}`))
  }

  async stop () {
    this.server.close()
  }

  async watcher () {
    const { mongo, mysql, observer } = this.services

    try {
      const services = await mysql.select().table('services')

      for (const service of services) {
        const serviceId = service.id
        const existingOffers = await mongo('offers')
          .find({ serviceId })
          .sort({ insertDate: -1 })
          .limit(100)
          .toArray()
        const watcher = observer(service.url, existingOffers)
        const newOffers = await watcher.observe(serviceId)

        await this.insertOffers(newOffers)
      }
    } catch (error) {
      this.logError(error)
    }
  }

  async insertOffers (offers) {
    if (!offers.length) {
      return
    }

    const mongo = this.services.mongo('offers')
    for (const offer of offers) {
      const offerFromDb = await mongo.find({ url: offer.url }).toArray()
      if (!offerFromDb.length) {
        mongo.insert(offer)
      }
    }
  }
}

module.exports = KoaLa
