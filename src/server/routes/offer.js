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

const mergeMarkAsValues = (offers, personalized) => offers.reduce((newCollection, offer) => {
  const marked = personalized[offer._id.toString()]
  if (!marked) {
    return [...newCollection, offer]
  }

  if (marked.markAsRead) {
    return newCollection
  }

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
        { $sort: { insertDate: -1 } }
      ]).toArray()

      const rawPersonalized = await mongo('personalized').find({}).toArray()
      const personalized = rawPersonalized
        .reduce((store, item) => Object.assign(store, { [item.offer.toString()]: item }), {})

      const offers = mergeMarkAsValues(rawOffers, personalized)
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
