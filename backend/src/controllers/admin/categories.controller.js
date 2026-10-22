import { Op } from 'sequelize';
import { Category, Test } from '../../database/models/index.js';
import { sendSuccess, sendNotFound } from '../../utils/response.js';
import { createSlug } from '../../utils/slug.js';
import { recordAuditLog } from '../../middlewares/audit.middleware.js';

export async function getAdminCategories(req, res, next) {
  try {
    const categories = await Category.findAll({
      order: [
        ['displayOrder', 'ASC'],
        ['name', 'ASC'],
      ],
      include: [
        {
          model: Test,
          as: 'tests',
          attributes: ['id'],
        },
      ],
    });

    const result = categories.map((cat) => {
      const json = cat.toJSON();
      const testCount = json.tests ? json.tests.length : 0;
      delete json.tests;
      return { ...json, testCount };
    });

    return sendSuccess(res, result);
  } catch (error) {
    return next(error);
  }
}

export async function createAdminCategory(req, res, next) {
  try {
    const { name, description, iconName, displayOrder, isPublished } = req.body;
    let baseSlug = createSlug(name);
    let slug = baseSlug;
    let count = 1;
    while (await Category.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const category = await Category.create({
      name,
      slug,
      description,
      iconName,
      displayOrder: displayOrder || 0,
      isPublished: isPublished ?? true,
    });

    await recordAuditLog({
      action: 'category.create',
      entityType: 'Category',
      entityId: category.id,
      details: { name: category.name },
      req,
    });

    return sendSuccess(res, category, 'Category created successfully', 201);
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminCategory(req, res, next) {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return sendNotFound(res, 'Category not found');
    }

    const { name, description, iconName, displayOrder, isPublished } = req.body;
    if (name && name !== category.name) {
      let baseSlug = createSlug(name);
      let slug = baseSlug;
      let count = 1;
      while (await Category.findOne({ where: { slug, id: { [Op.ne]: id } } })) {
        slug = `${baseSlug}-${count++}`;
      }
      category.slug = slug;
      category.name = name;
    }

    if (description !== undefined) category.description = description;
    if (iconName !== undefined) category.iconName = iconName;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;
    if (isPublished !== undefined) category.isPublished = isPublished;

    await category.save();

    await recordAuditLog({
      action: 'category.update',
      entityType: 'Category',
      entityId: category.id,
      details: { name: category.name },
      req,
    });

    return sendSuccess(res, category, 'Category updated successfully');
  } catch (error) {
    return next(error);
  }
}

export async function deleteAdminCategory(req, res, next) {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return sendNotFound(res, 'Category not found');
    }

    await recordAuditLog({
      action: 'category.delete',
      entityType: 'Category',
      entityId: category.id,
      details: { name: category.name },
      req,
    });

    await category.destroy();
    return sendSuccess(res, {}, 'Category deleted successfully');
  } catch (error) {
    return next(error);
  }
}
