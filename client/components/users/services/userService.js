import { api } from '../../utils';

class UserService {
  async getUsers() {
    const response = await api.getUsers();
    if (!response.isSuccess) {
      return response;
    }

    return {
      isSuccess: true,
      users: response.data.users,
    };
  }

  // TODO: getUser

  async newUser(userData) {
    const response = await api.addUser(userData);

    if (!response.isSuccess) {
      return response;
    }

    return {
      isSuccess: response.isSuccess,
      user: response.data.user,
    };
  }

  async deleteUser(userData) {
    const response = await api.deleteUser(userData);

    if (!response.isSuccess) {
      return response;
    }

    // TODO: refactor the isSuccess property into a class
    return {
      isSuccess: true,
      user: response.data.user,
      readingCount: response.data.readingCount,
    };
  }
}

export default new UserService();
