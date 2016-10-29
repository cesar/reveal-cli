'use strict'

const request = jest.genMockFromModule('request')


function mockRequest (options, callback) {
  let body = options.encoding ? {} : new Buffer()
  let response = new Buffer()
  callback(null, response, body)
}
