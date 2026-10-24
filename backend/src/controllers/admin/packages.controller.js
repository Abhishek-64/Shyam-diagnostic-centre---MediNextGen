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
      showPriceOnWebsite: req.body.showPriceOnWebsite ?? true,
      showOriginalPrice: req.body.showOriginalPrice ?? true,
      showFastDuration: req.body.showFastDuration ?? true,
      showReportTime: req.body.showReportTime ?? true,
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
    if (req.body.showPriceOnWebsite !== undefined) pkg.showPriceOnWebsite = Boolean(req.body.showPriceOnWebsite);
    if (req.body.showOriginalPrice !== undefined) pkg.showOriginalPrice = Boolean(req.body.showOriginalPrice);
    if (req.body.showFastDuration !== undefined) pkg.showFastDuration = Boolean(req.body.showFastDuration);
    if (req.body.showReportTime !== undefined) pkg.showReportTime = Boolean(req.body.showReportTime);

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

export async function bulkImportPackagesFromCsv(req, res, next) {
  try {
    const { rows, csvText } = req.body;
    let dataRows = Array.isArray(rows) ? rows : [];
    if (dataRows.length === 0 && csvText) {
      const { parseCsvString } = await import('../../utils/csv.js');
      dataRows = parseCsvString(csvText);
    }

    if (!dataRows || dataRows.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid data rows found in CSV.' });
    }

    let createdCount = 0;
    let updatedCount = 0;
    const errors = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const name = (row.name || row.packageName || row.PackageName || '').trim();
      if (!name) {
        errors.push(`Row ${i + 1}: Package name is required. Skipped.`);
        continue;
      }

      const rawPrice = parseFloat(row.priceRupees || row.price || '0');
      const priceInPaise = isNaN(rawPrice) ? 0 : Math.round(rawPrice * 100);

      const rawOriginalPrice = parseFloat(row.originalPriceRupees || row.mrp || row.originalPrice || '0');
      const originalPriceInPaise = isNaN(rawOriginalPrice) || rawOriginalPrice <= 0 ? null : Math.round(rawOriginalPrice * 100);

      const parametersCovered = parseInt(row.parametersCovered || row.testsCount || '0', 10) || 0;
      const subtitle = (row.subtitle || '').trim();
      const description = (row.description || '').trim();
      const fastDuration = row.fastDuration || '10-12 hours fasting required';
      const reportTime = row.reportTime || 'Same Day / 24 Hours';

      const isPopular = String(row.isPopular).toLowerCase() === 'true';
      const isFeatured = String(row.isFeatured).toLowerCase() === 'true';
      const hasOfferBadge = String(row.hasOfferBadge).toLowerCase() === 'true';
      const isHomeCollectionAvailable = row.isHomeCollectionAvailable === undefined || String(row.isHomeCollectionAvailable).toLowerCase() !== 'false';
      const priceVerified = row.priceVerified === undefined || String(row.priceVerified).toLowerCase() !== 'false';
      const isPublished = row.isPublished === undefined || String(row.isPublished).toLowerCase() !== 'false';

      const showPriceOnWebsite = row.showPriceOnWebsite === undefined || String(row.showPriceOnWebsite).toLowerCase() !== 'false';
      const showOriginalPrice = row.showOriginalPrice === undefined || String(row.showOriginalPrice).toLowerCase() !== 'false';
      const showFastDuration = row.showFastDuration === undefined || String(row.showFastDuration).toLowerCase() !== 'false';
      const showReportTime = row.showReportTime === undefined || String(row.showReportTime).toLowerCase() !== 'false';

      const existing = await Package.findOne({ where: { name } });

      if (existing) {
        existing.subtitle = subtitle || existing.subtitle;
        existing.description = description || existing.description;
        existing.parametersCovered = parametersCovered || existing.parametersCovered;
        existing.fastDuration = fastDuration;
        existing.reportTime = reportTime;
        existing.priceInPaise = priceInPaise;
        existing.originalPriceInPaise = originalPriceInPaise;
        existing.isPopular = isPopular;
        existing.isFeatured = isFeatured;
        existing.hasOfferBadge = hasOfferBadge;
        existing.isHomeCollectionAvailable = isHomeCollectionAvailable;
        existing.priceVerified = priceVerified;
        existing.isPublished = isPublished;
        existing.showPriceOnWebsite = showPriceOnWebsite;
        existing.showOriginalPrice = showOriginalPrice;
        existing.showFastDuration = showFastDuration;
        existing.showReportTime = showReportTime;
        await existing.save();
        updatedCount++;
      } else {
        let baseSlug = createSlug(name);
        let slug = baseSlug;
        let count = 1;
        while (await Package.findOne({ where: { slug } })) {
          slug = `${baseSlug}-${count++}`;
        }

        await Package.create({
          name,
          slug,
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
          displayOrder: createdCount + 1,
          showPriceOnWebsite,
          showOriginalPrice,
          showFastDuration,
          showReportTime,
        });
        createdCount++;
      }
    }

    await recordAuditLog({
      action: 'packages.bulk_csv_import',
      entityType: 'Package',
      entityId: 0,
      details: { createdCount, updatedCount, totalProcessed: dataRows.length },
      req,
    });

    return sendSuccess(res, {
      total: dataRows.length,
      created: createdCount,
      updated: updatedCount,
      errors,
    }, `Bulk CSV import completed: ${createdCount} created, ${updatedCount} updated.`);
  } catch (error) {
    return next(error);
  }
}

export async function getSamplePackagesCsv(req, res) {
  const sampleCsv = `name,subtitle,priceRupees,originalPriceRupees,parametersCovered,fastDuration,reportTime,isPopular,isFeatured,hasOfferBadge,showPriceOnWebsite,isPublished
"Shyam Full Body Advanced Profile","Comprehensive Vital Organ Health Screening with 92 Tests",1499,3500,92,"10-12 hours fasting required","Same Day / 24 Hours",true,true,true,true,true
"Vitamin Gold Health Checkup","Essential Vitamin D3 & B12 Screening with CBC",999,2200,45,"No fasting required","Same Day (6 to 8 Hours)",true,false,false,true,true
"Healthy Hearty NCR-Delhi Profile","Lipid Profile, Cardiac Risk Markers & Blood Glucose",2200,4500,68,"12 hours overnight fasting mandatory","Same Day / 24 Hours",false,true,true,true,true
"Executive Diabetic Wellness Package","Complete Diabetes Monitoring (HbA1c, Fasting, Post-Meal, Microalbumin)",850,1800,32,"Fasting sample required","Same Day (4 Hours)",true,false,false,true,true`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="sample_health_packages.csv"');
  return res.status(200).send(sampleCsv);
}

