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
      const rawOffers = await mongo('offers').aggregate([
        { $match: { serviceId: { $in: find } } },
        { $lookup: { from: 'personalized', localField: '_id', foreignField: 'offer', as: 'marked' } }
      ]).toArray()
      const offers = rawOffers.filter(offer => !offer.marked[0] || !offer.marked[0].markAsRead)

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
