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
