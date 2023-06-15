import PropTypes from 'prop-types';

const UserValidator = {
  _id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

const FieldValidator = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  managers: PropTypes.arrayOf(UserValidator),
};

const ClientValidator = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(FieldValidator),
};

module.exports.UserValidator = UserValidator;
module.exports.FieldValidator = FieldValidator;
module.exports.ClientValidator = ClientValidator;
