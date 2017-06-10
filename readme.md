# imgur-blob-store

A [blob store](https://github.com/maxogden/abstract-blob-store) that stores images on Imgur.

[![blob-store-compatible](https://raw.githubusercontent.com/maxogden/abstract-blob-store/master/badge.png)](https://github.com/maxogden/abstract-blob-store)

## Installation

With npm:

```bash
npm install --save imgur-blob-store
```

## Usage

```js
var fs = require('fs')
var spawn = require('child_process').spawn
var imgur = require('imgur-blob-store')

var store = imgur({
  token: 'abcdef123456'
})

// writing to imgur
fs.createReadStream('/tmp/my-image.png')
  .pipe(store.createWriteStream(function (err, img) {
    if (err) throw err
    // removing images--requires the deletehash
    store.remove({ deletehash: img.deletehash }, function () {})
  }))

// reading from imgur
var feh = spawn('feh', ['-'])
store.createReadStream('qzq4eCj').pipe(feh.stdin)

// exists
store.exists('pU7nQnP', function (err, exists) {
})
```

## API

### var imgur = require('imgur-blob-store')(options)

Available `options` are:

 * `token` - an imgur API client ID. Get one from https://api.imgur.com/oauth2/addclient

### imgur.createWriteStream(options, cb)

Returns a writable stream.
`options` is optional and does not do anything.

`cb` is called with `(err, metadata)` when the upload failed or completed.
`metadata` is the `data` object returned by imgur (https://apidocs.imgur.com/#58306db8-0a6f-4aa1-a021-bdad565f153e).
Someuseful properties are:

 * `key` - The ID of the image, for use with `createReadStream` and other methods
 * `deletehash` - The deletehash of the image, for use with `remove()`
 * `link` - The publically accessible for the image
 * `type` - Detected mime type
 * `width` / `height` - Image dimensions
 * `size` - Size of the image in bytes, this can be different from the original size because imgur compresses images

### imgur.createReadStream(options)

Returns a readable stream. `options.key` should be an imgur image ID.

### imgur.exists(options, cb)

Checks if an image exists.
`options.key` should be an imgur image ID.
Calls `cb` with `(err, exists)`.

### imgur.remove(options, cb)

Deletes an image from imgur.
`options.deletehash` should be the image's delete hash.
Calls `cb` with `(err)`.

## License

[MIT](./LICENSE)
