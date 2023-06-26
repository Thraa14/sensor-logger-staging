import express from 'express';
import expressFavicon from 'express-favicon';
import dotenv from 'dotenv';
import bodyparser from 'body-parser';
import os from 'os';
import morgan from 'morgan';
import { makeDebug } from './config/debug.js';
import {
  FIELDS_ROUTE,
  READING_ROUTE,
  AUTH_ROUTE,
  USERS_ROUTE,
  CLIENTS_ROUTE,
} from './config/routes.js';
import { setupDatabase } from './config/db.js';
import { authenticateUser } from './auth/authUtils.js';
import { readingsRouter } from './readings/readingsRoutes.js';
import { authRouter } from './auth/authRoutes.js';
import { usersRouter } from './users/usersRoutes.js';
import { fieldsRouter } from './fields/fieldsRoutes';
import { clientsRouter } from './clients/clientsRoutes';


const debug = makeDebug('app:main');
const PORT = process.env.PORT || 'https://integrate-daq.com/';

function initializeServerEnvironment() {
  dotenv.config();
}

/**
 * @param {express.Application} app Express application.
 */
function setupMiddleware(app) {
  app.use(morgan('dev'));
  app.use(expressFavicon('dist/favicon.ico'));
  // Auth before serving.
  // TODO: fix client to change URL to post to.
  app.use(`${READING_ROUTE}/private`, authenticateUser);
  app.use(USERS_ROUTE, authenticateUser);
  app.use(FIELDS_ROUTE, authenticateUser);
  app.use(CLIENTS_ROUTE, authenticateUser);

  app.use(express.static('dist'));
  app.use(bodyparser.json());
  app.use(bodyparser.urlencoded({ extended: false }));
}

/**
 * @param {express.Application} app Express application.
 */
function setupChildRoutes(app) {
  app.use(READING_ROUTE, readingsRouter);
  app.use(AUTH_ROUTE, authRouter);
  app.use(USERS_ROUTE, usersRouter);
  app.use(FIELDS_ROUTE, fieldsRouter);
  app.use(CLIENTS_ROUTE, clientsRouter);
  app.get('*', (req, res) => res.redirect('/'));
}

/**
 * @return {express.Application}
 */
function setupExpress() {
  /** @type {express.Application} */
  const app = express();
  setupMiddleware(app);
  setupChildRoutes(app);
  return app;
}


async function main() {
  debug('Application is now running');
  initializeServerEnvironment();
  await setupDatabase(process.env.DB_URL, process.env.DB_NAME);
  const app = setupExpress();
  app.listen(PORT, () => {
    const hostname = os.hostname();
    debug(`[APP] Server is running on [${hostname}:${PORT}]`);
  });
}

main();
