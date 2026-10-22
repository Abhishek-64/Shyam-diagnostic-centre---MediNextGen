import { ServiceArea, SiteSettings } from '../../database/models/index.js';
import { sendSuccess, sendValidationError } from '../../utils/response.js';

export async function checkPinCodeAvailability(req, res, next) {
  try {
    const { pinCode } = req.query;

    if (!pinCode || !/^\d{6}$/.test(String(pinCode).trim())) {
      return sendValidationError(res, [
        { field: 'pinCode', message: 'Please provide a valid 6-digit PIN code.' },
      ]);
    }

    const cleanPin = String(pinCode).trim();

    // Check free home collection list from site_settings
    let isFree = false;
    try {
      const freePinsSetting = await SiteSettings.findOne({
        where: { settingKey: 'home_collection_free_pincodes' },
      });
      const freePinsList = freePinsSetting
        ? freePinsSetting.settingValue.split(',').map((p) => p.trim())
        : [];
      isFree = freePinsList.includes(cleanPin);
    } catch {}

    const serviceArea = null;

    if (serviceArea) {
      if (serviceArea.isHomeCollectionActive) {
        return sendSuccess(res, {
          available: true,
          pinCode: cleanPin,
          areaName: serviceArea.areaName,
          city: serviceArea.city,
          state: serviceArea.state,
          isHomeCollection: true,
          isFreeHomeCollection: isFree,
          isAllIndiaPartner: serviceArea.isAllIndiaPartner,
          message: isFree
            ? `Excellent! Free home sample pickup is available in ${serviceArea.areaName}, ${serviceArea.city}.`
            : `Home collection is available in ${serviceArea.areaName}, ${serviceArea.city}.`,
        });
      } else if (serviceArea.isAllIndiaPartner) {
        return sendSuccess(res, {
          available: true,
          pinCode: cleanPin,
          areaName: serviceArea.areaName,
          city: serviceArea.city,
          state: serviceArea.state,
          isHomeCollection: false,
          isAllIndiaPartner: true,
          message: `Diagnostic service available in ${serviceArea.city} via our verified partner laboratory network.`,
        });
      }
    }

    // Unconfigured PIN code: NEVER claim available!
    return sendSuccess(res, {
      available: false,
      pinCode: cleanPin,
      isHomeCollection: false,
      isAllIndiaPartner: false,
      message: `Direct home collection is not yet automated for PIN ${cleanPin}. However, you can submit an enquiry or chat with us on WhatsApp to check custom technician dispatch.`,
    });
  } catch (error) {
    return next(error);
  }
}
