import { requestObject, responseObject } from '../test/testUtils';
import { Client } from './clientModel';
import { Field } from '../fields/fieldModel';
import { User } from '../users/userModel';
import assert from 'assert';

const debug = require('debug')('app:tests:controllers:clients');
const clientsController = require('./clientsController');

describe('Client controller tests', function() {
  let res;
  let req;
  let admin;
  const CLIENT_NAME = 'Client0';

  async function makeMongoFields() {
    const fields = [];
    for (const name of ['A', 'B', 'C']) {
      const f = await new Field({ name }).save();
      fields.push(f);
    }

    return fields;
  }

  beforeEach(function setupResponseObject() {
    res = responseObject();
    req = requestObject();
  });

  before(async function registerAdmin() {
    admin = new User({
      username: 'admin_user',
      passwordHash: 'pwHash',
      isAdmin: true,
    });
    await admin.save();
    Object.freeze(admin);
  });

  it('Can add new clients', async function() {
    req.user = admin;
    await clientsController.newClient(
      req.setBody({ name: CLIENT_NAME }),
      res,
    );

    assert(!res.isJsonError());
    const clients = await Client.find({});
    const client = res.getResponseJson().client;
    assert.strictEqual(clients.length, 1);
    assert.strictEqual(client.name, CLIENT_NAME);
  });

  // TODO: add router tests
  it('Non admins can\'t add new clients');
  it('User can access their clients');

  it('Can list clients', async function() {
    const c1 = new Client({ name: CLIENT_NAME });
    await c1.save();
    const c2Name = `${CLIENT_NAME}_1`;
    const fields = await makeMongoFields();
    const c2 = new Client({ name: c2Name, fields: fields });
    await c2.save();

    await clientsController.getClients(req, res);

    const allClients = res.getResponseJson().clients;
    const secondClient = allClients.find((c) => c.name === c2Name);
    assert(allClients.find((c) => c.name === CLIENT_NAME));
    assert.strictEqual(allClients.length, 2);
    assert.strictEqual(secondClient.fields.length, fields.length);
  });

  it('Update name of a client', async function() {
    const c = await new Client({ name: CLIENT_NAME }).save();
    const clientUpdatedName = `${CLIENT_NAME}-1`;

    req.user = admin;
    await clientsController.updateClient(req.setBody({
      id: c._id,
      name: clientUpdatedName,
    }), res);

    assert(!res.isJsonError());
    const updatedClient = await Client.findOne({ _id: c._id });
    assert.strictEqual(updatedClient.name, clientUpdatedName);
  });

  it('Update fields of a client', async function() {
    const c = await new Client({ name: CLIENT_NAME }).save();
    const clientUpdatedFields = await makeMongoFields();

    req.user = admin;
    await clientsController.updateClient(req.setBody({
      id: c._id,
      fields: clientUpdatedFields,
    }), res);

    assert(!res.isJsonError());
    const updatedClient = await Client.findOne({ _id: c._id });
    assert.strictEqual(
      updatedClient.fields.length,
      clientUpdatedFields.length,
    );
  });
});
