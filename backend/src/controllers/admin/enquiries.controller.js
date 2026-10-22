import { Op } from 'sequelize';
import { Enquiry, EnquiryNote, Package, Test, AdminUser } from '../../database/models/index.js';
import { sendSuccess, sendNotFound, sendValidationError } from '../../utils/response.js';
import { parsePagination, formatPaginatedResponse } from '../../utils/pagination.js';
import { recordAuditLog } from '../../middlewares/audit.middleware.js';

export async function getAdminEnquiries(req, res, next) {
  try {
    const { page, limit, offset } = parsePagination(req.query, 15);
    const { status, type, search } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }
    if (type) {
      where.enquiryType = type;
    }
    if (search) {
      where[Op.or] = [
        { referenceNumber: { [Op.like]: `%${search}%` } },
        { fullName: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { pinCode: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Enquiry.findAndCountAll({
      where,
      limit,
      offset,
      order: [
        ['status', 'ASC'], // 'new' comes before others
        ['id', 'DESC'],
      ],
      include: [
        { model: Package, as: 'package', attributes: ['id', 'name', 'priceInPaise'] },
        { model: Test, as: 'test', attributes: ['id', 'name', 'priceInPaise'] },
      ],
    });

    return sendSuccess(res, formatPaginatedResponse(rows, count, page, limit));
  } catch (error) {
    return next(error);
  }
}

export async function getAdminEnquiryById(req, res, next) {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findByPk(id, {
      include: [
        { model: Package, as: 'package' },
        { model: Test, as: 'test' },
        {
          model: EnquiryNote,
          as: 'notes',
          include: [{ model: AdminUser, as: 'adminUser', attributes: ['id', 'name', 'email'] }],
        },
      ],
      order: [[{ model: EnquiryNote, as: 'notes' }, 'createdAt', 'DESC']],
    });

    if (!enquiry) {
      return sendNotFound(res, 'Enquiry not found');
    }

    return sendSuccess(res, enquiry);
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminEnquiryStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const enquiry = await Enquiry.findByPk(id);
    if (!enquiry) {
      return sendNotFound(res, 'Enquiry not found');
    }

    const prevStatus = enquiry.status;
    enquiry.status = status;
    await enquiry.save();

    // If an optional note was supplied, create an enquiry note
    const noteText = note
      ? `Status changed from "${prevStatus}" to "${status}". Note: ${note}`
      : `Status changed from "${prevStatus}" to "${status}".`;

    await EnquiryNote.create({
      enquiryId: enquiry.id,
      adminUserId: req.adminUser ? req.adminUser.id : null,
      note: noteText,
    });

    await recordAuditLog({
      action: 'enquiry.status_update',
      entityType: 'Enquiry',
      entityId: enquiry.id,
      details: { from: prevStatus, to: status, referenceNumber: enquiry.referenceNumber },
      req,
    });

    return sendSuccess(res, enquiry, `Enquiry status updated to ${status}`);
  } catch (error) {
    return next(error);
  }
}

export async function addAdminEnquiryNote(req, res, next) {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || !note.trim()) {
      return sendValidationError(res, [{ field: 'note', message: 'Note text cannot be empty' }]);
    }

    const enquiry = await Enquiry.findByPk(id);
    if (!enquiry) {
      return sendNotFound(res, 'Enquiry not found');
    }

    const newNote = await EnquiryNote.create({
      enquiryId: enquiry.id,
      adminUserId: req.adminUser ? req.adminUser.id : null,
      note: note.trim(),
    });

    await recordAuditLog({
      action: 'enquiry.add_note',
      entityType: 'Enquiry',
      entityId: enquiry.id,
      details: { referenceNumber: enquiry.referenceNumber },
      req,
    });

    return sendSuccess(res, newNote, 'Note added successfully', 201);
  } catch (error) {
    return next(error);
  }
}
