const urlParser = require('url')
const { JSDOM } = require('jsdom')

const Prototype = require('../Prototype')

class Scraper extends Prototype {
  static isValidUrl (str) {
    var pattern = new RegExp('^(https?:\/\/)?' + // protocol
      '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|' + // domain name
      '((\d{1,3}\.){3}\d{1,3}))' + // OR ip (v4) address
      '(\:\d+)?(\/[-a-z\d%_.~+]*)*' + // port and path
      '(\?[;&a-z\d%_.~+=-]*)?' + // query string
      '(\#[-a-z\d_]*)?$', 'i') // fragment locater

    return pattern.test(str)
  }

  static urlParser (url) {
    const parsedUrl = urlParser(url)
    return Object.assign({}, parsedUrl, { hostname: parsedUrl.hostname.replace(/^www./, '') })
  }

  constructor (htmlString) {
    super()
    const { window } = new JSDOM(htmlString)
    this.html = window.document
  }

  $ (query) {
    return this.html.querySelector(query)
  }

  $$ (query) {
    const found = this.html.querySelectorAll(query)
    return Array.from(found)
  }
}

module.exports = Scraper
