import express from 'express';
import { index, add, read, update, remove } from './clientsController';

function rejectNonAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    // TODO: check that use has access to client's fields
    return res
      .status(401)
      .json({ errors: ['Only admins can view this page.'] });
  }

  next();
}

const clientsRouter = express.Router();
clientsRouter.use(rejectNonAdmin);
clientsRouter.get('/', index);
clientsRouter.post('/', add);
clientsRouter.get('/:id', read);
clientsRouter.put('/', update);
clientsRouter.delete('/:id', remove);

export { clientsRouter };
