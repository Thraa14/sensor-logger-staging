import { User } from './userModel.js';
import debugModule from '../config/debug.js';
import { hashPassword } from '../auth/authUtils.js';
import { handleError } from '../controllerUtils';
import { userViewFields } from './userModel';
import mongoose from 'mongoose';

const filterObject = require('params');


const debug = debugModule.makeDebug('app:controllers:users');
const permittedFields = ['_id', 'managedFields', 'username', 'isAdmin'];

/**
 * Lists available users.
 * @param {e.Request} req
 * @param {e.Response} res
 */
export async function index(req, res) {
  try {
    const users = await User.find({}).lean().exec();
    res.json({
      users: users.map((u) => filterObject(u).only(permittedFields)),
    });
  } catch (err) {
    handleError(err, res);
  }
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
export async function add(req, res) {
  try {
    const { username, password, isAdmin, managedFields } = req.body;
    const duplicated = await hasDuplicate(username.toLowerCase().trim());
    if (duplicated) {
      return res
        .status(400)
        .json({
          errors:
            ['Username already exists'],
        });
    }

    const passwordHash = await hashPassword(password);
    const user = new User({
      username,
      passwordHash,
      isAdmin,
      managedFields,
    });
    await user.save();

    res.json({ user: filterObject(user).only(permittedFields) });
  } catch (err) {
    handleError(err, res);
  }
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
export async function update(req, res) {
  try {
    const { _id, password, isAdmin } = req.body;
    const updateObject = {
      isAdmin: isAdmin,
    };

    if (password !== '') {
      updateObject['passwordHash'] = await hashPassword(password);
    }

    const user = await User.findByIdAndUpdate(_id, updateObject);
    if (!user) {
      // User not found
      debug('USER NOT FOUND');
      debug(user);
      debug(await User.findOne({ _id: _id }));
      return res.status(404).json({ errors: ['User not found'] });
    }
    res.json({ user: { _id: user._id, username: user.username } });
  } catch (err) {
    handleError(err, res);
  }
}

export async function remove(req, res) {
  try {
    // TODO: use URI params not query params
    const userId = req.query._id;
    debug('delete body:');
    debug(req.query);

    const deleted = await User
      .findOneAndDelete({ _id: mongoose.Types.ObjectId(userId) })
      .lean();
    res.status(200).json({ user: filterObject(deleted).only(permittedFields) });
  } catch (err) {
    handleError(err, res);
  }
}

export async function read(req, res) {
  try {
    const userId = req.params.id;
    const user = await User
      .findOne({ _id: userId })
      .select(userViewFields)
      .lean();

    res.json({ user: filterObject(user).only(permittedFields) });
  } catch (err) {
    handleError(err, res);
  }
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
export async function me(req, res) {
  // TODO: Show user fields
}

async function hasDuplicate(username) {
  const duplicate = await User.findOne({ username: username }).exec();
  return duplicate !== null;
}
