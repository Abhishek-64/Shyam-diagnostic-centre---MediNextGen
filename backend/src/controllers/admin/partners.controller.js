import { PartnerLaboratory, ServiceArea } from '../../database/models/index.js';
import { sendSuccess, sendNotFound } from '../../utils/response.js';
import { createSlug } from '../../utils/slug.js';
import { recordAuditLog } from '../../middlewares/audit.middleware.js';

export async function getAdminPartners(req, res, next) {
  try {
    const partners = await PartnerLaboratory.findAll({
      order: [['name', 'ASC']],
    });
    return sendSuccess(res, partners);
  } catch (error) {
    return next(error);
  }
}

export async function createAdminPartner(req, res, next) {
  try {
    const { name, city, state, accreditation, isAccreditationVerified, isPublished, contactPhone, contactEmail } = req.body;

    let baseSlug = createSlug(name);
    let slug = baseSlug;
    let count = 1;
    while (await PartnerLaboratory.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const partner = await PartnerLaboratory.create({
      name,
      slug,
      city,
      state,
      accreditation,
      isAccreditationVerified: isAccreditationVerified || false,
      isPublished: isPublished || false,
      contactPhone,
      contactEmail,
    });

    await recordAuditLog({
      action: 'partner.create',
      entityType: 'PartnerLaboratory',
      entityId: partner.id,
      details: { name: partner.name, city: partner.city },
      req,
    });

    return sendSuccess(res, partner, 'Partner laboratory added successfully', 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminPartner(req, res, next) {
  try {
    const { id } = req.params;
    const partner = await PartnerLaboratory.findByPk(id);
    if (!partner) {
      return sendNotFound(res, 'Partner laboratory not found');
    }

    const { name, city, state, accreditation, isAccreditationVerified, isPublished, contactPhone, contactEmail } = req.body;

    if (name !== undefined) partner.name = name;
    if (city !== undefined) partner.city = city;
    if (state !== undefined) partner.state = state;
    if (accreditation !== undefined) partner.accreditation = accreditation;
    if (isAccreditationVerified !== undefined) partner.isAccreditationVerified = isAccreditationVerified;
    if (isPublished !== undefined) partner.isPublished = isPublished;
    if (contactPhone !== undefined) partner.contactPhone = contactPhone;
    if (contactEmail !== undefined) partner.contactEmail = contactEmail;

    await partner.save();

    await recordAuditLog({
      action: 'partner.update',
      entityType: 'PartnerLaboratory',
      entityId: partner.id,
      details: { name: partner.name },
      req,
    });

    return sendSuccess(res, partner, 'Partner laboratory updated successfully');
  } catch (error) {
    return next(error);
  }
}

export async function deleteAdminPartner(req, res, next) {
  try {
    const { id } = req.params;
    const partner = await PartnerLaboratory.findByPk(id);
    if (!partner) {
      return sendNotFound(res, 'Partner laboratory not found');
    }

    await recordAuditLog({
      action: 'partner.delete',
      entityType: 'PartnerLaboratory',
      entityId: partner.id,
      details: { name: partner.name },
      req,
    });

    await partner.destroy();
    return sendSuccess(res, {}, 'Partner laboratory deleted successfully');
  } catch (error) {
    return next(error);
  }
}
