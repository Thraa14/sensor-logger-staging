import express from 'express';
import {
  newField,
  getFields,
  updateField,
  getAllReadingFields,
  deleteField,
} from './fieldsController';


const fieldsRouter = express.Router();

fieldsRouter.post('/', newField);
fieldsRouter.put('/', updateField);
fieldsRouter.delete('/', deleteField);
fieldsRouter.get('/', getFields);
fieldsRouter.get('/available', getAllReadingFields);

export { fieldsRouter };
