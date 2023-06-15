const discardedColumns = ['readingid',
  'fieldid',
  'pipeid',
  '_id', '_v',
  'islivefeed', 'fieldname',
  'updatedat', 'createdat'];
const debug = require('debug')('client:data:readingparser');

const abbreviations = new Map();
abbreviations.set('DiffPressure', 'DiffP');
abbreviations.set('GasTemprature', 'GasT');
abbreviations.set('ReadingTime', 'Time');
abbreviations.set('SepPressure', 'SepP');
abbreviations.set('SpecificGravity', 'SpecG');
abbreviations.set('OrificeId', 'Orifice');
abbreviations.set('WaterRate', 'WaterR');
abbreviations.set('GasRate', 'GasR');

// TODO: Make sure graphs don't crash and are correct
export function makeColumnConfig(dataPoint) {
  if (!dataPoint) {
    return {};
  }
  const keys = Object.keys(dataPoint);
  return keys.map((k) => {
    const columnCell = {
      dataKey: k,
      width: 600,
    };

    if (abbreviations.has(k)) {
      columnCell.label = abbreviations.get(k);
    } else {
      columnCell.label = k;
    }
    return columnCell;
  });
}

function sanitizeObject(inputObject, extraKeys = []) {
  const obj = Object.assign({}, inputObject);
  // TODO: fix / format this later.
  delete obj['readingTime'];
  Object.keys(obj).forEach((k) => {
    if (!obj[k] === null) {
      delete obj[k];
    } else {
      const lowerKey = k.toLowerCase();
      const deleteIndex = extraKeys.indexOf(lowerKey);
      if (deleteIndex !== -1) {
        delete obj[k];
      }
    }
  });

  return obj;
}

/**
 *
 * @param {[Reading]} rawReadings
 */
export function cleanUpReadings(rawReadings) {
  if (!rawReadings?.length) return;
  return rawReadings.map((r) => sanitizeObject(r, discardedColumns));
}

/**
 *
 * @param {Reading} rawReading
 */
export function cleanUpReading(rawReading) {
  if (!rawReading) return;
  return sanitizeObject(rawReading, discardedColumns);
}
