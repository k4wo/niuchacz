const urlParser = require('url')
const http = require('http')
const https = require('https')

const Prototype = require('./Prototype')

class Fetch extends Prototype {
  constructor () {
    super()
    this.contentType = 'text/html'
  }

  fetch (url) {
    const fetcher = this.getFetcher(url)
    return new Promise((resolve, reject) => {
      fetcher.get(url, res => this.consumeBody(res, resolve, reject))
        .on('err', err => reject(err))
    })
  }

  async get (url) {
    if (typeof url !== 'string') {
      return ''
    }

    try {
      const response = await this.fetch(url)
      if (typeof response !== 'string' && response.statusCode === 301) {
        return this.get(response.url)
      }

      return response
    } catch (error) {
      this.logError(error)
    }
  }

  consumeBody (response, resolve, reject) {
    const { statusCode } = response
    const [contentType] = response.headers['content-type'].split(';')
    const errors = []

    if (statusCode === 301) {
      response.resume()
      return resolve({ statusCode, url: response.headers.location })
    } else if (statusCode !== 200) {
      const error = new Error(`Response returned code: ${statusCode}`)
      errors.push(error)
    }

    if (contentType !== this.contentType) {
      const error = new Error(`Wrong content type. Expected is ${this.contentType}, given is ${contentType}`)
      errors.push(error)
    }

    if (errors.length) {
      response.resume()
      return reject(new Error(errors.toString()))
    }

    let rawData = ''
    response
      .setEncoding('utf8')
      .on('data', chunk => { rawData += chunk })
      .on('end', () => resolve(rawData))
  }

  getFetcher (url) {
    const { protocol } = urlParser.parse(url)
    return protocol === 'https:' ? https : http
  }
}

module.exports = Fetch
