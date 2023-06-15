import { Field } from './fieldModel';
import debugModule from '../config/debug.js';
import mongoose from 'mongoose';
import { handleError } from '../controllerUtils';
import { Client } from '../clients/clientModel';
import { Reading } from '../readings/readingModel';

const debug = debugModule.makeDebug('app:controllers:fields');
const params = require('params');
const permittedParams = ['name', 'managers', 'note', 'live', 'clientId'];

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
async function newField(req, res) {
  if (!req.user.isAdmin) {
    // TODO: express error codes package.
    // TODO: check that use has access to client's fields
    return res.status(401).json({ errors: ['Unauthorized'] });
  }
  debug('FIELD DATA');
  debug(req.body);
  try {
    const { name, note, clientId, managers } = req.body;

    if (await hasDuplicate(name)) {
      return res
        .status(400)
        .json({ errors: ['Field name already exists'] });
    }

    const field = new Field({ name, note, managers });
    await field.save();
    const client = await Client.findById(clientId).populate('fields').exec();
    client.fields.push(field);
    await client.save();
    res.json({ field: field });
  } catch (e) {
    handleError(e, res);
  }
}

// TODO: Add tests
/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
async function updateField(req, res) {
  try {
    const fieldId = req.body._id;
    const attrs = params(req.body).only(permittedParams);

    if (await hasDuplicate(attrs.name, fieldId)) {
      return res
        .status(400)
        .json({ errors: ['Field name already exists'] });
    }
    const field = await Field
      .findOneAndUpdate({ _id: fieldId }, attrs)
      .lean()
      .exec();
    res.json({ field: field });
  } catch (err) {
    handleError(err, res);
  }
}

async function deleteField(req, res) {
  try {
    // TODO: use URI params not query params
    const fieldId = req.query._id;
    debug('delete body:');
    debug(req.query);

    const deleted = await Field
      .findOneAndDelete({ _id: mongoose.Types.ObjectId(fieldId) })
      .select('name')
      .lean();
    const { deletedCount } = await Reading.deleteMany({
      fieldName: deleted.name,
    });
    debug('Deleted [%s] field and its %d readings.',
      deleted.name, deletedCount);
    res.status(200).json({ field: deleted, readingCount: deletedCount });
  } catch (err) {
    handleError(err, res);
  }
}

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 */
async function getFields(req, res) {
  const user = req.user;
  try {
    let userFields;
    const populateConfig = { path: 'managers', select: 'username isAdmin' };
    if (user.isAdmin) {
      userFields = await Field
        .find()
        .populate(populateConfig)
        .lean()
        .exec();
    } else {
      userFields = await Field
        .find({
          managers: mongoose.Types.ObjectId(user._id),
        })
        .populate(populateConfig)
        .lean();
    }

    res.json({ fields: userFields });
  } catch (err) {
    handleError(err, res);
  }
}

async function getAllReadingFields(req, res) {
  try {
    const fields = await Reading
      .find()
      .distinct('fieldName')
      .lean()
      .exec();
    res.json({ fields: fields });
  } catch (err) {
    handleError(err, res);
  }
}

async function hasDuplicate(fieldName, fieldId) {
  const duplicate = await Field.findOne({ name: fieldName });

  if (duplicate !== null && fieldId !== undefined) {
    return duplicate._id.toString() !== fieldId;
  }
  return duplicate !== null;
}

// TODO: use standard exports
export { newField, getFields, updateField, getAllReadingFields, deleteField };
