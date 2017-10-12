const { MongoClient, ObjectID } = require('mongodb')

const Mongo = app => async app => {
  let _db = null
  const { config: { mongo } } = app
  const url = `${mongo.url}:${mongo.port}/${mongo.database}`

  try {
    _db = await MongoClient.connect(url)
  } catch (error) {
    app.logError(error)
  }

  return dbName => ({
    /**
     * Validate data
     * Iterate over data and send it to @replaceOne fn.
     *
     * @public
     * @param {object} data replace existing object with it
     * @param {string} filter of document
     * @returns {array} of promises
     */
    replace: (data, filter) => _db.collection(dbName).replaceOne(filter, data),

    /**
     * Insert one or more documents.
     *
     * @public
     * @param {object|array} data
     * @returns {promise}
     */
    insert: data => _db.collection(dbName).insert(data).then(({ ops }) => ops.length === 1 ? ops[0] : ops),

    /**
     * Modify a document.
     *
     * @public
     * @param {object} data will be inserted to db
     * @param {object} filter Items in db must meet this requirements
     * @param {boolean} upsert true means insert if don't exist
     * @returns {promise}
     */
    update: (data, filter, upsert) => _db.collection(dbName).update(data, filter, upsert),

    /**
     * Find documents that meet criteria (query).
     *
     * @public
     * @param {object} query
     * @param {number} limit of result of query
     * @returns {promise}
     */
    find: (query = {}, limit = 0) => _db.collection(dbName).find(query).skip(limit).toArray(),

    /**
     * Remove documents that meet criteria (query).
     *
     * @public
     * @param {string} collection
     * @param {object} query
     * @returns {promise}
     */
    remove: query => _db.collection(dbName).remove(query),

    /**
     * Returns valid object id
     *
     * @public
     * @param {string} id
     * @returns {ObjectID}
     */
    getObjectId: id => ObjectID(id),

    /**
     *
     *
     * @public
     * @param {string} from collection name
     * @param {string} localField field name in collection (not from)
     * @param {string} foreignField field name in collection from
     * @param {object} match
     * @returns {promise}
     */
    join: (from, localField, foreignField, match = {}) => _db.collection(dbName)
      .aggregate([
        { $match: match },
        {
          $lookup: { from, localField, foreignField, as: 'join' }
        }])
      .toArray()
      .then(result => result.length === 1 ? result[0] : result)
  })
}

module.exports = Mongo
