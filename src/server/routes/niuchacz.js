var Router = require('koa-router')

module.exports = ({ app, middleware }) => {
  var router = new Router({
    prefix: '/niuchacz'
  })

  router.get('/', async ctx => {
    const { mysql } = ctx.services

    try {
      const bundles = await mysql('services')
      ctx.body = JSON.stringify(bundles)
    } catch (error) {
      ctx.logError(error)
      ctx.throw(500, 'Nie mozna pobrac Niuchaczy.')
    }
  })

  app.use(router.routes())
  app.use(router.allowedMethods())
}
