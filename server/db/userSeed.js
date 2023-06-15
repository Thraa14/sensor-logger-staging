import debugModule from '../config/debug.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../users/userModel.js';
import { hashPassword } from '../auth/authUtils.js';
import { setupDatabase } from '../config/db.js';
import miscUtils from '../config/miscUtils';

const debug = debugModule.makeDebug('app:seeder:user');

async function seed() {
  try {
    await setupDatabase(process.env.DB_URL, process.env.DB_NAME);
    await User.deleteMany({});
    debug('Dropped users collection...');
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;
    const passwordHash = await hashPassword(password);

    // eslint-disable-next-line max-len
    const admin = new User({
      username,
      passwordHash,
      isAdmin: true,
    });

    await admin.save();
    return admin;
  } catch (err) {
    debug(err);
  }
}

function main() {
  // mongo integrateDb < readings.json
  dotenv.config();
  miscUtils.assertDebug();

  seed().then((admin) => {
    // debug(process._getActiveHandles());
    // debug(process._getActiveRequests());
    mongoose.connection.close().then(() => debug('Saving Admin: %o', admin));
  }).catch((err) => {
    debug('Failed to save admin: %o', err);
  });
}

main();
