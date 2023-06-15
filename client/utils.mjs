/**
 * Sleeps for a given number of milliseconds.
 * @param {Number} ms
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Makes a poller object that calls a function `callee`
 * and waits `duration` milliseconds after the
 * call returns then repeats.
 *
 * @param duration
 * @param {Function} callee
 * @param  {...any} args
 */
function makePoller(duration, callee, ...args) {
  const poller = async () => {
    await callee(...args)
      .then(async () => {
        await sleep(duration);
        await poller();
      });
  };

  return poller;
}

function toPascalCase(s) {
  return s.replace(/\w+/g,
    (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

function makeColumnConfig(data) {
  const keys = Object.keys(data);
  return keys.map((k) => {
    return { title: toPascalCase(k), field: k };
  });
}

function sanitizeObject(obj, extraKeys = []) {
  Object.keys(obj).forEach((k) => {
    if (!obj[k]) {
      delete obj[k];
    } else {
      const lowerKey = k.toLowerCase();
      const deleteIndex = extraKeys.indexOf(lowerKey);
      if (deleteIndex !== -1) {
        delete obj[k];
      }
    }
  });
}

export { makePoller, makeColumnConfig, sanitizeObject };
