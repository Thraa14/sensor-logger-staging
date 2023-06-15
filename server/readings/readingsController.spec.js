import { requestObject, responseObject } from '../test/testUtils';
import { READING_DATE_FORMAT } from './readingsController';
import { Reading } from './readingModel';
import { Field } from '../fields/fieldModel';

const moment = require('moment');
const assert = require('assert');
const readingsController = require('./readingsController');
const debug = require('debug')('app:tests:controllers:readings');

/**
 *
 * @param options
 * @returns {[Reading]}
 */
function makeFrozenTickData(options = {}) {
  const randomTicks = [];
  const count = options.count !== undefined ? options.count : 4;
  for (let i = 0; i < count; i++) {
    // Ticks are reverse sorted.
    const readingTime =
      options.readingTime !== undefined ?
        options.readingTime(i) :
        moment(Date.now()).add(i * -1, 'days');

    const fieldName =
      options.fieldName !== undefined ?
        options.fieldName(i) : i.toString();

    randomTicks.push({ fieldName: fieldName, readingTime: readingTime });
  }
  Object.freeze(randomTicks);
  return randomTicks;
}

async function saveReadings(readingObjects) {
  const readings = [];
  for (const r of readingObjects) {
    const reading = new Reading(r);
    await reading.save();
    readings.push(reading);
  }
  return readings;
}

describe('Readings controller..', function() {
  const FIELD_NAME = 'Field0';
  let req;
  let res;
  beforeEach(function setupResponseObject() {
    res = responseObject();
    req = requestObject();
  });

  describe('When saving ticks...', function() {
    it('Can add a tick', async function() {
      const readingTime = moment.utc().format(READING_DATE_FORMAT);
      const fieldName = 'Test field ID';

      await readingsController.saveTick(req.setBody({
        fieldName,
        readingTime,
      }), res);

      assert(!res.isJsonError());
      const reading = await Reading.findOne({});

      // TODO: restore standard UTC date from client.
      assert.strictEqual(
        moment(reading.readingTime).format(),
        moment(readingTime).format(),
      );
      assert.strictEqual(reading.fieldName, fieldName);
    });

    it('Rejects ticks with missing fieldName', async function() {
      const dateOfReading = moment.utc().format(READING_DATE_FORMAT);
      await readingsController.saveTick(req.setBody({
        readingTime: dateOfReading,
      }), res);

      assert(res.isJsonError());
      assert(res.status.calledWith(400));
    });

    it('Rejects ticks with missing date', async function() {
      const fieldName = 'Test field ID';
      await readingsController.saveTick(req.setBody({ fieldName }), res);

      assert(res.isJsonError());
      assert(res.status.calledWith(400));
    });
  });

  describe('When reading ticks...', function() {
    let req;
    let res;

    beforeEach(function setupResponseObject() {
      res = responseObject();
      req = requestObject();
    });

    it('Returns all saved ticks sorted by date', async function() {
      const tickObjects = makeFrozenTickData();
      await saveReadings(tickObjects);

      await readingsController.getAll(req, res);
      assert(!res.isJsonError());
      const result = res.getResponseJson();
      assert.strictEqual(result.fields.length, 0);
      assert.strictEqual(result.readings.length, tickObjects.length);

      const readings = result.readings;

      for (let i = 0; i < readings.length - 1; i++) {
        const current = readings[i].readingTime;
        const next = readings[i + 1].readingTime;
        assert(
          moment(current).isBefore(next),
          `${current} is not before ${next}`,
        );
      }
    });

    it('Returns ticks after a certain date', async function() {
      const fields = ['Field 0', 'Field 1'];
      const tickObjects = makeFrozenTickData({
        readingTime: (i) => {
          const plusDay = i % 2 === 0 ? 1 : 0;
          return moment(Date.now()).add(plusDay, 'days');
        },
        fieldName: (i) => fields[i % 2],
      });
      await saveReadings(tickObjects);

      const tomorrow = moment(Date.now())
        .add(1, 'days')
        .format(READING_DATE_FORMAT);
      await readingsController.getTick(
        req
          .setQuery({ lastReadingTime: tomorrow })
          .setParams({ fieldName: fields[0] })
        , res);

      assert(!res.isJsonError());
      const json = res.getResponseJson();
      assert.strictEqual(json.readings.length, tickObjects.length / 2);
    });

    it('Returns empty results when field doesn\'t exist', async function() {
      const date = moment(Date.now());
      const fieldName = 'testField';
      await readingsController.getTick(
        req
          .setQuery({ lastReadingTime: date })
          .setParams({ fieldName: fieldName })
        , res);

      const json = res.getResponseJson();
      assert.strictEqual(json.readings.length, 0);
    });

    it('Returns ticks sorted by date', async function() {
      const fieldName = 'Field 0';
      const tickObjects = makeFrozenTickData({
        readingTime: (i) => {
          return moment(Date.now()).add(i + 1, 'days');
        },
        fieldName: (i) => fieldName,
      });
      await saveReadings(tickObjects);

      const today = moment().utc().format(READING_DATE_FORMAT);
      await readingsController.getTick(
        req
          .setQuery({ lastReadingTime: today })
          .setParams({ fieldName: fieldName })
        , res);

      assert(!res.isJsonError());
      const json = res.getResponseJson();
      const readings = json.readings;
      assert.strictEqual(readings.length, tickObjects.length);
      for (let i = 0; i < readings.length - 1; i++) {
        const current = readings[i];
        const next = readings[i + 1];
        assert(moment(current.readingTime).isBefore(next.readingTime));
      }
    });

    it('Overwrites live ticks without storing them', async function() {
      const field = new Field({ name: FIELD_NAME });
      await field.save();

      await readingsController.saveLive(req.setBody({
        fieldName: FIELD_NAME,
        testValue: 10,
        readingTime: moment().utc().format(),
      }), res);

      const dbReadings = await Reading.find({}).lean();
      assert.strictEqual(dbReadings.length, 1);
      assert.strictEqual(dbReadings[0].testValue, 10);

      await readingsController.saveLive(req.setBody({
        fieldName: FIELD_NAME,
        testValue: 2,
        readingTime: moment().utc().format(),
      }), res);
      const updatedReadings = await Reading.find({}).lean();
      assert.strictEqual(updatedReadings.length, 1);
      assert.strictEqual(updatedReadings[0].testValue, 2);

      const dbFields = await Field.find({}).populate('live').lean();
      assert.strictEqual(dbFields[0].live.testValue, 2);
    });

    it('Save and retrieve ticks');

    it('Returns ticks of a specific field', async function() {
      const fieldName = 'Field 0';
      const tickObjects = makeFrozenTickData({
        readingTime: (i) => {
          return moment(Date.now()).add(i + 1, 'days');
        },
        fieldName: (i) => fieldName,
      });
      await saveReadings(tickObjects);

      const today = moment(Date.now()).format(READING_DATE_FORMAT);
      await readingsController.getTick(
        req
          .setQuery({ lastReadingTime: today })
          .setParams({ fieldName: fieldName })
        , res);

      assert(!res.isJsonError());
      const json = res.getResponseJson();
      const readings = json.readings;
      assert.strictEqual(readings.length, tickObjects.length);
      for (let i = 0; i < readings.length; i++) {
        const reading = readings[i];
        assert(reading.fieldName === fieldName);
      }
    });
  });
});
