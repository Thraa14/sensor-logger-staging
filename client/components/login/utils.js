import Validator from 'validatorjs';

const debug = require('debug')('client:clients:utils');

export function validateLoginData(loginData) {
  const errors = [];
  if (!loginData) {
    errors.push('Field data is empty');
    return errors;
  }

  const rules = {
    username: 'required|min:5',
    password: 'required|min:5',
  };

  const validation = new Validator(loginData, rules);

  if (validation.fails()) {
    Object.keys(validation.errors.all()).forEach((attr) => {
      errors.push(...validation.errors.get(attr));
    });
  }

  return errors;
}
