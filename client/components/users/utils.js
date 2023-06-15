import Validator from 'validatorjs';

const debug = require('debug')('client:clients:utils');

export function validateUserData(userData) {
  const errors = [];
  if (!userData) {
    errors.push('Field data is empty');
    return errors;
  }

  const usernameRegex = new RegExp([/^(?=.{4,20}$)/,
    /(?![_.\d])(?!.*[_.]{2})[a-zA-Z0-9._]+/,
    /(?<![_.])$/]
    .map((re) => re.source)
    .join(''));
  const rules = {
    username: ['required', 'min:4',
      `regex:${usernameRegex}`],
    password: 'required|min:5',
  };

  // Don't validate password when editing
  const isEditing = userData._id !== undefined;
  if (isEditing && userData.password === '') {
    delete rules.password;
  }

  const validation = new Validator(userData, rules, {
    'regex.username': 'Username can be 4~20 characters ' +
      'and doesn\'t start with a number.',
  });

  if (validation.fails()) {
    Object.keys(validation.errors.all()).forEach((attr) => {
      errors.push(...validation.errors.get(attr));
    });
  }
  debug(errors);
  return errors;
}
