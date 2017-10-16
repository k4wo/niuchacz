const urlParser = require('url')

class Observer {
  constructor (url, existingOffersId, app) {
    this.logError = app.logError
    this.services = app.services
    this.serviceId = url
    this.currentUrl = url
    this.existingOffersId = existingOffersId

    this.newOffersId = []
    this.newOffers = []
    this.Scraper = null
    this.setScraper(url)
  }

  setScraper () {
    const parsedUrl = urlParser.parse(this.currentUrl)

    switch (parsedUrl.hostname) {
      case 'www.rzeszowiak.pl':
        this.Scraper = this.services.Rzeszowiak
        break

      default:
        break
    }
  }

  setNextPage () {
    this.currentUrl = this.Scraper.nextPage(this.currentUrl)
  }

  compareOffers (fetchedOffersId) {
    // keep in mind returned offersId can be in DB already because
    // `this.existingOffersId` doesn't contain all offers
    return fetchedOffersId.filter(offerId => !this.existingOffersId.includes(offerId))
  }

  async fetchOffers () {
    try {
      const html = await this.services.fetch.get(this.currentUrl)
      const scraper = new this.Scraper(html)
      const fetchedOffersId = scraper.getOffersUrl()
      const newOffersId = this.compareOffers(fetchedOffersId)
      const isMoreData = scraper.isMoreData(this.currentUrl)

      this.newOffersId = [...this.newOffersId, ...newOffersId]
      if (isMoreData && (!fetchedOffersId.length || fetchedOffersId.length === newOffersId.length)) {
        this.setNextPage()
        await this.fetchOffers()
      }
    } catch (error) {
      this.logError(error)
    }
  }

  async gatherOfferDetails () {
    for (const url of this.newOffersId) {
      const html = await this.services.fetch.get(url)
      const Scraper = new this.Scraper(html)
      const details = Scraper.buildOffer()

      this.newOffers.push(Object.assign(details, { url }))
    }

    return this.newOffers
  }
}

module.exports = Observer
