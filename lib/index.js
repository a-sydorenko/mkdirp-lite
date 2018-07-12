'use strict'

const fs = require('fs')
const path = require('path')

module.exports = {
  checker,
  creator,
  mkdirp,
  dirNameToArray
}

/**
 * @function mkdirp
 * @description recursive folder creator
 * @param {string} dirName -
 * @param {function} [callback] -
 * @returns {object|void}
 * */

function mkdirp (dirName, callback) {
  if (!(callback instanceof Function)) {
    return mkdirpPromise(dirName)
  }

  mkdirpCallback(dirName, callback)
}

function mkdirpCallback (dirName, callback) {
  checker(dirNameToArray(dirName), '', 0, (err, pn, last) => {
    creator(last, pn, 0, callback)
  })
}

function mkdirpPromise (dirName) {
  return new Promise((resolve, reject) => {
    checker(dirNameToArray(dirName), '', 0, (err, pn, last) => {
      creator(last, pn, 0, (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  })
}

/**
 * @function dirNameToArray
 * @description transform path to array of folders
 * @param {string} p - pathName
 * @returns {object} array
 * */

function dirNameToArray (p) {
  return p.split('/').filter(c => c)
}

/**
 * @function creator
 * @description recursive folder creator
 * @param {object} arr -
 * @param {string} pathName -
 * @param {number} i -
 * @param {function} callback -
 * @returns {void}
 * */

function creator (arr, pathName, i, callback) {
  setImmediate(() => {
    fs.mkdir(pathName, (err) => {
      if (err) {
        if (err.code === 'EEXIST') {
          if (i === arr.length) {
            return callback(null, pathName)
          }
          return creator(arr, path.join(pathName, arr[i]), ++i, callback)
        }
        // console.error('creator', err)
        return callback(err)
      }

      if (i === arr.length) {
        return callback(null, pathName)
      }

      creator(arr, path.join(pathName, arr[i]), ++i, callback)
    })
  })
}

/**
 * @function checker
 * @description recursive folder checker
 * @param {object} arr -
 * @param {string} pathName -
 * @param {number} i -
 * @param {function} callback -
 * @returns {void}
 * */

function checker (arr, pathName, i, callback) {
  setImmediate(() => {
    fs.realpath(pathName, (err) => {
      if (err) {
        return callback(err, pathName, arr.slice(i))
      }

      if (i === arr.length) {
        return callback(null, pathName, [])
      }

      checker(arr, path.join(pathName, arr[i]), ++i, callback)
    })
  })
}
