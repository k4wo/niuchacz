const Mysql = require('./db/mysql')
const fetch = require('./Fetch')()
const Rzeszowiak = require('./scrapers/rzeszowiak')
const Observer = require('./Observer')
const textEncoder = require('./TextEncoder')

module.exports = app => async app => ({
  mysql: Mysql(app),
  observer: (url, existingOffersId) => new Observer(url, existingOffersId, app),
  fetch,
  textEncoder,
  rzeszowiak: (html, headers) => new Rzeszowiak(app, html, headers)
})
