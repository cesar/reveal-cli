'use strict'

const Promise = require('bluebird')
const path = require('path')
const ADM = require('adm-zip')
const uuid = require('uuid')
const request = require('request')
const fs = require('fs')
const async = require('async')
const chalk = require('chalk')

/**
 * Fetch latest stable release from Github
 *
 * If successful, resolve promise, else reject
 * promise with the stderr as the parameters
 * @return [Promise]
 */
const main = (argv) => {
  let t
  let tempFileName = `${uuid.v1()}.zip`
  fetchGithubInfo()
    .then(tag => {
      t = tag
      return fetchLatestRelease(tag, tempFileName)
    }, () => {
      // Failed to get information from Github, transition to local copy
      let blueprintDirectory = path.resolve(__dirname, '../blueprint/reveal.js-3.3.0.zip')
      return fetchFallbackCopy(blueprintDirectory, tempFileName)
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
    console.log(chalk.green('Fetching latest reveal.js release...'))
    let latestReleaseInfo = {
      uri: 'https://api.github.com/repos/hakimel/reveal.js/releases/latest',
      headers: {
        'User-Agent': 'request'
      },
      json: true
    }
    request(latestReleaseInfo, (error, response, body) => {
      if (error || response.statusCode >= 400) {
        console.error(chalk.yellow('Error fetching latest reveal.js release, accessing cached files...'))
        reject(error || response.statusCode)
      } else {
        console.log(chalk.green(`Successfully fetched latest release (${body.tag_name}) information`))
        resolve(body.tag_name)
      }
    })
  })
}

const fetchLatestRelease = (tag, tempFileName) => {
  return new Promise((resolve, reject) => {
    let latestRelease = {
      url: `https://github.com/hakimel/reveal.js/archive/${tag}.zip`,
      encoding: null
    }
    request(latestRelease, function (error, response, body) {
      if (error || response.statusCode >= 404) {
        console.error(chalk.yellow('Error fetching latest reveal.js release files, accessing cached files...'))
        reject(error || response.statusCode)
      } else {
        fs.writeFile(tempFileName, body, err => {
          if (err) {
            reject(err)
          } else {
            console.log(chalk.green(`Fetched ${tag} release project files`))
            resolve(tempFileName)
          }
        })
      }
    })
  })
}

const fetchFallbackCopy = (blueprintDirectory, tempFileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(blueprintDirectory, (err, data) => {
      if (err) {
        reject(err)
      } else {
        fs.writeFile(tempFileName, data, err => {
          if (err) {
            reject(err)
          } else {
            console.log(chalk.yellow('Copying files from local cache'))
            resolve(tempFileName)
          }
        })
      }
    })
  })
}

const trimFiles = (zipfile, directory, tag) => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'test') {
      let zip = new ADM(path.join(process.cwd(), zipfile))
      zip.extractAllTo(process.cwd(), true)
    }
    console.log(chalk.green('Removing unnecessary files...'))
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
        console.log(chalk.green(`Project ${directory} created successfully`))
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
