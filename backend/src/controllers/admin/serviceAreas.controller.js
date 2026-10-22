import { ServiceArea } from '../../database/models/index.js';
import { sendSuccess, sendNotFound } from '../../utils/response.js';
import { recordAuditLog } from '../../middlewares/audit.middleware.js';

export async function getAdminServiceAreas(req, res, next) {
  try {
    const areas = await ServiceArea.findAll({
      order: [
        ['state', 'ASC'],
        ['city', 'ASC'],
        ['pinCode', 'ASC'],
      ],
    });
    return sendSuccess(res, areas);
  } catch (error) {
    return next(error);
  }
}

export async function createAdminServiceArea(req, res, next) {
  try {
    const { pinCode, areaName, city, state, isHomeCollectionActive, isAllIndiaPartner, notes } = req.body;

    const area = await ServiceArea.create({
      pinCode,
      areaName,
      city,
      state: state || 'Gujarat',
      isHomeCollectionActive: isHomeCollectionActive ?? true,
      isAllIndiaPartner: isAllIndiaPartner ?? false,
      notes,
    });

    await recordAuditLog({
      action: 'serviceArea.create',
      entityType: 'ServiceArea',
      entityId: area.id,
      details: { pinCode: area.pinCode, areaName: area.areaName },
      req,
    });

    return sendSuccess(res, area, 'Service area added successfully', 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminServiceArea(req, res, next) {
  try {
    const { id } = req.params;
    const area = await ServiceArea.findByPk(id);
    if (!area) {
      return sendNotFound(res, 'Service area not found');
    }

    const { pinCode, areaName, city, state, isHomeCollectionActive, isAllIndiaPartner, notes } = req.body;

    if (pinCode !== undefined) area.pinCode = pinCode;
    if (areaName !== undefined) area.areaName = areaName;
    if (city !== undefined) area.city = city;
    if (state !== undefined) area.state = state;
    if (isHomeCollectionActive !== undefined) area.isHomeCollectionActive = isHomeCollectionActive;
    if (isAllIndiaPartner !== undefined) area.isAllIndiaPartner = isAllIndiaPartner;
    if (notes !== undefined) area.notes = notes;

    await area.save();

    await recordAuditLog({
      action: 'serviceArea.update',
      entityType: 'ServiceArea',
      entityId: area.id,
      details: { pinCode: area.pinCode },
      req,
    });

    return sendSuccess(res, area, 'Service area updated successfully');
  } catch (error) {
    return next(error);
  }
}

export async function deleteAdminServiceArea(req, res, next) {
  try {
    const { id } = req.params;
    const area = await ServiceArea.findByPk(id);
    if (!area) {
      return sendNotFound(res, 'Service area not found');
    }

    await recordAuditLog({
      action: 'serviceArea.delete',
      entityType: 'ServiceArea',
      entityId: area.id,
      details: { pinCode: area.pinCode },
      req,
    });

    await area.destroy();
    return sendSuccess(res, {}, 'Service area deleted successfully');
  } catch (error) {
    return next(error);
  }
}
