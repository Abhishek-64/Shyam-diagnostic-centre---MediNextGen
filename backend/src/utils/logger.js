/**
 * logger.js — Structured logger using Pino.
 *
 * - In development: pretty-printed output.
 * - In production: JSON lines to stdout (compatible with hosting platforms).
 * - Never log secrets, passwords, or raw SQL parameters.
 */

import pino from 'pino';
import { env } from '../config/env.js';

const logger = pino(
  {
    level: env.isDev ? 'debug' : 'info',
    // Redact sensitive fields if they ever appear in log objects
    redact: {
      paths: ['password', 'DB_PASSWORD', 'authorization', 'cookie', '*.password', '*.token'],
      censor: '[REDACTED]',
    },
  },
  env.isDev
    ? pino.transport({
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:HH:MM:ss',
          ignore: 'pid,hostname',
        },
      })
    : undefined
);

export default logger;
