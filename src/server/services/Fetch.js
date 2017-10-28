const URL = require('url')
const http = require('http')
const https = require('https')
const { Iconv } = require('iconv')

const _options = {
  method: 'GET'
}

const makeRequest = ({request}, options) => {
  return new Promise((resolve, reject) => {
    request(options, response => {
      const { statusCode } = response
      const [contentType, charset] = response.headers['content-type'].split(';')
      const errors = []

      if (statusCode === 301) {
        response.resume()
        return resolve({ statusCode, url: response.headers.location })
      } else if (statusCode !== 200) {
        const error = new Error(`Response returned code: ${statusCode}`)
        errors.push(error)
      }

      if (options.contentType && options.contentType !== contentType.trim()) {
        const msg = `Incorrect content type. Expected is ${options.contentType}, given is ${contentType}`
        const error = new Error(msg)
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
          const encoding = options.encoding || (charset && charset.trim())
          if (encoding && !encoding.toUpperCase().includes('UTF-8')) {
            const body = Buffer.alloc(rawData.length, rawData, 'binary')
            const text = new Iconv(encoding, 'utf8')
            rawData = text.convert(body).toString()
          }

          resolve(rawData)
        })
    })
      .on('error', err => reject(err))
      .end()
  })
}

const fetch = async (request) => {
  const reqOptions = typeof request === 'string' ? { url: request } : request
  const { protocol, hostname, path } = URL.parse(reqOptions.url)
  const fetcher = protocol === 'https:' ? https : http

  const options = Object.assign(_options, reqOptions, { hostname, path })
  const response = await makeRequest(fetcher, options)
  if (typeof response !== 'string' && response.statusCode === 301) {
    return fetch(request)
  }

  return response
}

module.exports = () => fetch
