import { assertModelValidationErrors, responseObject } from '../test/testUtils';
import { Reading } from './readingModel';

describe('Reading model tests', function() {
  it('Accepts more fields than just time and fieldName', async function() {
    const reading = new Reading({
      fieldName: 'TestField',
      readingTime: Date.now(),
      pH: 7.01,
    });

    await reading.validate();
  });

  it('Requires reading time', async function() {
    const reading = new Reading({
      fieldName: 'TestField',
    });
    await assertModelValidationErrors(async function() {
      await reading.validate();
    }, 'readingTime');
  });

  it('Requires fieldName', async function() {
    const reading = new Reading({
      readingTime: Date.now(),
    });
    await assertModelValidationErrors(async function() {
      await reading.validate();
    }, 'fieldName');
  });
});
