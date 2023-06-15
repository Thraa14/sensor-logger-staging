/* eslint-disable max-len */
import { MongoError } from 'mongodb';
import { Error } from 'mongoose';

const sinon = require('sinon');
const assert = require('assert');
const faker = require('faker');
const moment = require('moment');
const mongoose = require('mongoose');
const debug = require('debug')('app:tests:testUtils');

const fakeObjectId = () => mongoose.Types.ObjectId().toString();

function fakeRandomCount(fakeFunc, maxCount = 3) {
  const fakeObjects = [];
  for (let i = 0; i < faker.random.number(maxCount); i++) {
    fakeObjects.push(fakeFunc());
  }
  return fakeObjects;
}

export function fakeLiveReading() {
  const date = moment(faker.date.future()).utc();
  return {
    'readingTime': date.format(),
    'ReadingTime': moment(date).format('MM/DD/YYYY hh:mm'),
    'fieldName': faker.name.findName(),
    'ReadingId': 0,
    'IsLiveFeed': true,
    'SepPressure': faker.random.number(),
    'GasTemprature': faker.random.number(),
    'DiffPressure': faker.random.number(),
    'WaterRate': faker.random.number(),
  };
}

export function fakeUser() {
  return {
    name: faker.name.firstName(),
    username: faker.name.findName(),
    isAdmin: faker.random.boolean(),
    _id: fakeObjectId(),
  };
}

export function fakeField() {
  return {
    name: faker.name.firstName() + ' (Field)',
    _id: fakeObjectId(),
    note: '',
    managers: fakeRandomCount(fakeUser),
  };
}

export function fakeClient() {
  return {
    name: faker.name.firstName(),
    _id: fakeObjectId(),
    fields: fakeRandomCount(fakeField),
  };
}

export function fakeTickReading() {
  const date = moment(faker.date.future()).utc();
  return {
    'readingTime': date.format(),
    'ReadingTime': moment(date).format('MM/DD/YYYY hh:mm'),
    'fieldName': faker.name.findName(),
    'ReadingId': 0,
    'IsLiveFeed': false,
    'OrificeId': faker.random.number(),
    'PipeId': faker.finance.amount(),
    'SepPressure': faker.random.number(),
    'GasTemprature': faker.random.number(),
    'DiffPressure': faker.random.number(),
    'SpecificGravity': faker.finance.amount(),
    'H2S': 1e-06,
    'CO2': faker.finance.amount(),
    'GasRate': faker.finance.amount(),
    'WaterRate': faker.random.number(),
    'SAL': faker.random.number(),
    'PH': faker.random.number(),
  };
}

/**
 * Constructs a fake express-response object.
 * @returns {{json: Sinon.SinonSpy, status: Sinon.SinonStub<any[], any>, isJsonError(): boolean, getJsonErrors(): Array}}
 */
export function responseObject() {
  const status = sinon.stub();
  const sendStatus = sinon.stub();
  const json = sinon.spy();
  const res = {
    status,
    json,
    sendStatus,
    isJsonError() {
      return isJsonError(this.json);
    },
    getJsonErrors() {
      return getJsonErrors(this.json);
    },
    getResponseJson() {
      return this.json.firstCall.firstArg;
    },
  };
  status.returns(res);
  sendStatus.returns(res);
  return res;
}

function getJsonErrors(json) {
  const errors = [];
  for (const call of json.getCalls()) {
    for (const arg of call.args) {
      if (arg['error'] !== undefined || arg['errors'] !== undefined) {
        errors.push(arg);
      }
    }
  }
  return errors;
}

function isJsonError(json) {
  return getJsonErrors(json).length !== 0;
}

/**
 * Returns an empty request object
 * @returns {{body: Object, setBody(Object): void, body: Object, setParams(Object): void, query: Object, setQuery(Object): void}}
 */
export function requestObject() {
  const request = {};

  Object.defineProperties(request, {
    body: {
      writable: true,
      configurable: false,
      enumerable: true,
    },
    setBody: {
      writable: false,
      configurable: false,
      enumerable: false,
      value: (body) => {
        request.body = body;
        return request;
      },
    },
    params: {
      writable: true,
      configurable: false,
      enumerable: true,
    },
    setParams: {
      writable: false,
      configurable: false,
      enumerable: false,
      value: (params) => {
        request.params = params;
        return request;
      },
    },
    query: {
      writable: true,
      configurable: false,
      enumerable: true,
    },
    setQuery: {
      writable: false,
      configurable: false,
      enumerable: false,
      value: (query) => {
        request.query = query;
        return request;
      },
    },
  });
  return request;
}

export async function assertModelValidationErrors(
  modelConstructAction,
  ...errorFields) {
  try {
    await modelConstructAction();
    assert(false, 'Model validation error is expected to be thrown.');
  } catch (e) {
    if (e instanceof assert.AssertionError) {
      throw e;
    } else if (e instanceof Error.ValidationError) {
      const keys = Object.keys(e.errors);
      errorFields.forEach((field) => {
        assert(
          keys.includes(field),
          `Expected [ ${field} ] to be in errored fields: [ ${keys.join(',')} ]`,
        );
      });
    } else if (e instanceof MongoError) {
      // Unique index errors.
      const keys = Object.keys(e.keyPattern);
      errorFields.forEach((field) => {
        assert(
          keys.includes(field),
          `Expected [ ${field} ] to be in errored fields: [ ${keys.join(',')} ]`,
        );
      });
    } else {
      throw e;
    }
  }
}

exports.assertModelValidationErrors = assertModelValidationErrors;
exports.responseObject = responseObject;
exports.requestObject = requestObject;
