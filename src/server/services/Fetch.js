const urlParser = require('url')
const http = require('http')
const https = require('https')
const { Iconv } = require('iconv')

class Fetch {
  constructor () {
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
      console.log(error)
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
      .setEncoding('binary')
      .on('data', chunk => { rawData += chunk })
      .on('end', () => {
        const body = Buffer.alloc(rawData.length, rawData, 'binary')
        const text = new Iconv('latin2', 'utf8')
        resolve(
          text.convert(body).toString()
        )
      })
  }

  getFetcher (url) {
    const { protocol } = urlParser.parse(url)
    return protocol === 'https:' ? https : http
  }
}

module.exports = Fetch
