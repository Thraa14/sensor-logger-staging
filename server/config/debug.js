function makeDebug(name) {
  return require('debug')(name);
}

module.exports.makeDebug = makeDebug;
