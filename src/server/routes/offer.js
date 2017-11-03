var Router = require('koa-router')

const markAs = async (ctx, key, value) => {
  const { mongo, mongoId } = ctx.services
  const { offerId } = ctx.params

  try {
    const offer = mongoId(offerId)
    await mongo('personalized').update(
      { offer },
      { $set: { [key]: value, offer } },
      { upsert: true }
    )

    ctx.body = 'OK'
  } catch (error) {
    this.logError(error)
    ctx.throw(500)
  }
}

const mergeMarkAsValues = offers => offers.reduce((newCollection, offer) => {
  if (!offer.marked[0]) {
    return [...newCollection, offer]
  }

  if (offer.marked[0].markAsRead) {
    return newCollection
  }

  const [marked] = offer.marked
  delete offer.marked
  const markAs = Object.keys(marked).reduce((values, key) => (
    ['_id', 'offer'].includes(key) ? values : Object.assign({}, values, { [key]: marked[key] })
  ), {})

  return [...newCollection, Object.assign({}, offer, markAs)]
}, [])

const mergeFavourite = (offers, servicesId) => offers.reduce((newCollection, offer) => {
  const root = offer.root[0]
  delete offer.root
  delete offer.offer

  if (!servicesId.includes(root.serviceId)) {
    return newCollection
  }

  return [...newCollection, Object.assign({}, offer, root)]
}, [])

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
        { $lookup: { from: 'personalized', localField: '_id', foreignField: 'offer', as: 'marked' } },
        { $sort: { insertDate: -1 } }
      ]).toArray()

      const offers = mergeMarkAsValues(rawOffers)
      ctx.body = JSON.stringify({ offers })
    } catch (error) {
      ctx.logError(error)
      ctx.throw(500, 'Nie mozna pobrac Niuchaczy.')
    }
  })

  router.get('/:servicesId/favourite', async ctx => {
    const { mongo } = ctx.services
    const { servicesId } = ctx.params
    const find = servicesId.split(',').map(id => +id)

    try {
      const rawOffers = await mongo('personalized').aggregate([
        { $match: { markAsFavourite: true } },
        { $lookup: { from: 'offers', localField: 'offer', foreignField: '_id', as: 'root' } }
      ]).toArray()

      const offers = mergeFavourite(rawOffers, find)
      ctx.body = JSON.stringify({ offers })
    } catch (error) {
      ctx.logError(error)
      ctx.throw(500, 'Nie mozna pobrac Niuchaczy.')
    }
  })

  router.post('/markasread/:offerId', ctx => markAs(ctx, 'markAsRead', true))

  router.post('/markasfavourite/:offerId', ctx => markAs(ctx, 'markAsFavourite', true))
  router.post('/markasfavourite/:offerId/remove', ctx => markAs(ctx, 'markAsFavourite', false))

  app.use(router.routes())
  app.use(router.allowedMethods())
}
