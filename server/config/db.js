const debug = require('debug')('app:db');
const mongoose = require('mongoose');

/**
 *
 * @param {string} dbUrl
 * @param {string} dbName
 * @returns {Promise<Connection>}
 */
export async function setupDatabase(dbUrl, dbName, extraConfig = null) {
  const mongoUrl = `mongodb://${dbUrl}/${dbName}`;
  const defaults = {
    loggerLevel: 'info',
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    connectTimeoutMS: 4000,
    serverSelectionTimeoutMS: 4000,
  };

  const options = Object.assign(defaults, extraConfig);
  await mongoose.connect(mongoUrl, options);

  const db = mongoose.connection;
  db.on('error', (error) => {
    debug('[DB] connection error: %o', error);
    throw error;
  });
  db.on('open', () => {
    debug(`[DB] Connected to ${mongoUrl}`);
  });

  db.on('close', () => {
    debug('[DB] Closed mongoose');
  });

  return db;
}

// TODO: should we prettify validation errors?

module.exports.setupDatabase = setupDatabase;
