var d = require('defined')
var got = require('got')
var imgurUpload = require('imgur-uploader')
var through = require('through2')
var pump = require('pump')

module.exports = Imgur

var API = 'https://api.imgur.com/3'

function Imgur (options) {
  if (!(this instanceof Imgur)) return new Imgur(options)

  options = options || {}
  this.token = d(options.token, '1e3060a8aacc138')
}

Imgur.prototype.getImage = function (key) {
  return got(API + '/image/' + key, {
    json: true,
    headers: {
      authorization: 'Client-ID ' + this.token
    }
  })
}

Imgur.prototype.createReadStream = function (obj) {
  obj = typeof obj === 'string' ? { key: obj } : obj

  var stream = through()

  this.getImage(obj.key).then(function (response) {
    pump(got.stream(response.body.data.link), stream)
  }).catch(function (err) {
    stream.emit('error', err)
  })

  return stream
}

Imgur.prototype.createWriteStream = function (obj, cb) {
  if (typeof obj === 'function') {
    cb = obj
    obj = {}
  }

  return imgurUpload.stream({
    token: 'Client-ID ' + this.token
  }).on('upload', function (res) {
    res.key = res.id
    cb(null, res)
  }).on('error', cb)
}

Imgur.prototype.exists = function (obj, cb) {
  obj = typeof obj === 'string' ? { key: obj } : obj

  if (!/^\w{7}$/.test(obj.key)) {
    process.nextTick(function () {
      cb(null, false)
    })
    return
  }

  this.getImage(obj.key).then(function (result) {
    cb(null, result.body.success === true)
  }, function (err) {
    if (err.statusCode === 404) {
      cb(null, false)
    } else cb(err)
  })
}

Imgur.prototype.remove = function (obj, cb) {
  obj = typeof obj === 'string' ? { key: obj } : obj

  if (!obj.deletehash) {
    throw new TypeError('A `deletehash` is required to delete images')
  }

  got.delete(API + '/image/' + obj.deletehash, {
    json: true,
    headers: {
      authorization: 'Client-ID ' + this.token
    }
  }).then(function () {
    cb()
  }, cb)
}
