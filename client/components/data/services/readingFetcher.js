import {
  cleanUpReadings,
  cleanUpReading,
} from '../readingParser';
import { api } from '../../utils';

const debug = require('debug')('client:services:readingFetcher');


class ReadingFetcher {
  /**
   *
   * @param {string} fieldName
   * @returns {Array<Reading>}
   */
  async fetchTableData(fieldName) {
    const response = await api.getFieldReadings(fieldName);
    if (!response.isSuccess) {
      return response;
    }
    const readings = response.data.readings;
    return {
      isSuccess: true,
      readings: cleanUpReadings(readings),
    };
  }

  /**
   * Fetches tick update from API.
   * @param {string} fieldName
   * @param {string} lastReadingTime 'MM/DD/YYYY hh:mm'
   * @returns {Reading}
   */
  async fetchTickUpdate(fieldName, lastReadingTime) {
    const response = await api.getTickData(
      fieldName, { lastReadingTime },
    );

    if (!response.isSuccess) {
      return response;
    }
    const readings = response.data.readings;

    return {
      isSuccess: true,
      readings: cleanUpReadings(readings),
    };
  }

  /**
   * Fetches live updates from API.
   * @param {string} fieldName
   * @returns {Reading}
   */
  async fetchLiveUpdate(fieldName) {
    const apiResponse = await api.getLiveData(fieldName);
    if (!apiResponse.isSuccess) {
      return apiResponse;
    }

    const live = apiResponse.data.live;
    return {
      isSuccess: true,
      live: cleanUpReading(live),
    };
  }
}

export default new ReadingFetcher();
