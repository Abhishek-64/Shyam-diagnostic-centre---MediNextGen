import { Op } from 'sequelize';
import { Enquiry, Package, Test, Offer, AdminUser } from '../../database/models/index.js';
import { sendSuccess } from '../../utils/response.js';

export async function getDashboardStats(req, res, next) {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalEnquiries,
      newEnquiriesToday,
      pendingEnquiries,
      totalPackages,
      verifiedPackages,
      publishedPackages,
      totalTests,
    ] = await Promise.all([
      Enquiry.count(),
      Enquiry.count({ where: { createdAt: { [Op.gte]: todayStart } } }),
      Enquiry.count({ where: { status: 'new' } }),
      Package.count(),
      Package.count({ where: { priceVerified: true } }),
      Package.count({ where: { isPublished: true } }),
      Test.count(),
    ]);

    const activeOffers = 0;

    // Recent 5 enquiries
    const recentEnquiries = await Enquiry.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'referenceNumber', 'fullName', 'phone', 'pinCode', 'enquiryType', 'status', 'createdAt'],
    });

    return sendSuccess(res, {
      stats: {
        totalEnquiries,
        newEnquiriesToday,
        pendingEnquiries,
        totalPackages,
        verifiedPackages,
        publishedPackages,
        totalTests,
        activeOffers,
      },
      recentEnquiries,
    });
  } catch (error) {
    return next(error);
  }
}
