const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dbConfig = require('../config/db');
const debug = require('debug')('app:test:hooks:setup');
const miscUtils = require('../config/miscUtils');

miscUtils.assertDebug();

const testEnvPath = path.join(__dirname, '.env.test');
dotenv.config({ debug: true, path: testEnvPath });
const dbUrl = process.env.TEST_DB_URL;
const dbName = process.env.TEST_DB_NAME;

export const mochaHooks = {
  async beforeAll() {
    debug(`Connecting to: [${testEnvPath}] [${dbUrl}:${dbName}]`);
    await dbConfig.setupDatabase(dbUrl, dbName);
    debug(`DB Connection Open: [${dbUrl}:${dbName}]`);
  },
  async beforeEach() {
    // Delete all models; serves the same effect of dropping
    // the database but keeps the built indexes.
    // https://masteringjs.io/tutorials/mongoose/unique
    for (const model of Object.values(mongoose.connection.models)) {
      await model.deleteMany({});
    }
  },
  async afterAll() {
    await mongoose.connection.close();
    debug('DB Connection closed');
  },
};
