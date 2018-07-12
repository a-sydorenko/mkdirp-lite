'use strict'

const {
  checker,
  creator,
  mkdirp,
  dirNameToArray
} = require('../lib')

const assert = require('assert')
const fs = require('fs')

describe(`dirNameToArray test`, () => {
  const pathName = 'data/test/files'

  it(`should correctly split pathName`, () => {
    const arr = dirNameToArray(pathName)
    assert.equal(3, arr.length)
  })
})

describe(`checker test`, () => {

  it(`should return correct information about directories`, function (done) {
    const pathName = 'test'
    const arr = dirNameToArray(pathName)
    checker(arr, '', 0, (err, pn, last) => {
      if (err) {
        return done(err)
      }

      assert.equal(pathName, pn)
      assert.equal(last instanceof Array, true)
      done()
    })
  })

  it(`should return correct information about directories`, function (done) {
    const pathName = 'test/2'
    const arr = dirNameToArray(pathName)

    checker(arr, '', 0, (err, pn, last) => {
      if (err) {
        assert.equal(last instanceof Array, true)
        assert.equal(last.length, 0)
        return done()
      }
      done(new Error(`Error`))
    })
  })
})

describe(`creator test`, () => {
  it(`should create directories recursively`, function (done) {

    const pathName = '1/2/3/4/5/6'
    const arr = dirNameToArray(pathName)

    checker(arr, '', 0, (err, pn, last) => {
      if (err) {

        creator(last, pn, 0, (err, pn) => {
          if (err) {
            return done(err)
          }

          assert.equal(pn, pathName)
          assert.equal(fs.existsSync(pathName), true)
          console.log('Please, remove next folder manually: ' + pathName)
          done()
        })
        return
      }
      done()
    })
  })
})

describe(`mkdirp test`, () => {
  it(`should create directories recursively`, function (done) {

    const pathName = '1/2/3/4/5/7'
    mkdirp(pathName).then(() => {

      done()
      console.log('Please, remove next folder manually: ' + pathName)
    }).catch(done)
  })
})
