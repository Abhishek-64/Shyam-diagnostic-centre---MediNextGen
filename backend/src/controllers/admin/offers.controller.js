import { Offer } from '../../database/models/index.js';
import { sendSuccess, sendNotFound } from '../../utils/response.js';
import { recordAuditLog } from '../../middlewares/audit.middleware.js';

export async function getAdminOffers(req, res, next) {
  try {
    const offers = await Offer.findAll({
      order: [['id', 'DESC']],
    });
    return sendSuccess(res, offers);
  } catch (error) {
    return next(error);
  }
}

export async function createAdminOffer(req, res, next) {
  try {
    const {
      title,
      code,
      description,
      discountPercentage,
      discountAmountInPaise,
      validFrom,
      validUntil,
      bannerText,
      isVerified,
      isPublished,
    } = req.body;

    const offer = await Offer.create({
      title,
      code: code ? code.toUpperCase() : null,
      description,
      discountPercentage,
      discountAmountInPaise,
      validFrom: validFrom || null,
      validUntil: validUntil || null,
      bannerText,
      isVerified: isVerified || false,
      isPublished: isPublished || false,
    });

    await recordAuditLog({
      action: 'offer.create',
      entityType: 'Offer',
      entityId: offer.id,
      details: { title: offer.title, code: offer.code },
      req,
    });

    return sendSuccess(res, offer, 'Offer created successfully', 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminOffer(req, res, next) {
  try {
    const { id } = req.params;
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return sendNotFound(res, 'Offer not found');
    }

    const {
      title,
      code,
      description,
      discountPercentage,
      discountAmountInPaise,
      validFrom,
      validUntil,
      bannerText,
      isVerified,
      isPublished,
    } = req.body;

    if (title !== undefined) offer.title = title;
    if (code !== undefined) offer.code = code ? code.toUpperCase() : null;
    if (description !== undefined) offer.description = description;
    if (discountPercentage !== undefined) offer.discountPercentage = discountPercentage;
    if (discountAmountInPaise !== undefined) offer.discountAmountInPaise = discountAmountInPaise;
    if (validFrom !== undefined) offer.validFrom = validFrom || null;
    if (validUntil !== undefined) offer.validUntil = validUntil || null;
    if (bannerText !== undefined) offer.bannerText = bannerText;
    if (isVerified !== undefined) offer.isVerified = isVerified;
    if (isPublished !== undefined) offer.isPublished = isPublished;

    await offer.save();

    await recordAuditLog({
      action: 'offer.update',
      entityType: 'Offer',
      entityId: offer.id,
      details: { title: offer.title, isPublished: offer.isPublished },
      req,
    });

    return sendSuccess(res, offer, 'Offer updated successfully');
  } catch (error) {
    return next(error);
  }
}

export async function deleteAdminOffer(req, res, next) {
  try {
    const { id } = req.params;
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return sendNotFound(res, 'Offer not found');
    }

    await recordAuditLog({
      action: 'offer.delete',
      entityType: 'Offer',
      entityId: offer.id,
      details: { title: offer.title },
      req,
    });

    await offer.destroy();
    return sendSuccess(res, {}, 'Offer deleted successfully');
  } catch (error) {
    return next(error);
  }
}
