import { requestObject, responseObject } from '../test/testUtils';
import { Field } from './fieldModel';
import { User } from '../users/userModel';
import assert from 'assert';

// const debug = require('debug')('app:tests:controllers:fields');
const fieldsController = require('./fieldsController');

describe('FieldView controller tests', function() {
  let res;
  let req;
  let admin;
  const fieldName = 'Field0';

  beforeEach(function setupResponseObject() {
    res = responseObject();
    req = requestObject();
  });
  before(async function registerAdmin() {
    admin = new User({
      username: 'admin_user',
      passwordHash: 'pwHash',
      isAdmin: true,
    });
    await admin.save();
    Object.freeze(admin);
  });

  it('Admin can add new fields', async function() {
    req.user = admin;
    await fieldsController.newField(req.setBody({ name: fieldName }), res);

    assert(!res.isJsonError());
    const fields = await Field.find({});
    const field = res.getResponseJson().field;
    assert.strictEqual(fields.length, 1);
    assert.strictEqual(field.name, fieldName);
  });

  it('Non admins can\'t add new fields');

  it('Admin can access all fields', async function() {
    req.user = admin;
    // TODO: user faker
    const fields = [{ name: 'f1' }, { name: 'f2' }];
    await Field.insertMany(fields);

    await fieldsController.getFields(req, res);

    assert(!res.isJsonError());
    const json = res.getResponseJson();
    assert.strictEqual(json.fields.length, fields.length);
  });

  it('Non Admin can access their managed fields', async function() {
    const user = new User({
      username: 'user',
      email: 'user@domain.com',
      passwordHash: 'pwHash',
      isAdmin: false,
    });
    req.user = await user.save();

    const fields = [{ name: 'f1', managers: [] }, {
      name: 'f2',
      managers: [user._id],
    }];
    await Field.insertMany(fields);

    await fieldsController.getFields(req, res);

    assert(!res.isJsonError());
    const json = res.getResponseJson();

    const f = json.fields[0];
    assert.strictEqual(f.name, fields[1].name);
  });
});
