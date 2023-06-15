import { assertModelValidationErrors } from '../test/testUtils';
import { User } from './userModel';

const assert = require('assert');

describe('User model tests', function() {
  it('Accepts valid input', async function() {
    const user = new User({
      username: 'user0',
      email: 'user0@domain.com',
      passwordHash: 'pwHash',
    });
    await user.validate();
    await user.save();

    assert(!user.admin);
    assert.strictEqual(user.managedFields.length, 0);
  });

  it('Requires username', async function() {
    const user = new User({
      email: 'user0@domain.com',
      passwordHash: 'pwHash',
    });

    await assertModelValidationErrors(async function() {
      await user.validate();
    }, 'username');
  });

  it('Requires email', async function() {
    const user = new User({
      username: 'user0',
      passwordHash: 'pwHash',
    });

    await assertModelValidationErrors(async function() {
      await user.validate();
    }, 'email');
  });

  it('Requires password hash', async function() {
    const user = new User({
      username: 'user0',
      email: 'user0@domain.com',
    });

    await assertModelValidationErrors(async function() {
      await user.validate();
    }, 'passwordHash');
  });

  it('Has timestamps', async function() {
    const user = new User({
      username: 'user0',
      email: 'user0@domain.com',
      passwordHash: 'pwHash',
    });
    await user.save();

    assert(user.createdAt);
    assert(user.updatedAt);
  });
});
