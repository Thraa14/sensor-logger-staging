// eslint-disable-next-line max-len
import { sanitizeObject } from './utils.js';
import { handleError, parseDateString } from '../controllerUtils';
import debugModule from '../config/debug.js';
import { Reading } from './readingModel.js';
import { Field } from '../fields/fieldModel.js';
import { DateTime } from 'luxon';

const debug = debugModule.makeDebug('app:controllers:reading');
const READING_DATE_FORMAT = 'MM/d/yyyy hh:mm';

// async function insertField(name) {
//   const field = new Field({ name });
//   await field.save();

//   debug('New field: %s', field.name);
//   return field;
// }

// async function getOrInsertField(name) {
//   let field = await Field.findOne({ name });
//   if (field == null) {
//     field = insertField(name);
//   }
//   return field;
// }

function parseReadingData(data) {
  const sanitized = sanitizeObject(data);
  // TODO: fix field name ReadingTime
  const { ReadingTime, FieldId: fieldName, ...rest } = sanitized;
  const readingTime = parseDateString(ReadingTime);
  return new Reading({
    readingTime, ReadingTime, fieldName, ...rest,
  });
}

// async function saveField(req, res) {
//   // TODO: add a new field, validate user is admin.
// }

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
async function getFieldReadings(req, res) {
  try {
    const fieldName = req.params.fieldName;
    const field = await Field.findOne({ name: fieldName });
    if (field === null) {
      return res.sendStatus(404);
    }
    const readingCount = await Reading
      .find({ fieldName: field.name })
      .count();

    // TODO: add URL to field readings in response HATEOAS.
    res.json({ field, readingCount, readingsUrl: 'TODO' });
  } catch (err) {
    handleError(err, res);
  }
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
async function saveTick(req, res) {
  try {
    const reading = parseReadingData(req.body);
    await reading.save();

    res.status(200).json({ id: reading._id });
  } catch (err) {
    handleError(err, res);
  }
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
async function getTick(req, res) {
  const lastReadingTime = req.query.lastReadingTime ?
    req.query.lastReadingTime : '01/01/2000 01:00';

  const fieldName = req.params.fieldName;
  try {
    const dbDate = parseDateString(lastReadingTime);
    const readings = await Reading
      .find({
        fieldName,
        readingTime: { $gt: dbDate },
        IsLiveFeed: false,
      })
      .sort({ readingTime: 1 });
    debug('Reading count: %d', readings.length);
    res.json({ readings });
  } catch (err) {
    handleError(err, res);
  }
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
async function saveLive(req, res) {
  const reading = parseReadingData(req.body);
  try {
    const field = await Field
      .findOne({ name: reading.fieldName })
      .populate('live');
    await Reading.findByIdAndDelete(field.live?._id);

    field.live = reading;
    await reading.save();
    await field.save();
    res.sendStatus(200);
  } catch (err) {
    debug('saveLive');
    debug(req.body);
    handleError(err, res);
  }
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
async function getLive(req, res) {
  try {
    const { fieldName } = req.params;
    const field = await Field
      .findOne({ name: fieldName })
      .populate('live');

    res.json({ live: field.live || null });
  } catch (err) {
    handleError(err, res);
  }
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
async function getAll(req, res) {
  try {
    const fields = await Field.find({}).populate('live');

    const readings = await Reading
      .find({ IsLiveFeed: false })
      .sort({ readingTime: 1 });
    res.json({ fields, readings });
  } catch (err) {
    handleError(err);
  }
}

// TODO: make sure this call is authenticated
// and the user is an admin.
/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
async function clearAll(req, res) {
  debug('DELETE');
  await Field.deleteMany({});
  await Reading.deleteMany({});
  res.sendStatus(200);
}

// eslint-disable-next-line max-len
export {
  saveTick,
  getTick,
  saveLive,
  getLive,
  getAll,
  clearAll,
  getFieldReadings,
  READING_DATE_FORMAT,
};

module.exports.saveTick = saveTick;
module.exports.getTick = getTick;
module.exports.saveLive = saveLive;
module.exports.getLive = getLive;
module.exports.getAll = getAll;
module.exports.clearAll = clearAll;
module.exports.getFieldReadings = getFieldReadings;
