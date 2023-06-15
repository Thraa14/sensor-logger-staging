import { Client } from './clientModel';
import { handleError } from '../controllerUtils';

const debug = require('debug')('app:tests:models:client');

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
export async function index(req, res) {
  try {
    const clients = await Client
      .find({})
      .select('name');
    res.json({ clients });
  } catch (err) {
    handleError(err, res);
  }
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
export async function add(req, res) {
  try {
    const { name, fields } = req.body;
    const client = new Client({ name, fields });
    await client.save();
    res.json({ client });
  } catch (e) {
    handleError(e, res);
  }
}

export async function read(req, res) {
  try {
    const clientId = req.params.id;
    const client = await Client
      .findOne({ _id: clientId })
      .populate({
        path: 'fields',
        populate: {
          path: 'managers', select: 'username isAdmin',
        },
      })
      .lean();
    res.json({ client: client });
  } catch (err) {
    handleError(err, res);
  }
}

// TODO: use :id URI
export async function update(req, res) {
  try {
    const clientId = req.body.id;
    await Client
      .findOneAndUpdate(
        { _id: clientId }, req.body,
      );
  } catch (err) {
    handleError(err, res);
  }
}


export function remove(req, res) {
  try {
    const fieldId = req.query._id;
    debug('delete body:');
    debug(req.query);

    // TODO: delete client + fields + readings (refactor fieldsController)
    // const deleted = await Client
    //   .findOneAndDelete({ _id: mongoose.Types.ObjectId(fieldId) })
    //   .select('name')
    //   .lean();
    // const { deletedCount } = await Reading.deleteMany({
    //   fieldName: deleted.name,
    // });
    // debug('Deleted [%s] field and its %d readings.',
    //   deleted.name, deletedCount);
    // res.status(200).json({ field: deleted, readingCount: deletedCount });
  } catch (err) {
    handleError(err, res);
  }
}
