// export everything from the napi-rs generated file
module.exports = require('./gen.js')

// patch our methods to produce promises on the JS side, that
// complete once the 'done' callback is called.
// see https://github.com/ast-grep/ast-grep/issues/206
const nativeFindInFiles = module.exports.findInFiles
module.exports.findInFiles = function (lang, config, callback) {
  return new Promise((resolve, reject) => {
    nativeFindInFiles(lang, config, (err, arg) => {
      if (typeof arg === 'number') {
        resolve(arg)
      } else {
        callback(err, arg)
      }
    })
  })
}

const nativeParseFiles = module.exports.parseFiles
module.exports.parseFiles = function (paths, callback) {
  return new Promise((resolve, reject) => {
    nativeParseFiles(paths, (err, arg) => {
      if (typeof arg === 'number') {
        resolve(arg)
      } else {
        callback(err, arg)
      }
    })
  })
}

// This can be removed once the deprecated language namespaces are removed
for (const lang of [
  'css',
  'html',
  'js',
  'jsx',
  'ts',
  'tsx',
]) {
  const nativeLangFindInFiles = module.exports[lang].findInFiles

  module.exports[lang].findInFiles = function (config, callback) {
    return new Promise((resolve, reject) => {
      nativeLangFindInFiles(config, callback, (err, count) => {
        if (err) return reject(err)
        resolve(count)
      })
    })
  }
}