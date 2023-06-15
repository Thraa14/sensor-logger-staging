/* eslint semi: "error"*/
import express from 'express';
import { index, add, me, update, remove } from './usersController.js';

const usersRouter = express.Router();

usersRouter.get('/', index);
usersRouter.put('/', update);
usersRouter.get('/:id', index);
usersRouter.post('/', add);
usersRouter.delete('/', remove);

export { usersRouter };
