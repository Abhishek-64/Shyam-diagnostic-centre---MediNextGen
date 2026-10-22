/**
 * response.js — Standard JSON response helpers.
 *
 * All API responses follow:
 *   { success: true,  message: string, data: any }
 *   { success: false, message: string, errors: any[] }
 */

export function sendSuccess(res, data = {}, message = 'Request completed successfully', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function sendCreated(res, data = {}, message = 'Resource created successfully') {
  return res.status(201).json({ success: true, message, data });
}

export function sendError(res, message = 'An error occurred', errors = [], statusCode = 500) {
  return res.status(statusCode).json({ success: false, message, errors });
}

export function sendValidationError(res, errors = [], message = 'Validation failed') {
  return res.status(422).json({ success: false, message, errors });
}

export function sendNotFound(res, message = 'Resource not found') {
  return res.status(404).json({ success: false, message, errors: [] });
}

export function sendUnauthorized(res, message = 'Unauthorized access') {
  return res.status(401).json({ success: false, message, errors: [] });
}

export function sendForbidden(res, message = 'Forbidden: insufficient permissions') {
  return res.status(403).json({ success: false, message, errors: [] });
}

