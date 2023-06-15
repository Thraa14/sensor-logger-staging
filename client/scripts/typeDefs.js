import PropTypes from 'prop-types';

/**
 * @typedef Reading
 * @type {object}
 * @property {Date} readingTime
 * @property {string} fieldName
 */

/**
 * @typedef Field
 * @type {object}
 * @property {string} name
 * @property {string} note
 * @property {Reading} live
 * @property {Array} managers
 */

export const FieldValidator = PropTypes.shape({
  name: PropTypes.string.isRequired,
});

/** @typedef User
 * @type {Object}
 * @property {string} username
 * @property {boolean} isAdmin
 */

/** @typedef User
 * @type {Object}
 * @property {string} username
 * @property {boolean} isAdmin
 */
