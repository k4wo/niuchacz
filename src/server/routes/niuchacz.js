var Router = require('koa-router')

module.exports = ({ app, middleware }) => {
  var router = new Router({
    prefix: '/niuchacz'
  })

  router.get('/', async ctx => {
    const { mongo } = ctx.services

    try {
      const bundles = await mongo('bundles').find({}).toArray()
      ctx.body = JSON.stringify(bundles)
    } catch (error) {
      ctx.logError(error)
      ctx.throw(500, 'Nie mozna pobrac Niuchaczy.')
    }
  })

  router.post('/add', async ctx => {
    const { url, name } = ctx.request.body
    if (!url || !name) {
      ctx.throw(400, 'Brak wymaganych parametrów.')
    }

    const { mysql, mongo } = ctx.services
    try {
      let [serviceId] = await mysql('services').where({ url }).select('id')
      if (!serviceId) {
        [serviceId] = await mysql('services').insert({ url })
      } else {
        serviceId = serviceId.id
      }

      const mongoBundles = mongo('bundles')
      const [bundle] = await mongoBundles.find({ name }).toArray()
      if (!bundle) {
        await mongoBundles.insert({ name, servicesId: [serviceId] })
      } else if (!bundle.servicesId.includes(serviceId)) {
        const updateWatcher = Object.assign(
          {}, bundle, { servicesId: [...bundle.servicesId, serviceId] }
        )
        await mongoBundles.update({ name }, updateWatcher)
      }
    } catch (error) {
      ctx.throw(400, 'Upss. Cos poszlo nie tak.')
    }

    ctx.body = ctx.request.body
  })

  app.use(router.routes())
  app.use(router.allowedMethods())
}
