import axios from 'axios';
import logger from '../config/logger.js';
import { API_BASE_URL, FRONTEND_BASE_URL } from '../config/config.js';

const interval = 60000; // Interval in milliseconds

function pingUrl(url) {
  axios
    .get(url)
    .then((response) => {
      logger.info(
        `Successfully pinged ${url} at ${new Date().toISOString()}: ${
          response.status
        }`
      );
    })
    .catch((error) => {
      logger.error(
        `Error pinging ${url} at ${new Date().toISOString()}: ${error}`
      );
    });
}

export const initPingIntervals = () => {
  logger.info('Starting ping intervals');
  setInterval(() => pingUrl(FRONTEND_BASE_URL), interval);
  setInterval(() => pingUrl(`${API_BASE_URL}/api/health`), interval);
};
