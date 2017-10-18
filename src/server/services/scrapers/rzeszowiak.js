
const ArrayToObject = require('../../lib/arrayToObject')
const sliceString = require('../../lib/sliceString')
const Scraper = require('./scraper')

class Rzeszowiak extends Scraper {
  static getPageId (url) {
    return url.replace(/\D+/g, '')
  }

  static prepareSubscriptionUrl (url) {
    if (!Scraper.isValidUrl(url)) {
      return ''
    }

    const parsedUrl = Scraper.urlParser(url)
    // first 3 digit id of category
    // next 3 page number
    // next one sort type
    // next 2 offers per page
    // last one show offers from last x days
    const pageId = Rzeszowiak.getPageId(parsedUrl.pathname)
    // change number of offers per page to max (99)
    const newPageId = sliceString(pageId, 7, 2, 99)
    const pathname = parsedUrl.pathname.replace(pageId, newPageId)

    return `${parsedUrl.protocol || 'http:'}//${parsedUrl.hostname}${pathname}`
  }

  static nextPage (url) {
    const currentPageId = Rzeszowiak.getPageId(url)
    const currentPageNo = Rzeszowiak.getPageNo(url)
    const nextPageNo = currentPageNo + 1
    const nextPageFormatted = `00${nextPageNo}`.substr(-3)
    const nextPageId = sliceString(currentPageId, 3, 3, nextPageFormatted)

    return url.replace(currentPageId, nextPageId)
  }

  static getPageNo (url) {
    return +Rzeszowiak.getPageId(url).substr(-7, 3)
  }

  isMoreData (url) {
    const pagesInfo = this.$('#oDnns').textContent
    const splittedPages = pagesInfo.split(' ')

    const lastPage = +splittedPages[splittedPages.length - 1]
    const currentPage = Rzeszowiak.getPageNo(url)

    return currentPage < lastPage
  }

  buildOffer () {
    const map = this.getCoordinates()
    const description = this.getDescription()

    const elements = this.$$('.ogloszeniebox-content')
    const basicInfo = this.getBasicInfo(elements)
    const additionalInfo = this.getAdditionalInfo(elements)

    return Object.assign({}, { map, description }, additionalInfo, basicInfo)
  }

  getCoordinates () {
    const mapEl = this.$('#mapaFD a')
    if (!mapEl) {
      return
    }

    const { href } = mapEl
    return href.split('=')[1].split(',').map(parseFloat)
  }

  getDescription () {
    return this.$('#content-center .content').textContent
  }

  findDetail (html, detailName) {
    return html.firstElementChild.textContent.toLowerCase().includes(detailName)
  }

  getAdditionalInfo (html) {
    const startIndex = html.findIndex(item => (
      item.previousElementSibling.textContent.toLowerCase().includes('dane dodatkowe')
    ))
    if (startIndex === -1) {
      return {}
    }

    const endIndex = html.slice(startIndex).findIndex(item => (
      item.nextElementSibling.getAttribute('class').includes('ogloszeniebox-bottom')
    ))

    const additionalInfo = html
      .slice(startIndex, endIndex + startIndex)
      .filter(detail => detail.children.length > 1)
      .map(details => Array.from(details.children).slice(0, -1))
      .map(details => details.map(detail => detail.textContent.split(':')[0].trim()))

    return ArrayToObject(additionalInfo)
  }

  getBasicInfo (elements) {
    const rawInfo = {
      cena: elements.find(detail => this.findDetail(detail, 'cena'))
    }

    return Object.keys(rawInfo)
      .reduce((store, key) => Object.assign(store, { [key]: rawInfo[key].children[1].textContent }), {})
  }

  getOffersUrl () {
    return this.$$('.normalbox .normalbox-title-left a').map(el => el.href)
  }
}

module.exports = Rzeszowiak
