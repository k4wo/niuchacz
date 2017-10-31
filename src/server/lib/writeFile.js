const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const writeFile = promisify(fs.writeFile)

module.exports = (filePath, fileBody) => {
  const pathToFile = path.join(__dirname, filePath)
  return writeFile(pathToFile, fileBody)
}
