var Router = require('koa-router')

const markAs = async (ctx, key) => {
  const { mongo, mongoId } = ctx.services
  const { offerId } = ctx.params

  try {
    const offer = mongoId(offerId)
    await mongo('personalized').update(
      { offer },
      { $set: { [key]: true, offer } },
      { upsert: true }
    )

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
    const { mongo } = ctx.services
    const { servicesId } = ctx.params
    const find = servicesId.split(',').map(id => +id)

    try {
      const offers = await mongo('offers').find({ serviceId: { $in: find } }).toArray()

      ctx.body = JSON.stringify({ offers })
    } catch (error) {
      ctx.logError(error)
      ctx.throw(500, 'Nie mozna pobrac Niuchaczy.')
    }
  })

  router.post('/markasread/:offerId', ctx => markAs(ctx, 'markAsRead'))

  router.post('/markasfavourite/:offerId', ctx => markAs(ctx, 'markAsFavourite'))

  app.use(router.routes())
  app.use(router.allowedMethods())
}
