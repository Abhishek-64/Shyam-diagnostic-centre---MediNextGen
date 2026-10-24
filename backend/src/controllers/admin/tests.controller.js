import { Op } from 'sequelize';
import { Test, Category } from '../../database/models/index.js';
import { sendSuccess, sendNotFound } from '../../utils/response.js';
import { parsePagination, formatPaginatedResponse } from '../../utils/pagination.js';
import { createSlug } from '../../utils/slug.js';
import { recordAuditLog } from '../../middlewares/audit.middleware.js';

export async function getAdminTests(req, res, next) {
  try {
    const { page, limit, offset } = parsePagination(req.query, 20);
    const { search, categoryId, isPublished } = req.query;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } },
      ];
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (isPublished !== undefined && isPublished !== '') {
      where.isPublished = isPublished === 'true';
    }

    const { count, rows } = await Test.findAndCountAll({
      where,
      limit,
      offset,
      order: [
        ['name', 'ASC'],
        ['id', 'DESC'],
      ],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug'],
        },
      ],
    });

    return sendSuccess(res, formatPaginatedResponse(rows, count, page, limit));
  } catch (error) {
    return next(error);
  }
}

export async function getAdminTestById(req, res, next) {
  try {
    const { id } = req.params;
    const test = await Test.findByPk(id, {
      include: [{ model: Category, as: 'category' }],
    });
    if (!test) {
      return sendNotFound(res, 'Test not found');
    }
    return sendSuccess(res, test);
  } catch (error) {
    return next(error);
  }
}

