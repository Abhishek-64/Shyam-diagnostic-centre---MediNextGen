import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { AdminUser } from '../../database/models/index.js';
import { sendSuccess, sendUnauthorized, sendValidationError } from '../../utils/response.js';
import { recordAuditLog } from '../../middlewares/audit.middleware.js';

export async function adminLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    const admin = await AdminUser.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!admin || !admin.isActive) {
      return sendUnauthorized(res, 'Invalid email or password.');
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return sendUnauthorized(res, 'Invalid email or password.');
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    // Update lastLoginAt
    await admin.update({ lastLoginAt: new Date() });

    // Set HttpOnly cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: env.isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    await recordAuditLog({
      adminUserId: admin.id,
      action: 'admin.login',
      entityType: 'AdminUser',
      entityId: admin.id,
      req,
    });

    return sendSuccess(res, {
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLoginAt: admin.lastLoginAt,
      },
    }, 'Login successful');
  } catch (error) {
    return next(error);
  }
}

export async function adminLogout(req, res, next) {
  try {
    if (req.adminUser) {
      await recordAuditLog({
        adminUserId: req.adminUser.id,
        action: 'admin.logout',
        entityType: 'AdminUser',
        entityId: req.adminUser.id,
        req,
      });
    }

    res.clearCookie('admin_token');
    return sendSuccess(res, {}, 'Logout successful');
  } catch (error) {
    return next(error);
  }
}

export async function getAdminMe(req, res, next) {
  try {
    return sendSuccess(res, {
      id: req.adminUser.id,
      name: req.adminUser.name,
      email: req.adminUser.email,
      role: req.adminUser.role,
      lastLoginAt: req.adminUser.lastLoginAt,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminProfile(req, res, next) {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const admin = req.adminUser;

    if (newPassword) {
      if (!currentPassword) {
        return sendValidationError(res, [
          { field: 'currentPassword', message: 'Current password is required to set a new password.' },
        ]);
      }
      const match = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!match) {
        return sendValidationError(res, [
          { field: 'currentPassword', message: 'Current password does not match.' },
        ]);
      }
      const salt = await bcrypt.genSalt(10);
      admin.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    if (name) {
      admin.name = name;
    }

    await admin.save();

    await recordAuditLog({
      adminUserId: admin.id,
      action: 'admin.update_profile',
      entityType: 'AdminUser',
      entityId: admin.id,
      req,
    });

    return sendSuccess(res, {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    }, 'Profile updated successfully');
  } catch (error) {
    return next(error);
  }
}
