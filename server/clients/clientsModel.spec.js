import { Client } from './clientModel';
import { Field } from '../fields/fieldModel';
import { assertModelValidationErrors } from '../test/testUtils';

const assert = require('assert');
const debug = require('debug')('app:tests:models:client');

describe('Client model tests', function() {
  const TEST_CLIENT_NAME = 'TestClient';

  async function makeMongoFields() {
    const fieldData = ['A', 'B', 'C']
      .map((n) => new Field({ name: n }));
    return await Field.insertMany(fieldData);
  }

  it('Accepts valid fields', async function() {
    const client = new Client({ name: TEST_CLIENT_NAME });
    await client.save();
    assert(!client.isNew);
  });

  it('Requires name', async function() {
    const client = new Client({ fields: [] });
    await assertModelValidationErrors(async function() {
      await client.validate();
    }, 'name');
  });

  it('Requires unique name', async function() {
    // Unique index will throw on save not validate.
    // Since it's not a validator.
    const name = TEST_CLIENT_NAME;
    const client = new Client({ name });
    await client.save();

    const secondField = new Client({ name });
    await assertModelValidationErrors(async function() {
      await secondField.save();
    }, 'name');
  });

  it('Accepts adding fields', async function() {
    const fields = await makeMongoFields();

    const client = new Client({ name: TEST_CLIENT_NAME, fields: fields });
    await client.save();

    const c = await Client
      .findOne({ _id: client._id })
      .populate('fields');

    assert.strictEqual(c.fields.length, fields.length);
  });

  it('Accepts adding fields by ID', async function() {
    const fields = (await makeMongoFields()).map((f) => f._id);

    const client = new Client({ name: TEST_CLIENT_NAME, fields: fields });
    await client.save();

    const c = await Client
      .findOne({ _id: client._id })
      .populate('fields');

    assert.strictEqual(c.fields.length, fields.length);
  });
});
