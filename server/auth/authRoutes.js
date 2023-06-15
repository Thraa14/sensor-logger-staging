import express from 'express';
import { signIn } from './authController.js';

const authRouter = express.Router();

authRouter.post('/', signIn);

export { authRouter };
