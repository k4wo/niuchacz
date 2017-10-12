const Mongo = require('./db/mongo')()
const Fetch = require('./Fetch')

module.exports = app => async app => ({
  mongo: await Mongo(app),
  fetch: new Fetch()
})
