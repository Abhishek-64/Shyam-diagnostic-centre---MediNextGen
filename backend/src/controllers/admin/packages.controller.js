import { Op } from 'sequelize';
import { Package, Test, PackageTest } from '../../database/models/index.js';
import { sendSuccess, sendNotFound, sendValidationError } from '../../utils/response.js';
import { parsePagination, formatPaginatedResponse } from '../../utils/pagination.js';
import { createSlug } from '../../utils/slug.js';
import { recordAuditLog } from '../../middlewares/audit.middleware.js';

export async function getAdminPackages(req, res, next) {
  try {
    const { page, limit, offset } = parsePagination(req.query, 20);
    const { search, status } = req.query;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { subtitle: { [Op.like]: `%${search}%` } },
      ];
    }
    if (status === 'published') {
      where.isPublished = true;
    } else if (status === 'draft') {
      where.isPublished = false;
    } else if (status === 'unverified') {
      where.priceVerified = false;
    }

    const { count, rows } = await Package.findAndCountAll({
      where,
      limit,
      offset,
      order: [
        ['displayOrder', 'ASC'],
        ['id', 'DESC'],
      ],
      include: [
        {
          model: Test,
          as: 'tests',
          attributes: ['id', 'name', 'code'],
          through: { attributes: [] },
        },
      ],
      distinct: true,
    });

    return sendSuccess(res, formatPaginatedResponse(rows, count, page, limit));
  } catch (error) {
    return next(error);
  }
}

export async function getAdminPackageById(req, res, next) {
  try {
    const { id } = req.params;
    const pkg = await Package.findByPk(id, {
      include: [
        {
          model: Test,
          as: 'tests',
          through: { attributes: ['displayOrder'] },
        },
      ],
    });

    if (!pkg) {
      return sendNotFound(res, 'Package not found');
    }

    return sendSuccess(res, pkg);
  } catch (error) {
    return next(error);
  }
}

