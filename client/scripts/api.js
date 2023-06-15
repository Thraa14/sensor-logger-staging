import 'regenerator-runtime/runtime';
import axios from 'axios';
import { api } from '../components/utils';
import { AxiosResponse } from 'axios';

const debug = require('debug')('client:utils:api');

class Api {
  constructor(token) {
    this.setAuthorizationToken(token);
    axios.defaults.headers.get['Accept'] = 'application/json';
    axios.defaults.headers.post['Accept'] = 'application/json';
    // Don't check error codes internally
    axios.defaults.validateStatus = (_) => true;
    axios.interceptors.response.use(
      handleResponse,
      function(_) {
        throw new Error('Illegal state');
      },
    );
  }

  setAuthorizationToken(token) {
    axios.defaults.headers['Authorization'] = `Bearer: ${token}`;
  }

  isAuthenticated() {
    return Boolean(axios.defaults.headers['Authorization']);
  }

  logout() {
    delete axios.defaults.headers['Authorization'];
  }

  /**
   * @returns {Promise}
   */
  async getTickData(fieldName, lastReadingTime) {
    return await httpGet(
      `/api/readings/private/tick/${fieldName}`, lastReadingTime);
  }

  async getLiveData(fieldName) {
    return await httpGet(`/api/readings/private/live/${fieldName}`);
  }

  async getFields(params = null) {
    return await httpGet('/api/fields', params);
  }

  async getFieldReadings(fieldName, lastReadingTime = null) {
    debug(lastReadingTime);
    console.debug(lastReadingTime);
    return await httpGet(
      `/api/readings/private/tick/${fieldName}`,
      { lastReadingTime });
  }

  async clearLogs() {
    return await httpDelete('/api/readings/private');
  }

  async addUser(userData) {
    return await httpPost('/api/users', userData);
  }

  async updateUser(userData) {
    return await httpPut('/api/users', userData);
  }

  async deleteUser(userData) {
    return await httpDelete('/api/users', userData);
  }

  /**
   * @returns {Promise}
   */
  async login(params) {
    return await httpPost('/auth', params);
  }

  async newField(fieldData) {
    return await httpPost('/api/fields', fieldData);
  }

  async updateField(fieldData) {
    return await httpPut('/api/fields', fieldData);
  }

  async deleteField(fieldData) {
    return await httpDelete('/api/fields', fieldData);
  }

  async getAvailableFields() {
    return await httpGet('/api/fields/available');
  }

  async newClient(clientData) {
    return await httpPost('/api/clients', clientData);
  }

  async getUsers() {
    return await httpGet('/api/users');
  }

  async getClients() {
    return await httpGet('/api/clients');
  }

  async getClient(clientId) {
    return await httpGet(`/api/clients/${clientId}`);
  }
}

async function httpGet(url, params = null) {
  return await performHttpCall(
    async () => await axios.get(url, { params: params }),
    'httpGet',
  );
}

async function httpPost(url, body) {
  return await performHttpCall(
    async () => await axios.post(url, body),
    'httpPost',
  );
}

async function httpDelete(url, body) {
  debug('body');
  debug(body);
  return await performHttpCall(
    async () => await axios.delete(url, { params: body }),
    'httpDelete',
  );
}

async function httpPut(url, body) {
  return await performHttpCall(
    async () => await axios.put(url, body),
    'httpPut',
  );
}

async function performHttpCall(func, name) {
  try {
    const reply = await func();
    if (!reply.isSuccess) {
      debug(`[${name}] failed:`);
      debug(reply);
    }

    return reply;
  } catch (err) {
    console.error(err);
    debug(`[${name}]`);
    debug(Object.keys(err));
    debug(err.response.data);
  }
}

export class SuccessResponse {
  constructor(data) {
    this.isSuccess = true;
    this.data = data;
  }
}

export class FailureResponse {
  constructor(data, code) {
    this.isSuccess = false;
    this.code = code;
    this.errors = data.errors;
  }
}

/**
 *
 * @param {AxiosResponse} apiResponse
 */
export function handleResponse(apiResponse) {
  const { status } = apiResponse;

  if (status >= 400) {
    return handleError(apiResponse);
  }
  return handleSuccess(apiResponse);
}

/**
 *
 * @param {AxiosResponse} apiResponse
 */
export function handleSuccess(apiResponse) {
  return Object.freeze(
    new SuccessResponse(
      apiResponse.data,
    ),
  );
}

/**
 *
 * @param {AxiosResponse} apiResponse
 */
export function handleError(apiResponse) {
  return Object.freeze(
    new FailureResponse(
      apiResponse.data, apiResponse.status,
    ),
  );
}


export { Api };
