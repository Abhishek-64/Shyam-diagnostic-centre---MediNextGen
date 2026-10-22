import { SiteSettings } from '../../database/models/index.js';
import { sendSuccess, sendNotFound } from '../../utils/response.js';
import { recordAuditLog } from '../../middlewares/audit.middleware.js';

export async function getAdminSettings(req, res, next) {
  try {
    const settings = await SiteSettings.findAll({
      order: [['isPublic', 'DESC'], ['settingKey', 'ASC']],
    });
    return sendSuccess(res, settings);
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminSetting(req, res, next) {
  try {
    const { key } = req.params;
    const { settingValue, description, isPublic } = req.body;

    let setting = await SiteSettings.findOne({ where: { settingKey: key } });
    if (!setting) {
      setting = await SiteSettings.create({
        settingKey: key,
        settingValue: settingValue || '',
        description,
        isPublic: isPublic ?? false,
      });
    } else {
      if (settingValue !== undefined) setting.settingValue = settingValue;
      if (description !== undefined) setting.description = description;
      if (isPublic !== undefined) setting.isPublic = isPublic;
      await setting.save();
    }

    await recordAuditLog({
      action: 'settings.update',
      entityType: 'SiteSettings',
      entityId: setting.id,
      details: { key, settingValue },
      req,
    });

    return sendSuccess(res, setting, `Setting "${key}" updated successfully`);
  } catch (error) {
    return next(error);
  }
}