export async function createAdminTest(req, res, next) {
  try {
    const {
      name,
      categoryId,
      code,
      shortDescription,
      description,
      preparationInstructions,
      sampleType,
      reportingTime,
      priceInPaise,
      discountPriceInPaise,
      isPopular,
      isHomeCollectionAvailable,
      isPublished,
    } = req.body;

    let baseSlug = createSlug(name);
    let slug = baseSlug;
    let count = 1;
    while (await Test.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const test = await Test.create({
      name,
      slug,
      categoryId: categoryId || null,
      code,
      shortDescription,
      description,
      preparationInstructions,
      sampleType,
      reportingTime,
      priceInPaise: priceInPaise || 0,
      discountPriceInPaise,
      isPopular: isPopular || false,
      hasOfferBadge: hasOfferBadge || false,
      isHomeCollectionAvailable: isHomeCollectionAvailable ?? true,
      isPublished: isPublished ?? false,
      showPriceOnWebsite: req.body.showPriceOnWebsite ?? true,
      showSampleType: req.body.showSampleType ?? true,
      showReportingTime: req.body.showReportingTime ?? true,
      showPreparationInstructions: req.body.showPreparationInstructions ?? true,
    });

    await recordAuditLog({
      action: 'test.create',
      entityType: 'Test',
      entityId: test.id,
      details: { name: test.name, code: test.code },
      req,
    });

    return sendSuccess(res, test, 'Test created successfully', 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminTest(req, res, next) {
  try {
    const { id } = req.params;
    const test = await Test.findByPk(id);
    if (!test) {
      return sendNotFound(res, 'Test not found');
    }

    const {
      name,
      categoryId,
      code,
      shortDescription,
      description,
      preparationInstructions,
      sampleType,
      reportingTime,
      priceInPaise,
      discountPriceInPaise,
      isPopular,
      hasOfferBadge,
      isHomeCollectionAvailable,
      isPublished,
    } = req.body;

    if (name && name !== test.name) {
      let baseSlug = createSlug(name);
      let slug = baseSlug;
      let count = 1;
      while (await Test.findOne({ where: { slug, id: { [Op.ne]: id } } })) {
        slug = `${baseSlug}-${count++}`;
      }
      test.slug = slug;
      test.name = name;
    }

    if (categoryId !== undefined) test.categoryId = categoryId || null;
    if (code !== undefined) test.code = code;
    if (shortDescription !== undefined) test.shortDescription = shortDescription;
    if (description !== undefined) test.description = description;
    if (preparationInstructions !== undefined) test.preparationInstructions = preparationInstructions;
    if (sampleType !== undefined) test.sampleType = sampleType;
    if (reportingTime !== undefined) test.reportingTime = reportingTime;
    if (priceInPaise !== undefined) test.priceInPaise = priceInPaise;
    if (discountPriceInPaise !== undefined) test.discountPriceInPaise = discountPriceInPaise;
    if (isPopular !== undefined) test.isPopular = isPopular;
    if (hasOfferBadge !== undefined) test.hasOfferBadge = hasOfferBadge;
    if (isHomeCollectionAvailable !== undefined) test.isHomeCollectionAvailable = isHomeCollectionAvailable;
    if (isPublished !== undefined) test.isPublished = isPublished;
    if (req.body.showPriceOnWebsite !== undefined) test.showPriceOnWebsite = Boolean(req.body.showPriceOnWebsite);
    if (req.body.showSampleType !== undefined) test.showSampleType = Boolean(req.body.showSampleType);
    if (req.body.showReportingTime !== undefined) test.showReportingTime = Boolean(req.body.showReportingTime);
    if (req.body.showPreparationInstructions !== undefined) test.showPreparationInstructions = Boolean(req.body.showPreparationInstructions);

    await test.save();

    await recordAuditLog({
      action: 'test.update',
      entityType: 'Test',
      entityId: test.id,
      details: { name: test.name },
      req,
    });

    return sendSuccess(res, test, 'Test updated successfully');
  } catch (error) {
    return next(error);
  }
}

export async function deleteAdminTest(req, res, next) {
  try {
    const { id } = req.params;
    const test = await Test.findByPk(id);
    if (!test) {
      return sendNotFound(res, 'Test not found');
    }

    await recordAuditLog({
      action: 'test.delete',
      entityType: 'Test',
      entityId: test.id,
      details: { name: test.name },
      req,
    });

    await test.destroy();
    return sendSuccess(res, {}, 'Test deleted successfully');
  } catch (error) {
    return next(error);
  }
}

export async function bulkImportTestsFromCsv(req, res, next) {
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

    // Preload categories
    const allCategories = await Category.findAll();
    const categoryMap = new Map();
    allCategories.forEach((c) => {
      categoryMap.set(c.name.toLowerCase().trim(), c.id);
    });

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const name = (row.name || row.testName || row.TestName || '').trim();
      if (!name) {
        errors.push(`Row ${i + 1}: Name is required. Skipped.`);
        continue;
      }

      const code = (row.code || row.testCode || row.Code || '').trim();

      // Resolve category
      let categoryId = null;
      const catName = (row.category || row.categoryName || row.Category || '').trim();
      if (catName) {
        const lowerCat = catName.toLowerCase();
        if (categoryMap.has(lowerCat)) {
          categoryId = categoryMap.get(lowerCat);
        } else {
          // Auto create category
          const newCat = await Category.create({
            name: catName,
            slug: createSlug(catName),
            description: `Laboratory category for ${catName}`,
            isPublished: true,
          });
          categoryId = newCat.id;
          categoryMap.set(lowerCat, newCat.id);
        }
      }

      // Convert prices from Rupees to paise
      const rawPrice = parseFloat(row.priceRupees || row.price || row.fee || '0');
      const priceInPaise = isNaN(rawPrice) ? 0 : Math.round(rawPrice * 100);

      const rawDiscountPrice = parseFloat(row.discountPriceRupees || row.mrp || row.originalPrice || '0');
      const discountPriceInPaise = isNaN(rawDiscountPrice) || rawDiscountPrice <= 0 ? null : Math.round(rawDiscountPrice * 100);

      const isPopular = String(row.isPopular).toLowerCase() === 'true';
      const hasOfferBadge = String(row.hasOfferBadge).toLowerCase() === 'true';
      const isHomeCollectionAvailable = row.isHomeCollectionAvailable === undefined || String(row.isHomeCollectionAvailable).toLowerCase() !== 'false';
      const isPublished = row.isPublished === undefined || String(row.isPublished).toLowerCase() !== 'false';

      const showPriceOnWebsite = row.showPriceOnWebsite === undefined || String(row.showPriceOnWebsite).toLowerCase() !== 'false';
      const showSampleType = row.showSampleType === undefined || String(row.showSampleType).toLowerCase() !== 'false';
      const showReportingTime = row.showReportingTime === undefined || String(row.showReportingTime).toLowerCase() !== 'false';
      const showPreparationInstructions = row.showPreparationInstructions === undefined || String(row.showPreparationInstructions).toLowerCase() !== 'false';

      // Find existing test by code or name
      const whereClause = code ? { [Op.or]: [{ code }, { name }] } : { name };
      const existing = await Test.findOne({ where: whereClause });

      if (existing) {
        existing.name = name;
        if (code) existing.code = code;
        if (categoryId) existing.categoryId = categoryId;
        existing.priceInPaise = priceInPaise;
        existing.discountPriceInPaise = discountPriceInPaise;
        if (row.sampleType) existing.sampleType = row.sampleType;
        if (row.reportingTime) existing.reportingTime = row.reportingTime;
        if (row.preparationInstructions) existing.preparationInstructions = row.preparationInstructions;
        if (row.shortDescription) existing.shortDescription = row.shortDescription;
        if (row.description) existing.description = row.description;
        existing.isPopular = isPopular;
        existing.hasOfferBadge = hasOfferBadge;
        existing.isHomeCollectionAvailable = isHomeCollectionAvailable;
        existing.isPublished = isPublished;
        existing.showPriceOnWebsite = showPriceOnWebsite;
        existing.showSampleType = showSampleType;
        existing.showReportingTime = showReportingTime;
        existing.showPreparationInstructions = showPreparationInstructions;
        await existing.save();
        updatedCount++;
      } else {
        let baseSlug = createSlug(name);
        let slug = baseSlug;
        let count = 1;
        while (await Test.findOne({ where: { slug } })) {
          slug = `${baseSlug}-${count++}`;
        }

        await Test.create({
          name,
          slug,
          code,
          categoryId,
          priceInPaise,
          discountPriceInPaise,
          sampleType: row.sampleType || 'Whole Blood (EDTA)',
          reportingTime: row.reportingTime || 'Same Day / 24 Hours',
          preparationInstructions: row.preparationInstructions || 'No special fasting required unless advised',
          shortDescription: row.shortDescription || '',
          description: row.description || '',
          isPopular,
          hasOfferBadge,
          isHomeCollectionAvailable,
          isPublished,
          showPriceOnWebsite,
          showSampleType,
          showReportingTime,
          showPreparationInstructions,
        });
        createdCount++;
      }
    }

    await recordAuditLog({
      action: 'tests.bulk_csv_import',
      entityType: 'Test',
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

export async function getSampleTestsCsv(req, res) {
  const sampleCsv = `name,code,category,priceRupees,discountPriceRupees,sampleType,reportingTime,preparationInstructions,isPopular,hasOfferBadge,showPriceOnWebsite,isPublished
"Complete Blood Count (CBC) with ESR","CBC-01","Pathology & Hematology",350,500,"Whole Blood (EDTA)","Same Day (4 to 6 Hours)","No special fasting required",true,false,true,true
"Lipid Profile Comprehensive","LIPID-01","Biochemistry",650,900,"Serum","Same Day (6 to 8 Hours)","10-12 hours overnight fasting mandatory",true,true,true,true
"Thyroid Profile (T3, T4, TSH)","THY-01","Endocrinology",450,700,"Serum","Same Day / 24 Hours","Morning fasting sample preferred",false,false,true,true
"Liver Function Test (LFT)","LFT-01","Biochemistry",550,850,"Serum","Same Day (6 to 8 Hours)","Overnight fasting required",true,false,true,true
"Glycated Hemoglobin (HbA1c)","HBA1C-01","Diabetes Care",400,600,"Whole Blood (EDTA)","Same Day (4 Hours)","Fasting not mandatory",true,false,true,true`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="sample_diagnostic_tests.csv"');
  return res.status(200).send(sampleCsv);
}

