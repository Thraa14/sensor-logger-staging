import { Api } from './scripts/api.js';

const api = new Api();

/** @type {HTMLAnchorElement} */
const forgotPassword = document.getElementById('showPasswordTag');
forgotPassword.addEventListener('click', () => {
  alert('Login: picoadmin\nPassword: pass');
  return false;
});

const submitButton = document.getElementById('loginForm');
submitButton.addEventListener('submit', async (e) => {
  e.preventDefault();

  /** @type {HTMLInputElement} */
  const usernameInput = document.getElementById('login');
  const username = usernameInput.value;

  /** @type {HTMLInputElement} */
  const passwordInput = document.getElementById('password');
  const password = passwordInput.value;
  try {
    const { data, status } = await api.login(username, password);
    if (status === 200) {
      const { token } = data;
      console.debug(token);
      api.setAuthorizationToken(token);
      localStorage.setItem('token', token);
      window.location.replace('/data.html');
    }
  } catch (err) {
    alert('Invalid username or password.');
  }
});
