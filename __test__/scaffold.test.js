'use strict'

/* global test, expect, jest */

jest.mock('fs')

const scaffold = require('../lib/scaffold')
const nock = require('nock')

test('should fetch github repo latest tag', () => {
  nock('https://api.github.com')
    .get('/repos/hakimel/reveal.js/releases/latest')
    .reply(200, {
      tag_name: 'latest-tag'
    })
  return scaffold.fetchGithubInfo()
    .then(tag => {
      expect(tag).toEqual('latest-tag')
    })
})

test('should fail to fetch repo latest tag', () => {
  nock('https://api.github.com')
    .get('/repos/hakimel/reveal.js/releases/latest')
    .reply(404)
  return scaffold.fetchGithubInfo()
    .catch(error => {
      expect(error).toEqual(404)
    })
})

test('should failt to fetch latest repo data, 404', () => {
  nock('https://github.com')
    .get(`/hakimel/reveal.js/archive/test.zip`)
    .reply(404)
  return scaffold.fetchLatestRelease('test', 'pwerowiejroiwjer')
    .catch(error => {
      expect(error).toEqual(404)
    })
})

test('should fail, could not write file, data corrupted', () => {
  nock('https://github.com')
    .get(`/hakimel/reveal.js/archive/test.zip`)
    .reply(200, new Buffer([2, 4, 3, 5, 4, 5]))
  return scaffold.fetchLatestRelease('test', 'corrupted')
    .catch(err => {
      expect(err).toBeTruthy()
    })
})

test('should fetch latest repo data', () => {
  nock('https://github.com')
    .get(`/hakimel/reveal.js/archive/test.zip`)
    .reply(200, new Buffer([2, 4, 3, 5, 4, 5]))
  return scaffold.fetchLatestRelease('test', 'ojwoeijroiwejrwer')
    .then(fileName => {
      expect(fileName).toBeTruthy()
    })
})

test('should fail to read backup files', () => {
  return scaffold.fetchFallbackCopy('corrupted', 'something')
    .catch(err => {
      expect(err).toBeTruthy()
    })
})

test('should fail to write backup files', () => {
  return scaffold.fetchFallbackCopy('something', 'corrupted')
    .catch(err => {
      expect(err).toBeTruthy()
    })
})

test('should successfully write backup files', () => {
  return scaffold.fetchFallbackCopy('something', 'something')
    .then(result => {
      expect(result).toEqual('something')
    })
})

test('should unzip and remove unnecessary files', () => {
  return scaffold.trimFiles('somefile.zip', 'somedirectory/', '3.3.0')
    .then((result) => {
      expect(result).toBeUndefined()
    })
})
