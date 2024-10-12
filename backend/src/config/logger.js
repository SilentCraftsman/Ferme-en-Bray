import { createLogger, format, transports } from 'winston';
import { LOG_DIR } from './config.js';
import fs from 'fs';
import path from 'path';

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// check if absolute path is provided
if (!path.isAbsolute(LOG_DIR)) {
  throw new Error('LOG_DIR must be an absolute path');
}

// create dir if not exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const logger = createLogger({
  level: 'info',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [
    // Apply colorize only to console transport
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      ),
    }),
    // File transports without colorize
    new transports.File({ filename: `${LOG_DIR}/error.log`, level: 'error' }),
    new transports.File({ filename: `${LOG_DIR}/combined.log` }),
  ],
});

export default logger;
