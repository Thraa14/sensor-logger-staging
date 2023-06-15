import { join } from 'path';
import { exit } from 'process';
import { setupDatabase } from '../config/db';
import { readFileSync } from 'fs';
import { Reading } from '../readings/readingModel.js';
import { Field } from '../fields/fieldModel.js';

const dotenv = require('dotenv');
const miscUtils = require('../config/miscUtils');
const mongoose = require('mongoose');

const debug = require('debug')('app:seeder:reading');

/**
 * Save fields
 * @param {array} fields
 */
async function seedFields(fields) {
  await Field.insertMany(fields);
  const fieldData = {};

  fields.forEach((field) => fieldData[field.name] = field._id);
  debug('Add %s fields...', fields.length);
  debug(fields.map((f) => f.name));
  return fieldData;
}

async function seed(number = null) {
  const rawDataPath = join(__dirname, 'data/readings.json');
  const dumpData = JSON.parse(readFileSync(rawDataPath));
  const readings = dumpData.readings;

  await setupDatabase(process.env.DB_URL, process.env.DB_NAME);
  await Field.deleteMany({});
  await Reading.deleteMany({});
  await seedFields(dumpData.fields);

  await Reading.insertMany(readings);
  debug('Added %s items to readings...', readings.length);
}

async function main() {
  // mongo integrateDb < readings.json
  dotenv.config();
  miscUtils.assertDebug();

  await seed(process.argv[2]).then((value) => {
    debug('Done seeding');
    mongoose.connection.close();
  }).catch((err) => {
    debug(err);
    exit(-1);
  });
}

main();
