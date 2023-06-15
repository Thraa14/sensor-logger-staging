import { generateToken, checkPassword } from './authUtils.js';
import debugModule from '../config/debug.js';
import { User } from '../users/userModel.js';
import { handleError } from '../controllerUtils';

const debug = require('debug')('app:controllers:auth');

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
async function signIn(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        errors: ['Missing username or password.'],
      });
    }

    const user = await User.findOne({ username });
    if (user == null || !await checkPassword(password, user.passwordHash)) {
      debug('Invalid username/password: ID [%s] | PW [%s]', username, password);
      return res.status(403).json({
        errors: ['Invalid username or password.'],
      });
    }

    const token = generateToken({ username });
    res.json({
      token: token,
      user: {
        username: user.username,
        isAdmin: user.isAdmin,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
}

export { signIn };
