'use strict'

const fs = jest.genMockFromModule('fs')

// Mock writeFile
function writeFile (file, data, callback) {
  callback()
}

// Mock unlink
function unlink (file, callback) {
  callback()
}

fs.writeFile = writeFile
fs.unlink = unlink

module.exports = fs
