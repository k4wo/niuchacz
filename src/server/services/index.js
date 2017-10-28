const { Mongo, ObjectID } = require('./db/mongo')
const Mysql = require('./db/mysql')
const fetch = require('./Fetch')()
const Rzeszowiak = require('./scrapers/rzeszowiak')
const Observer = require('./Observer')

module.exports = app => async app => ({
  mongo: await Mongo()(app),
  mongoId: ObjectID,
  mysql: Mysql(app),
  observer: (url, existingOffersId) => new Observer(url, existingOffersId, app),
  fetch,
  Rzeszowiak
})
