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

module.exports = ({ app }) => {
  var router = new Router({
    prefix: '/offer'
  })

  router.get('/:serviceId', async ctx => {
    const { mysql } = ctx.services
    const { serviceId } = ctx.params

    try {
      const offers = await mysql('offers')
        .where({ isReaded: 0, serviceId })

      ctx.body = JSON.stringify({ offers })
    } catch (error) {
      ctx.logError(error)
      ctx.throw(500, 'Nie mozna pobrac Niuchaczy.')
    }
  })

  router.get('/:serviceId/favourite', async ctx => {
    const { mysql } = ctx.services
    const { serviceId } = ctx.params

    try {
      const offers = await mysql('offers')
        .where({ isFavourite: 1, serviceId })

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

  router.post('/block', async ctx => {
    const { mysql } = ctx.services
    const { locations } = ctx.request.body
    const sql = location => `
      UPDATE services
      SET settings = JSON_ARRAY_APPEND(
        settings,
        '$.locations',
        "${location}"
      )
    `
    await Promise.all(locations.map(l => mysql.raw(sql(l))))
    ctx.body = 200
  })

  app.use(router.routes())
  app.use(router.allowedMethods())
}
