module.exports = (string, start, length, ...replace) => {
  if (length === undefined) {
    string.substr(start)
  }
  const endOfBeginning = start < 0 ? start + string.length : start
  const startOfEnd = endOfBeginning + length

  const begining = string.substr(0, endOfBeginning)
  const end = string.substr(startOfEnd)

  return `${begining}${replace.join('')}${end}`
}
