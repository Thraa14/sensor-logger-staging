import { DateTime } from 'luxon';

// TODO: don't make this variable public
const READING_DATE_FORMAT = 'MM/d/yyyy hh:mm';
const debug = require('debug')('app:controllers:utils');

/**
 *
 * @param {*} err
 * @param {e.Response} res
 */
export function handleError(err, res) {
  debug('handleError');
  debug(err);
  res.status(400).json({ errors: [err.toString()] });
}

export function parseDateString(dateString) {
  return DateTime
    .fromFormat(dateString, READING_DATE_FORMAT, { zone: 'utc' });
}

module.exports.handleError = handleError;
