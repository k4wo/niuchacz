var Router = require('koa-router')

const markAs = async (ctx, key) => {
  const { mongo, mongoId } = ctx.services
  const { offerId } = ctx.params

  try {
    await mongo('personalized').update(
      { offer: mongoId(offerId) },
      { $set: { [key]: true, offer: mongoId(offerId) } },
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

  router.get('/:bundleId', async ctx => {
    const { mongo, mongoId } = ctx.services
    const { bundleId } = ctx.params

    try {
      const offers = await mongo('bundles').aggregate([
        { $match: { _id: mongoId(bundleId) } },
        { $lookup: { from: 'offers', localField: '_id', foreignField: 'bundle', as: 'offer' } },
        { $project: { offer: 1 } }
      ]).toArray()

      const toSend = offers.map(item => item.offer)
      ctx.body = JSON.stringify({ offers: toSend })
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
