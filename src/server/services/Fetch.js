const querystring = require('querystring')
const URL = require('url')
const http = require('http')
const https = require('https')

const _options = {
  method: 'GET'
}

const preparePostData = ({ headers, data }) => {
  if (!data || !headers) {
    return ''
  }

  const contentType = headers['Content-Type']
  if (contentType.includes('x-www-form-urlencoded')) {
    return querystring.stringify(data)
  } else if (typeof data === 'object') {
    return JSON.stringify(data)
  }

  return data
}

const makeRequest = ({ request }, options) => {
  return new Promise((resolve, reject) => {
    const req = request(options, response => {
      const { statusCode } = response
      const [contentType] = response.headers['content-type'].split(';')
      const errors = []

      if (statusCode === 301) {
        response.resume()
        return fetch(Object.assign({}, options, { url: response.headers.location }))
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
        .on('end', () => resolve({ data: rawData, headers: response.headers }))
    })

    req.write(preparePostData(options))
    req.on('error', err => reject(err))
    req.end()
  })
}

const fetch = async (request) => {
  const reqOptions = typeof request === 'string' ? { url: request } : request
  const { protocol, hostname, path } = URL.parse(reqOptions.url)
  const fetcher = protocol === 'https:' ? https : http

  const options = Object.assign(_options, reqOptions, { hostname, path })
  const response = await makeRequest(fetcher, options)

  return response
}

module.exports = () => fetch
