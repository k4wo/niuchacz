const querystring = require('querystring')

module.exports = data => {
  return {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(querystring.stringify(data))
  }
}
