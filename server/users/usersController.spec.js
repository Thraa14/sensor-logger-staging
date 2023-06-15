import { responseObject } from '../test/testUtils';
import { User } from './userModel';
import { Field } from '../fields/fieldModel';
import assert from 'assert';

// const debug = require('debug')('app:tests:controllers:users');
const usersController = require('./usersController');

describe('Users controller tests', function() {
  let res;
  beforeEach(function setupResponseObject() {
    res = responseObject();
  });

  describe('Registering a user...', function() {
    it('Accepts valid input', async function() {
      const userParams = {
        username: 'username',
        email: 'a@b.com',
        password: 'password',
      };

      await usersController.newUser({
        body: userParams,
      }, res);

      assert(!res.isJsonError());
      const newUser = await User.findOne({});
      assert(newUser.id);
      assert.strictEqual(newUser.username, userParams.username);
      assert.strictEqual(newUser.email, userParams.email);
      assert.strictEqual(newUser.isAdmin, false);
    });

    it('Requires a username', async function() {
      await usersController.newUser({
        body: {
          email: 'a@b.com',
          password: 'password',
        },
      }, res);
      assert(res.isJsonError());
      assert(res.status.calledWith(400));
    });

    it('Requires a password', async function() {
      await usersController.newUser({
        body: {
          username: 'username',
          email: 'a@b.com',
        },
      }, res);
      assert(res.isJsonError());
      assert(res.status.calledWith(400));
    });

    it('Requires a email', async function() {
      await usersController.newUser({
        body: {
          username: 'username',
          password: 'password',
        },
      }, res);
      assert(res.isJsonError());
      assert(res.status.calledWith(400));
    });

    it('Resisters a user with managed fields', async function() {
      const names = ['F1', 'F2', 'F3'];
      const fieldCount = 2;
      const fields = await Field.insertMany(names.map((n) => {
        return { name: n };
      }));

      const managedFields = fields
        .slice(0, 2)
        .map((f) => f._id);
      console.debug(managedFields);
      const userParams = {
        username: 'username',
        email: 'a@b.com',
        password: 'password',
        managedFields: managedFields,
      };

      await usersController.newUser({
        body: userParams,
      }, res);

      assert(!res.isJsonError());
      const newUser = await User
        .findOne({})
        .populate('managedFields');
      console.debug(newUser.managedFields);
      assert.strictEqual(
        newUser.managedFields.length,
        fieldCount,
      );
    });
  });

  describe('Admin users', function() {
    it('Can be registered', async function() {
      const userParams = {
        username: 'username',
        email: 'a@b.com',
        password: 'password',
        isAdmin: true,
      };

      await usersController.newUser({
        body: userParams,
      }, res);

      assert(!res.isJsonError());
      const newUser = await User.findOne({});
      assert(newUser.isAdmin);
    });
  });
});
