import { setupDatabase } from '../config/db';

const dotenv = require('dotenv');
const miscUtils = require('../config/miscUtils');


const debug = require('debug')('app:seeder:resetDb');

async function main() {
  // mongo integrateDb < readings.json
  dotenv.config();
  miscUtils.assertDebug();
  const db = await setupDatabase(process.env.DB_URL, process.env.DB_NAME);
  await db.dropDatabase();
  debug('Database dropped');
}

main();
