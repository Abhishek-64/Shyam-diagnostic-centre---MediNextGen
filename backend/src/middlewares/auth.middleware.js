import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AdminUser } from '../database/models/index.js';
import { sendUnauthorized, sendForbidden } from '../utils/response.js';

export async function authenticateAdmin(req, res, next) {
  try {
    let token = null;

    // 1. Check HttpOnly cookie
    if (req.cookies && req.cookies.admin_token) {
      token = req.cookies.admin_token;
    }
    // 2. Check Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendUnauthorized(res, 'Authentication required. Please log in.');
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      return sendUnauthorized(res, 'Invalid or expired session. Please log in again.');
    }

    // Find admin user
    const admin = await AdminUser.findByPk(decoded.id);
    if (!admin || !admin.isActive) {
      return sendUnauthorized(res, 'Account is inactive or no longer exists.');
    }

    req.adminUser = admin;
    return next();
  } catch (error) {
    return next(error);
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.adminUser) {
      return sendUnauthorized(res);
    }
    if (!allowedRoles.includes(req.adminUser.role)) {
      return sendForbidden(res, `Requires one of roles: ${allowedRoles.join(', ')}`);
    }
    return next();
  };
}
