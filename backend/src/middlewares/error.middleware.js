/**
 * error.middleware.js — Centralised error handler.
 *
 * Must be registered LAST in Express middleware stack.
 * Catches errors passed via next(err).
 */

import { ZodError } from 'zod';
import { ValidationError, UniqueConstraintError, DatabaseError } from 'sequelize';
import logger from '../utils/logger.js';
import { env } from '../config/env.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const requestId = req.headers['x-request-id'] || 'unknown';

  // Zod validation errors (should normally be caught by validate middleware,
  // but guard here as a safety net)
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
    return res.status(422).json({ success: false, message: 'Validation failed.', errors });
  }

  // Sequelize validation / constraint errors
  if (err instanceof UniqueConstraintError) {
    const errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
    return res.status(409).json({
      success: false,
      message: 'A record with that value already exists.',
      errors,
    });
  }

  if (err instanceof ValidationError) {
    const errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
    return res.status(422).json({ success: false, message: 'Validation failed.', errors });
  }

  if (err instanceof DatabaseError) {
    logger.error({ requestId, err: err.message }, 'Database error');
    // Never expose raw SQL or DB internals in production
    const message = env.isProd
      ? 'A database error occurred. Please try again later.'
      : `Database error: ${err.message}`;
    return res.status(500).json({ success: false, message, errors: [] });
  }

  // Known application errors with a statusCode property
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message || 'An error occurred.',
      errors: err.errors || [],
    });
  }

  // Unexpected errors
  logger.error(
    {
      requestId,
      method: req.method,
      url: req.originalUrl,
      // Never log request body — it may contain secrets
      statusCode: err.statusCode || 500,
      err: err.message,
      // Only include stack in development
      ...(env.isDev ? { stack: err.stack } : {}),
    },
    'Unhandled error'
  );

  const message = env.isProd
    ? 'An internal server error occurred. Please try again later.'
    : err.message || 'Internal server error.';

  return res.status(500).json({ success: false, message, errors: [] });
}
