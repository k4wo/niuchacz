const Mongo = require('./db/mongo')()

module.exports = app => async app => ({
  mongo: await Mongo(app)
})
