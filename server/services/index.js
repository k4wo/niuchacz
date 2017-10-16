const Mongo = require('./db/mongo')()
const Mysql = require('./db/mysql')
const Fetch = require('./Fetch')
const Rzeszowiak = require('./scrapers/rzeszowiak')
const Observer = require('./Observer')

module.exports = app => async app => ({
  mongo: await Mongo(app),
  mysql: Mysql(app),
  fetch: new Fetch(),
  Rzeszowiak,
  Observer: (url, existingOffersId) => new Observer(url, existingOffersId, app)
})
