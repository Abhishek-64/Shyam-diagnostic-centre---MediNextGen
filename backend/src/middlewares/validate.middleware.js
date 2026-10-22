/**
 * validate.middleware.js
 *
 * Factory that creates validation middleware from a Zod schema.
 * Validates req.body, req.query, or req.params.
 */

import { sendValidationError } from '../utils/response.js';

/**
 * @param {import('zod').ZodSchema} schema
 * @param {'body'|'query'|'params'} source
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return sendValidationError(res, errors);
    }
    // Replace the source with the parsed (and coerced) data
    req[source] = result.data;
    return next();
  };
}
