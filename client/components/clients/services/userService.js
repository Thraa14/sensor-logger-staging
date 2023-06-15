import { api } from '../../utils';

const debug = require('debug')('client:clients:fetcher');

export class UserService {
  async fetchUsers() {
    // TODO: pass cancellation function
    // https://github.com/axios/axios#cancellation
    const response = await api.getUsers();
    if (!response.isSuccess) {
      return response;
    }

    return {
      isSuccess: true,
      users: response.data.users,
    };
  }
}
