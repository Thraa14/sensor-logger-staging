import express from 'express';
import {
  saveTick, getTick,
  getLive, saveLive,
  getAll, clearAll,
  getFieldReadings,
} from './readingsController.js';

const readingsRouter = express.Router();

// TODO: Add middleware for checking managedFields
readingsRouter.post('/tick', saveTick);
// TODO: Add auth for posting data.
readingsRouter.post('/live', saveLive);


readingsRouter.get('/private/tick/:fieldName', getTick);
readingsRouter.get('/private/live/:fieldName', getLive);

readingsRouter.get('/:fieldName', getFieldReadings);
readingsRouter.get('/', getAll);
readingsRouter.delete('/', clearAll);

export { readingsRouter };
