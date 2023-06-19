const debug = require('debug')('app:db');
const mongoose = require('mongoose');

/**
 *
 * @param {string} dbUrl
 * @param {string} dbName
 * @returns {Promise<Connection>}
 */
export async function setupDatabase(dbUrl, dbName, extraConfig = null) {
  const mongoUrl = `${dbUrl}/${dbName}?authSource=admin`;
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

  db.createUser([{
  "_id": {
    "$oid": "6477850dc97b6906fe996ff3"
  },
  "username": "ashraf",
  "passwordHash": "$2b$10$wU.464vjXpslbTLf3dvA/ONQdNXxWa5T5nr1qaICxK1eCXs3Bq8lO",
  "isAdmin": true
  }]);

  return db;
}

// TODO: should we prettify validation errors?

module.exports.setupDatabase = setupDatabase;
