import { Category, Test } from '../../database/models/index.js';
import { sendSuccess, sendNotFound } from '../../utils/response.js';

export async function getPublicCategories(req, res, next) {
  try {
    const categories = await Category.findAll({
      where: { isPublished: true },
      order: [
        ['displayOrder', 'ASC'],
        ['name', 'ASC'],
      ],
      include: [
        {
          model: Test,
          as: 'tests',
          where: { isPublished: true },
          attributes: ['id'],
          required: false,
        },
      ],
    });

    // Format with test counts
    const result = categories.map((cat) => {
      const json = cat.toJSON();
      const testCount = json.tests ? json.tests.length : 0;
      delete json.tests;
      return {
        ...json,
        testCount,
      };
    });

    return sendSuccess(res, result);
  } catch (error) {
    return next(error);
  }
}

export async function getPublicCategoryBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({
      where: { slug, isPublished: true },
      include: [
        {
          model: Test,
          as: 'tests',
          where: { isPublished: true },
          required: false,
        },
      ],
    });

    if (!category) {
      return sendNotFound(res, 'Category not found');
    }

    return sendSuccess(res, category);
  } catch (error) {
    return next(error);
  }
}
