import { api } from '../../utils';

const debug = require('debug')('client:auth:services');

class AuthService {
  async login(params) {
    const response = await api.login(params);
    if (!response.isSuccess) {
      return response;
    }
    const credentials = response.data;
    return {
      isSuccess: true,
      user: credentials.user,
      token: credentials.token,
    };
  }

  async signUp(params) {
    const response = await api.addUser(params);
    if (!response.isSuccess) {
      return response;
    }
    const { _id, username } = response.data;
    return {
      isSuccess: true,
      id: _id,
      username: username,
    };
  }

  async updateUser(params) {
    const response = await api.updateUser(params);
    if (!response.isSuccess) {
      return response;
    }
    const { _id, username } = response.data;
    return {
      isSuccess: true,
      id: _id,
      username: username,
    };
  }

  logout() {
    api.logout();
  }

  authenticate(token) {
    api.setAuthorizationToken(token);
  }

  isAuthenticated() {
    return api.isAuthenticated();
  }
}

export default new AuthService();
