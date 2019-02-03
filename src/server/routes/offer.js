var Router = require('koa-router')

const markAs = async (ctx, key, value) => {
  const { mysql } = ctx.services
  const { offerId } = ctx.params

  try {
    await mysql('offers')
      .where({ id: offerId })
      .update({ [key]: value })

    ctx.body = 'OK'
  } catch (error) {
    this.logError(error)
    ctx.throw(500)
  }
}

module.exports = ({ app, middleware }) => {
  var router = new Router({
    prefix: '/offer'
  })

  router.get('/:servicesId', async ctx => {
    const { mysql } = ctx.services
    const { servicesId } = ctx.params

    try {
      const offers = await mysql()
      .table('offers')
      .where({ isReaded: 0, servicesId })

      ctx.body = JSON.stringify({ offers })
    } catch (error) {
      ctx.logError(error)
      ctx.throw(500, 'Nie mozna pobrac Niuchaczy.')
    }
  })

  router.get('/:servicesId/favourite', async ctx => {
    const { mysql } = ctx.services
    const { servicesId } = ctx.params

    try {
      const offers = await mysql()
        .table('offers')
        .where({ isFavourite: 1, servicesId })

      ctx.body = JSON.stringify({ offers })
    } catch (error) {
      ctx.logError(error)
      ctx.throw(500, 'Nie mozna pobrac Niuchaczy.')
    }
  })

  router.post('/markasread/:offerId', ctx => markAs(ctx, 'isReaded', true))

  router.post('/markasfavourite/:offerId', ctx =>
    markAs(ctx, 'isFavourite', true)
  )
  router.post('/markasfavourite/:offerId/remove', ctx =>
    markAs(ctx, 'isFavourite', false)
  )

  app.use(router.routes())
  app.use(router.allowedMethods())
}
