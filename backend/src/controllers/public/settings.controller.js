import { SiteSettings } from '../../database/models/index.js';
import { sendSuccess } from '../../utils/response.js';

export async function getPublicSiteSettings(req, res, next) {
  try {
    const settings = await SiteSettings.findAll({
      where: { isPublic: true },
      attributes: ['settingKey', 'settingValue', 'description'],
    });

    const settingsMap = {};
    settings.forEach((s) => {
      settingsMap[s.settingKey] = s.settingValue;
    });

    return sendSuccess(res, settingsMap);
  } catch (error) {
    return next(error);
  }
}
