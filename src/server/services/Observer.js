const urlParser = require("url");
const crypto = require("crypto");

class Observer {
  constructor(url, existingOffersId, app) {
    this.logError = app.logError;
    this.services = app.services;
    this.serviceId = url;
    this.currentUrl = url;
    this.existingOffersId = existingOffersId.map(offer => offer.url);

    this.newOffersId = [];
    this.newOffers = [];
    this.Scraper = null;
    this.setScraper(url);
  }

  setScraper() {
    const parsedUrl = urlParser.parse(this.currentUrl);

    switch (parsedUrl.hostname) {
      case "www.rzeszowiak.pl":
        this.Scraper = this.services.rzeszowiak;
        break;

      default:
        break;
    }
  }

  getHash(text) {
    if (!text) {
      return "";
    }

    return crypto
      .createHash("md5")
      .update(text)
      .digest("hex");
  }

  getNewOffers(fetchedOffersId) {
    return fetchedOffersId.filter(
      offerUrl => !this.existingOffersId.includes(offerUrl)
    );
  }

  async fetchOffers() {
    const html = await this.services.fetch(this.currentUrl);
    const scraper = this.Scraper(html.data);
    const fetchedOffersId = scraper.getOffersUrl();
    const newOffersId = this.getNewOffers(fetchedOffersId);
    const isMoreData = scraper.isMoreData(this.currentUrl);

    this.newOffersId = [...this.newOffersId, ...newOffersId];
    if (
      isMoreData &&
      (!fetchedOffersId.length || fetchedOffersId.length === newOffersId.length)
    ) {
      this.currentUrl = scraper.nextPage(this.currentUrl);
      return this.fetchOffers();
    }

    return this.newOffersId;
  }

  async fetchOffer(url, serviceId) {
    const cookie = [];
    const setCookie = headers => {
      headers["set-cookie"].forEach((c, i) => (cookie[i] = c));
      headers["set-cookie"] = cookie;
    };

    const response = await this.services.fetch(url);
    const html = this.services.textEncoder(response.data, "latin2");
    setCookie(response.headers);

    const Scraper = this.Scraper(html, response.headers);
    const body = Scraper.buildOffer();
    const hash = this.getHash(body.description);

    return { body, url, serviceId, hash };
  }

  async observe(serviceId) {
    const offers = await this.fetchOffers();
    return offers;
  }
}

module.exports = Observer;
