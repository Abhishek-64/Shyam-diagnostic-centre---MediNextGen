import { AuditLog, AdminUser } from '../../database/models/index.js';
import { sendSuccess } from '../../utils/response.js';
import { parsePagination, formatPaginatedResponse } from '../../utils/pagination.js';

export async function getAdminAuditLogs(req, res, next) {
  try {
    const { page, limit, offset } = parsePagination(req.query, 25);
    const { action, entityType } = req.query;

    const where = {};
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;

    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: AdminUser,
          as: 'adminUser',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return sendSuccess(res, formatPaginatedResponse(rows, count, page, limit));
  } catch (error) {
    return next(error);
  }
}
