const { MongoClient, ObjectID } = require('mongodb')

const Mongo = () => async app => {
  let _db = null
  const { config: { mongo } } = app
  const url = `${mongo.url}:${mongo.port}/${mongo.database}`

  try {
    _db = await MongoClient.connect(url)
  } catch (error) {
    app.logError(error)
  }

  return dbName => _db.collection(dbName)
}

module.exports = { Mongo, ObjectID }
