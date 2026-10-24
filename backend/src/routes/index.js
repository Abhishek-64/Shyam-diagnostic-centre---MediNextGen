import { Router } from 'express';

// Public routes
import healthRoutes from './health.routes.js';
import publicPackagesRoutes from './public/packages.routes.js';
import publicTestsRoutes from './public/tests.routes.js';
import publicCategoriesRoutes from './public/categories.routes.js';
import publicOffersRoutes from './public/offers.routes.js';
import publicServiceAreasRoutes from './public/serviceAreas.routes.js';
import publicEnquiriesRoutes from './public/enquiries.routes.js';
import publicSettingsRoutes from './public/settings.routes.js';
import publicAnalyticsRoutes from './public/analytics.routes.js';
import exampleRoutes from './examples.routes.js';

// Admin routes
import adminAuthRoutes from './admin/auth.routes.js';
import adminDashboardRoutes from './admin/dashboard.routes.js';
import adminPackagesRoutes from './admin/packages.routes.js';
import adminTestsRoutes from './admin/tests.routes.js';
import adminCategoriesRoutes from './admin/categories.routes.js';
import adminOffersRoutes from './admin/offers.routes.js';
import adminServiceAreasRoutes from './admin/serviceAreas.routes.js';
import adminPartnersRoutes from './admin/partners.routes.js';
import adminEnquiriesRoutes from './admin/enquiries.routes.js';
import adminSettingsRoutes from './admin/settings.routes.js';
import adminAuditLogsRoutes from './admin/auditLogs.routes.js';
import adminAnalyticsRoutes from './admin/analytics.routes.js';

const router = Router();

// Health check
router.use('/health', healthRoutes);

// Public API
router.use('/packages', publicPackagesRoutes);
router.use('/tests', publicTestsRoutes);
router.use('/categories', publicCategoriesRoutes);
router.use('/offers', publicOffersRoutes);
router.use('/service-areas', publicServiceAreasRoutes);
router.use('/enquiries', publicEnquiriesRoutes);
router.use('/site-settings', publicSettingsRoutes);
router.use('/settings', publicSettingsRoutes);
router.use('/analytics', publicAnalyticsRoutes);
router.use('/examples', exampleRoutes);

// Admin API
router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/dashboard', adminDashboardRoutes);
router.use('/admin/packages', adminPackagesRoutes);
router.use('/admin/tests', adminTestsRoutes);
router.use('/admin/categories', adminCategoriesRoutes);
router.use('/admin/offers', adminOffersRoutes);
router.use('/admin/service-areas', adminServiceAreasRoutes);
router.use('/admin/partners', adminPartnersRoutes);
router.use('/admin/enquiries', adminEnquiriesRoutes);
router.use('/admin/settings', adminSettingsRoutes);
router.use('/admin/audit-logs', adminAuditLogsRoutes);
router.use('/admin/analytics', adminAnalyticsRoutes);

export default router;
