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

      this.watcher()
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
  }

  async loadAndAssign (path, assignTo) {
    try {
      const filesList = await getDirFiles(path)
      filesList.forEach(file => {
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
    this.server = this.app.listen(port, () =>
      this.logInfo(`Server is running on ${port}`)
    )
  }

  async stop () {
    this.server.close()
  }

  async watcher () {
    const { mysql, observer } = this.services

    try {
      const services = await mysql.select().table('services')

      for (const service of services) {
        const serviceId = service.id
        const existingOffers = await mysql('offers').where({ serviceId })
        const watcher = observer(service.url, existingOffers)
        const newOffers = await watcher.observe(serviceId)

        await this.insertOffers(newOffers, existingOffers)
      }
    } catch (error) {
      this.logError(error)
    }
  }

  async insertOffers (offers, existingOffers) {
    if (!offers.length) {
      return
    }
    const urls = existingOffers.map(offer => offer.url)
    const hashes = existingOffers.map(offer => offer.hash)

    for (const offer of offers) {
      if (urls.includes(offer.url) || hashes.includes(offer.hash)) {
        continue
      }

      await this.services.mysql('offers').insert(offer)
    }
  }
}

module.exports = KoaLa
