// backend/src/utils/logger.ts

import winston from 'winston';
import path from 'path';

const logDir = 'logs';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Console for all logs
    new winston.transports.Console(),

    // File for all logs
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    }),

    // File for only errors
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
  ],
});
