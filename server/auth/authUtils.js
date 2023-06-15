import express from 'express'; // eslint-disable-line no-unused-vars
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../users/userModel';

const debug = require('debug')('app:utils:auth');


/**
 * @param {express.Request} req User request
 * @param {express.Response} res
 * @param next
 */
function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,
    async (err, tokenClaims) => {
      if (err) {
        // TODO: find out how to auto refresh token.
        console.error(err);
        return res.sendStatus(403);
      }
      req.user = await User.findOne({ username: tokenClaims.username });
      next();
    });
}

/**
 * @param {string} username User request
 * @return {string} Generated token
 */
function generateToken(username) {
  return jwt.sign(username, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '5d',
  });
}

/**
 * Computes the hash of a user's password.
 * @param {String} plainText
 * @param {Number?} saltRounds
 */
async function hashPassword(plainText, saltRounds = 10) {
  return await bcrypt.hash(plainText, saltRounds);
}

/**
 * Checks an entered password with a stored hash.
 * @param {String} plainText
 * @param {String} hash
 */
async function checkPassword(plainText, hash) {
  return await bcrypt.compare(plainText, hash);
}

export { authenticateUser, generateToken, hashPassword, checkPassword };
