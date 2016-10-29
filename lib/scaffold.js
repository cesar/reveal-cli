'use strict'

const shell = require('shelljs')
const Promise = require('bluebird')
const path = require('path')
const ADM = require('adm-zip')
const uuid = require('node-uuid')
const request = require('request')
const fs = require('fs')
const async = require('async')

/**
 * Fetch latest stable release from Github
 *
 * If successful, resolve promise, else reject
 * promise with the stderr as the parameters
 * @return [Promise]
 */
const main = (argv) => {
  let t
  fetchGithubInfo()
    .then(tag => {
      t = tag
      return fetchLatestRelease(tag)
    }, () => {
      // Failed to get information from Github, transition to local copy
      return fetchFallbackCopy()
    })
    .then(zipfile => {
      return trimFiles(zipfile, argv.name, t)
    })
    .catch(error => {
      // @TODO ROLLBACK
      cleanup(error.zipfile, error.directory)
    })
}

const fetchGithubInfo = () => {
  return new Promise((resolve, reject) => {
    let latestReleaseInfo = {
      uri: 'https://api.github.com/repos/hakimel/reveal.js/releases/latest',
      headers: {
        'User-Agent': 'request'
      },
      json: true
    }
    request(latestReleaseInfo, (error, response, body) => {
      if (error || response.statusCode >= 400) {
        reject(error)
      } else {
        resolve(body.tag_name)
      }
    })
  })
}

const fetchLatestRelease = (tag) => {
  return new Promise((resolve, reject) => {
    let latestRelease = {
      url: `https://github.com/hakimel/reveal.js/archive/${tag}.zip`,
      encoding: null
    }
    request(latestRelease, function (error, response, body) {
      if (error) {
        reject(error)
      } else {
        let tempFileName = `${uuid.v1()}.zip`
        fs.writeFile(tempFileName, body, err => {
          if (err) {
            reject(err)
          } else {
            resolve(tempFileName)
          }
        })
      }
    })
  })
}

const fetchFallbackCopy = () => {
  return new Promise((resolve, reject) => {
    let copy = path.resolve(__dirname, '../blueprint/reveal.js-3.3.0.zip')
    fs.readFile(copy, (err, data) => {
      if (err) {
        reject(err)
      } else {
        let tempFileName = `${uuid.v1()}.zip`
        fs.writeFile(tempFileName, data, err => {
          if (err) {
            reject(err)
          } else {
            resolve(tempFileName)
          }
        })
      }
    })
  })
}

const generateGitRepo = path => {}

const trimFiles = (zipfile, directory, tag) => {
  return new Promise((resolve, reject) => {
    let zip = new ADM(path.join(process.cwd(), zipfile))
    zip.extractAllTo(process.cwd(), true)
    async.parallel([
      (callback) => {
        fs.rename(path.join(process.cwd(), `reveal.js-${tag}`), path.join(process.cwd(), directory), callback)
      },
      (callback) => {
        fs.unlink(path.join(process.cwd(), zipfile), callback)
      },
      (callback) => {
        fs.unlink(path.join(process.cwd(), directory, 'CONTRIBUTING.md'), callback)
      },
      (callback) => {
        fs.unlink(path.join(process.cwd(), directory, 'demo.html'), callback)
      },
      (callback) => {
        fs.unlink(path.join(process.cwd(), directory, 'LICENSE'), callback)
      },
      (callback) => {
        fs.unlink(path.join(process.cwd(), directory, 'README.md'), callback)
      }
    ], (err, results) => {
      if (err) {
        reject({
          zipfile,
          directory
        })
      } else {
        resolve()
      }
    })
  })
}

// An error ocurred, let's clean it up
// @TODO: Clean up Git repo if any
const cleanup = (temp, directory, git) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path.join(process.cwd(), temp), (err) => {
      if (err) {
        reject(err)
      } else {
        fs.rmdir(path.join(process.cwd(), directory), (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      }
    })
  })
}

module.exports = {
  main,
  fetchGithubInfo,
  fetchLatestRelease,
  fetchFallbackCopy,
  trimFiles,
  cleanup
}
