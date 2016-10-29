'use strict'

const fs = jest.genMockFromModule('fs')

// Mock writeFile
function writeFile (file, data, callback) {
  if (data === 'corrupted') {
    callback(new Error('Data is corrupted'))
  }
  callback()
}

function readFile (file, callback) {
  if (file === 'corrupted') {
    callback(new Error('Read source corrupted'))
  } else {
    callback()
  }
}

// Mock unlink
function unlink (file, callback) {
  callback()
}

fs.writeFile = writeFile
fs.readFile = readFile
fs.unlink = unlink

module.exports = fs
