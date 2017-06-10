var fs = require('fs')
var path = require('path')

var testpng = path.join(__dirname, 'test.png')

module.exports.remove = function (test, common) {
  test('blobs can be removed', function (t) {
    common.setup(test, function (err, store) {
      t.notOk(err, 'no setup err')
      var ws = store.createWriteStream({key: 'test.js'}, function (err, obj) {
        t.error(err)
        store.remove(obj, function (err) {
          t.error(err)
          store.exists(obj, function (err, exists) {
            t.error(err)
            t.notOk(exists, 'blob is removed')
            t.end()
          })
        })
      })
      fs.createReadStream(testpng).pipe(ws)
    })
  })
}

module.exports.all = function (test, common) {
  module.exports.remove(test, common)
}
