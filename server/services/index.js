const Mongo = require('./db/mongo')()
const Fetch = require('./Fetch')
const Rzeszowiak = require('./scrapers/rzeszowiak')

module.exports = app => async app => ({
  mongo: await Mongo(app),
  fetch: new Fetch(),
  Rzeszowiak
})
