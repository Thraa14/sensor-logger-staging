import { Field } from './fieldModel';
import { assertModelValidationErrors } from '../test/testUtils';
import { Reading } from '../readings/readingModel';
import moment from 'moment';

const assert = require('assert');
const debug = require('debug')('app:tests:models:field');

describe('FieldView model tests', function() {
  it('Accepts valid fields', async function() {
    const field = new Field({ name: 'TestField', note: 'Test note.' });
    await field.save();
    assert(!field.isNew);
  });

  it('Requires name', async function() {
    const field = new Field({ note: 'Test note.' });
    await assertModelValidationErrors(async function() {
      await field.validate();
    }, 'name');
  });

  it('Requires unique name', async function() {
    // Unique index will throw on save not validate.
    // Since it's not a validator.
    const name = 'TestField';
    const field = new Field({ name });
    await field.save();

    const secondField = new Field({ name });
    await assertModelValidationErrors(async function() {
      await secondField.save();
    }, 'name');
  });

  it('Accepts saving live reading', async function() {
    const fieldName = 'TestFiled';
    const field = new Field({ name: fieldName });
    await field.save();

    const timestamp = Date.now();
    const reading = new Reading({ readingTime: moment(timestamp), fieldName });
    await reading.save();

    field.live = reading;
    await field.save();
    const f = await Field.findOne({ _id: field._id }).populate('live');
    assert.strictEqual(
      moment(f.live.readingTime).format(),
      moment(timestamp).format(),
    );
    assert(f.updatedAt);
  });
});
