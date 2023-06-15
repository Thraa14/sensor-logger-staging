

/**
 * @function
 */
export function assertDebug(num) {
  const DEBUG_VAR = process.env.DEBUG;
  if (DEBUG_VAR === undefined || !DEBUG_VAR.includes('app')) {
    console.warn('Script isn\'t running in DEBUG mode');
    // eslint-disable-next-line max-len
    console.warn('To show debug messages use:\n\tDEBUG=app:* node SCRIPT\nTerminating...');
    process.exit(-1);
  }
}

module.exports = { assertDebug };
