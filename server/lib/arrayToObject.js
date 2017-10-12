const _flatten = require('lodash.flatten')

module.exports = arr => {
  if (!Array.isArray(arr)) {
    return {}
  }

  const _arr = _flatten(arr)
  const converted = {}
  for (let i = 0; i < arr.length; i + 2) {
    converted[_arr[i]] = _arr[i + 1]
  }

  return converted
}
