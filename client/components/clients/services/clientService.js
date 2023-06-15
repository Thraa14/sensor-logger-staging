import { api } from '../../utils';

const debug = require('debug')('client:clients:fetcher');

class ClientService {
  async getClients() {
    const response = await api.getClients();
    if (!response.isSuccess) {
      return response;
    }

    return {
      isSuccess: response.isSuccess,
      clients: response.data.clients,
    };
  }

  async getClient(clientId) {
    const response = await api.getClient(clientId);
    if (!response.isSuccess) {
      return response;
    }

    return {
      isSuccess: response.isSuccess,
      client: response.data.client,
    };
  }

  async newClient(clientData) {
    const response = await api.newClient(clientData);
    if (!response.isSuccess) {
      return response;
    }

    return {
      isSuccess: response.isSuccess,
      client: response.data.client,
    };
  }
}

export default new ClientService();
