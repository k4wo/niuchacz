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

      if (statusCode === 301) {
        response.resume()
        return fetch(Object.assign({}, options, { url: response.headers.location }))
      } else if (statusCode >= 400) {
        response.resume()
        return reject(new Error(`Response returned code: ${statusCode}`))
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
