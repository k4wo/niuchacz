const urlParser = require('url')

class Observer {
  constructor (url, existingOffersId, app) {
    this.logError = app.logError
    this.services = app.services
    this.serviceId = url
    this.currentUrl = url
    this.existingOffersId = existingOffersId.map(offer => offer.url)

    this.newOffersId = []
    this.newOffers = []
    this.Scraper = null
    this.setScraper(url)
  }

  setScraper () {
    const parsedUrl = urlParser.parse(this.currentUrl)

    switch (parsedUrl.hostname) {
      case 'www.rzeszowiak.pl':
        this.Scraper = this.services.rzeszowiak
        break

      default:
        break
    }
  }

  setNextPage () {
    this.currentUrl = this.Scraper.nextPage(this.currentUrl)
  }

  getNewOffers (fetchedOffersId) {
    return fetchedOffersId.filter(offerUrl => !this.existingOffersId.includes(offerUrl))
  }

  async fetchOffers () {
    const html = await this.services.fetch(this.currentUrl)
    const scraper = this.Scraper(html.data)
    const fetchedOffersId = scraper.getOffersUrl()
    const newOffersId = this.getNewOffers(fetchedOffersId)
    const isMoreData = scraper.isMoreData(this.currentUrl)

    this.newOffersId = [...this.newOffersId, ...newOffersId]
    if (isMoreData && (!fetchedOffersId.length || fetchedOffersId.length === newOffersId.length)) {
      this.setNextPage()
      await this.fetchOffers()
    }
  }

  async gatherOfferDetails (serviceId) {
    const cookie = []
    const setCookie = (headers) => {
      headers['set-cookie'].forEach((c, i) => (cookie[i] = c))
      headers['set-cookie'] = cookie
    }

    for (const url of this.newOffersId) {
      const response = await this.services.fetch(url)
      const html = this.services.textEncoder(response.data, 'latin2')
      setCookie(response.headers)

      const Scraper = this.Scraper(html, response.headers)
      const body = Scraper.buildOffer()
      const insertDate = +new Date()

      this.newOffers.push(Object.assign({}, { body, url, serviceId, insertDate }))
    }

    return this.newOffers
  }

  async observe (serviceId) {
    await this.fetchOffers()
    return this.gatherOfferDetails(serviceId)
  }
}

module.exports = Observer
