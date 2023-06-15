import { api } from '../../utils';

class FieldService {
  async newField(fieldData) {
    const response = await api.newField(fieldData);

    if (!response.isSuccess) {
      return response;
    }

    return {
      isSuccess: response.isSuccess,
      field: response.data.field,
    };
  }

  async getFields() {
    return await this.performGetFields(api.getFields);
  }

  async getAvailableFields() {
    return await this.performGetFields(api.getAvailableFields);
  }

  async deleteField(fieldData) {
    const response = await api.deleteField(fieldData);

    if (!response.isSuccess) {
      return response;
    }

    // TODO: refactor the isSuccess property into a class
    return {
      isSuccess: true,
      field: response.data.field,
      readingCount: response.data.readingCount,
    };
  }

  async performGetFields(func) {
    const response = await func();
    if (!response.isSuccess) {
      return response;
    }

    return {
      isSuccess: true,
      fields: response.data.fields,
    };
  }
}

export default new FieldService();
