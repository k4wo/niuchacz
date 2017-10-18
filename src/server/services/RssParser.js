const XMLParser = require('xml2js-parser')
const { promisify } = require('util')

const Prototype = require('./Prototype')

class RRSParser extends Prototype {
  constructor () {
    super()
    this.parser = promisify(XMLParser.parseString)
    this.keyMap = {
      'dc:format': 'format',
      'dc:date': 'date',
      'dc:source': 'source',
      'dc:creator': 'creator',
      'format': 'format',
      'date': 'date',
      'source': 'source',
      'creator': 'creator',
      'title': 'title',
      'link': 'link',
      'description': 'description'
    }
  }

  parse (xml) {
    return this.parser(xml)
  }

  unifyKey (key, offer) {
    const value = Array.isArray(offer[key]) ? offer[key][0] : offer[key]
    return { [this.keyMap[key]]: value }
  }

  parseOffers (feed) {
    const [rootKey] = Object.keys(feed)
    const offers = feed[rootKey].item

    return offers.map(offer => {
      return Object.keys(offer).reduce((o, key) => Object.assign(o, this.unifyKey(key, offer)), {})
    })
  }

  async read (feed) {
    try {
      var parsedXML = await this.parse(feed)
      return this.parseOffers(parsedXML)
    } catch (error) {
      this.logError(error)
    }
  }
}

module.exports = RRSParser
