// Tests adapted from abstract-blob-store.
// Imgur only allows image files to be uploaded
// while the abstract-blob-store tests use short text files.

module.exports = function (test, common) {
  require('./read-write.js').all(test, common)
  require('./string-key.js').all(test, common)
  require('./remove.js').all(test, common)
}
