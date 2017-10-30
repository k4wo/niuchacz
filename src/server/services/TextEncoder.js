const { Iconv } = require('iconv')

const encode = (text, from, to = 'utf8') => {
  const _buffer = Buffer.alloc(text.length, text, 'binary')
  const iconv = new Iconv(from, to)

  return iconv.convert(_buffer).toString()
}

module.exports = encode