export async function createAdminPackage(req, res, next) {
  try {
    const {
      name,
      subtitle,
      description,
      parametersCovered,
      fastDuration,
      reportTime,
      priceInPaise,
      originalPriceInPaise,
      isPopular,
      isFeatured,
      isHomeCollectionAvailable,
      priceVerified,
      isPublished,
      displayOrder,
      testIds,
    } = req.body;

    let baseSlug = createSlug(name);
    let slug = baseSlug;
    let count = 1;
    while (await Package.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    // Enforce publication rule
    const finalPublished = isPublished && priceVerified;

    const pkg = await Package.create({
      name,
      slug,
      subtitle,
      description,
      parametersCovered: parametersCovered || 0,
      fastDuration,
      reportTime,
      priceInPaise,
      originalPriceInPaise,
      isPopular: isPopular || false,
      isFeatured: isFeatured || false,
      hasOfferBadge: hasOfferBadge || false,
      isHomeCollectionAvailable: isHomeCollectionAvailable ?? true,
      priceVerified: priceVerified || false,
      isPublished: finalPublished || false,
      displayOrder: displayOrder || 0,
    });

    if (Array.isArray(testIds) && testIds.length > 0) {
      const junctionData = testIds.map((testId, index) => ({
        packageId: pkg.id,
        testId,
        displayOrder: index,
      }));
      await PackageTest.bulkCreate(junctionData, { ignoreDuplicates: true });
    }

    await recordAuditLog({
      action: 'package.create',
      entityType: 'Package',
      entityId: pkg.id,
      details: { name: pkg.name, slug: pkg.slug, priceInPaise: pkg.priceInPaise },
      req,
    });

    return sendSuccess(res, pkg, 'Package created successfully', 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminPackage(req, res, next) {
  try {
    const { id } = req.params;
    const pkg = await Package.findByPk(id);
    if (!pkg) {
      return sendNotFound(res, 'Package not found');
    }

    const {
      name,
      subtitle,
      description,
      parametersCovered,
      fastDuration,
      reportTime,
      priceInPaise,
      originalPriceInPaise,
      isPopular,
      isFeatured,
      hasOfferBadge,
      isHomeCollectionAvailable,
      priceVerified,
      isPublished,
      displayOrder,
      testIds,
    } = req.body;

    // Enforce verify before publish
    const currentPriceVerified = priceVerified ?? pkg.priceVerified;
    if (isPublished && !currentPriceVerified) {
      return sendValidationError(res, [
        { field: 'isPublished', message: 'Package cannot be published until prices and tests are verified.' },
      ]);
    }

    if (name && name !== pkg.name) {
      let baseSlug = createSlug(name);
      let slug = baseSlug;
      let count = 1;
      while (await Package.findOne({ where: { slug, id: { [Op.ne]: id } } })) {
        slug = `${baseSlug}-${count++}`;
      }
      pkg.slug = slug;
      pkg.name = name;
    }

    if (subtitle !== undefined) pkg.subtitle = subtitle;
    if (description !== undefined) pkg.description = description;
    if (parametersCovered !== undefined) pkg.parametersCovered = parametersCovered;
    if (fastDuration !== undefined) pkg.fastDuration = fastDuration;
    if (reportTime !== undefined) pkg.reportTime = reportTime;
    if (priceInPaise !== undefined) pkg.priceInPaise = priceInPaise;
    if (originalPriceInPaise !== undefined) pkg.originalPriceInPaise = originalPriceInPaise;
    if (isPopular !== undefined) pkg.isPopular = isPopular;
    if (isFeatured !== undefined) pkg.isFeatured = isFeatured;
    if (hasOfferBadge !== undefined) pkg.hasOfferBadge = hasOfferBadge;
    if (isHomeCollectionAvailable !== undefined) pkg.isHomeCollectionAvailable = isHomeCollectionAvailable;
    if (priceVerified !== undefined) pkg.priceVerified = priceVerified;
    if (isPublished !== undefined) pkg.isPublished = isPublished;
    if (displayOrder !== undefined) pkg.displayOrder = displayOrder;

    await pkg.save();

    if (Array.isArray(testIds)) {
      await PackageTest.destroy({ where: { packageId: pkg.id } });
      if (testIds.length > 0) {
        const junctionData = testIds.map((testId, index) => ({
          packageId: pkg.id,
          testId,
          displayOrder: index,
        }));
        await PackageTest.bulkCreate(junctionData, { ignoreDuplicates: true });
      }
    }

    await recordAuditLog({
      action: 'package.update',
      entityType: 'Package',
      entityId: pkg.id,
      details: { name: pkg.name, priceVerified: pkg.priceVerified, isPublished: pkg.isPublished },
      req,
    });

    return sendSuccess(res, pkg, 'Package updated successfully');
  } catch (error) {
    return next(error);
  }
}

export async function verifyAdminPackage(req, res, next) {
  try {
    const { id } = req.params;
    const pkg = await Package.findByPk(id);
    if (!pkg) {
      return sendNotFound(res, 'Package not found');
    }

    pkg.priceVerified = true;
    await pkg.save();

    await recordAuditLog({
      action: 'package.verify',
      entityType: 'Package',
      entityId: pkg.id,
      details: { name: pkg.name },
      req,
    });

    return sendSuccess(res, pkg, 'Package verified successfully. It can now be published.');
  } catch (error) {
    return next(error);
  }
}

export async function publishAdminPackage(req, res, next) {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;
    const pkg = await Package.findByPk(id);
    if (!pkg) {
      return sendNotFound(res, 'Package not found');
    }

    if (isPublished && !pkg.priceVerified) {
      return sendValidationError(res, [
        { field: 'isPublished', message: 'Cannot publish an unverified package. Verify package prices and tests first.' },
      ]);
    }

    pkg.isPublished = isPublished;
    await pkg.save();

    await recordAuditLog({
      action: isPublished ? 'package.publish' : 'package.unpublish',
      entityType: 'Package',
      entityId: pkg.id,
      details: { name: pkg.name, isPublished },
      req,
    });

    return sendSuccess(res, pkg, `Package ${isPublished ? 'published' : 'unpublished'} successfully`);
  } catch (error) {
    return next(error);
  }
}

export async function deleteAdminPackage(req, res, next) {
  try {
    const { id } = req.params;
    const pkg = await Package.findByPk(id);
    if (!pkg) {
      return sendNotFound(res, 'Package not found');
    }

    await recordAuditLog({
      action: 'package.delete',
      entityType: 'Package',
      entityId: pkg.id,
      details: { name: pkg.name },
      req,
    });

    await PackageTest.destroy({ where: { packageId: pkg.id } });
    await pkg.destroy();

    return sendSuccess(res, {}, 'Package deleted successfully');
  } catch (error) {
    return next(error);
  }
}
