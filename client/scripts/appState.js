const USER_KEY = 'integrate_user';
const TOKEN_KEY = 'integrate_token';
const debug = require('debug')('client:scripts:state');

export class AppState {
  clear() {
    sessionStorage.clear();
  }

  isLoggedIn() {
    return sessionStorage.getItem(USER_KEY) !== null;
  }

  /**
   * @param {User} user
   * @param {string} token
   */
  login(user, token) {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * @returns {string}
   */
  token() {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  /**
   *
   * @returns {User}
   */
  user() {
    const userString = sessionStorage.getItem(USER_KEY);
    return JSON.parse(userString);
  }

  isAdmin() {
    return this.user().isAdmin;
  }

  logout() {
    sessionStorage.removeItem(USER_KEY);
  }
}
