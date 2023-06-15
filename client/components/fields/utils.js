const debug = require('debug')('client:fields:utils');

export function validateFieldData(fieldData) {
  const errors = [];
  if (!fieldData) {
    errors.push('Field data is empty');
    return errors;
  }

  if (!fieldData.name) {
    errors.push('Field name is required');
  }

  return errors;
}

// TODO: remove this
export function adaptManagers(managers) {
  return managers.map((m) => {
    if (m.username) {
      m.name = m.username;
    }
    return m;
  });
}
