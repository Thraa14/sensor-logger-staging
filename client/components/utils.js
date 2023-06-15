import { Api } from '../scripts/api.js';
import { AppState } from '../scripts/appState';
import { DateTime } from 'luxon';
// TODO: don't make this variable public
const READING_DATE_FORMAT = 'MM/d/yyyy hh:mm';

export const api = new Api();
export const appState = new AppState();

export function updateFieldValue(e, setter) {
  e.preventDefault();
  setter(e.target.value);
}

// TODO: refactor
export const modalStates = Object.freeze({
  ok: {
    open: true,
    title: 'Confirm',
    text: 'Request succeeded.',
    willGoBack: true,
  },
  error: (errors) => ({
    open: true,
    title: 'Error',
    text: errors.join('\n'),
    willGoBack: false,
  }),

  initial: {
    open: false,
    title: '',
    text: '',
    willGoBack: false,
  },
});

export function parseDateString(dateString) {
  return DateTime
    .fromFormat(dateString, READING_DATE_FORMAT, { zone: 'utc' });
}

export function formatDate(date) {
  return DateTime.fromJSDate(date).toFormat();
}
