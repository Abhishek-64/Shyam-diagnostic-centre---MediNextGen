import crypto from 'crypto';
import { Op, fn, col, literal } from 'sequelize';
import models from '../database/models/index.js';

const { PageView } = models;

function parseUserAgent(ua = '') {
  ua = ua.toLowerCase();
  let deviceType = 'Desktop';
  if (/mobile|iphone|ipod|android.*mobile|blackberry|phone/i.test(ua)) {
    deviceType = 'Mobile';
  } else if (/ipad|tablet|android(?!.*mobile)/i.test(ua)) {
    deviceType = 'Tablet';
  }

  let browser = 'Unknown';
  if (/edg\//i.test(ua)) browser = 'Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';
  else if (/opera|opr\//i.test(ua)) browser = 'Opera';

  let os = 'Unknown';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  return { deviceType, browser, os };
}

function hashIp(ip = '') {
  if (!ip) return null;
  return crypto.createHash('sha256').update(ip + '_sdc_salt').digest('hex').slice(0, 32);
}

/**
 * POST /api/v1/analytics/track
 * Public lightweight endpoint to log a visitor page hit.
 */
export async function trackPageView(req, res, next) {
  try {
    const { visitorId, sessionId, path, referrer } = req.body;
    if (!visitorId || !path) {
      return res.status(400).json({ success: false, message: 'visitorId and path are required' });
    }

    const ua = req.headers['user-agent'] || '';
    const { deviceType, browser, os } = parseUserAgent(ua);
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '';
    const ipHash = hashIp(ip);

    await PageView.create({
      visitorId: String(visitorId).slice(0, 64),
      sessionId: sessionId ? String(sessionId).slice(0, 64) : null,
      path: String(path).slice(0, 255),
      deviceType,
      browser,
      os,
      referrer: referrer ? String(referrer).slice(0, 500) : null,
      ipHash,
    });

    return res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/admin/analytics/overview
 * Protected admin endpoint returning visitor metrics & traffic insights.
 */
export async function getAnalyticsOverview(req, res, next) {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1. Total stats
    const totalViews = await PageView.count();
    const totalUniqueVisitors = await PageView.count({
      distinct: true,
      col: 'visitorId',
    });

    // 2. Today's stats
    const todayViews = await PageView.count({
      where: { createdAt: { [Op.gte]: startOfToday } },
    });
    const todayUniqueVisitors = await PageView.count({
      distinct: true,
      col: 'visitorId',
      where: { createdAt: { [Op.gte]: startOfToday } },
    });

    // 3. Top Visited Pages
    const topPages = await PageView.findAll({
      attributes: ['path', [fn('COUNT', col('id')), 'views']],
      group: ['path'],
      order: [[literal('views'), 'DESC']],
      limit: 8,
      raw: true,
    });

    // 4. Device Distribution
    const deviceBreakdown = await PageView.findAll({
      attributes: ['deviceType', [fn('COUNT', col('id')), 'count']],
      group: ['deviceType'],
      order: [[literal('count'), 'DESC']],
      raw: true,
    });

    // 5. Browser Distribution
    const browserBreakdown = await PageView.findAll({
      attributes: ['browser', [fn('COUNT', col('id')), 'count']],
      group: ['browser'],
      order: [[literal('count'), 'DESC']],
      limit: 5,
      raw: true,
    });

    // 6. Recent 15 Page Views
    const recentActivity = await PageView.findAll({
      order: [['createdAt', 'DESC']],
      limit: 15,
      attributes: ['id', 'visitorId', 'path', 'deviceType', 'browser', 'os', 'referrer', 'createdAt'],
      raw: true,
    });

    // 7. Last 7 Days Daily Breakdown
    const dailyViews = await PageView.findAll({
      attributes: [
        [fn('DATE', col('createdAt')), 'date'],
        [fn('COUNT', col('id')), 'views'],
        [fn('COUNT', fn('DISTINCT', col('visitorId'))), 'uniqueVisitors'],
      ],
      where: {
        createdAt: { [Op.gte]: sevenDaysAgo },
      },
      group: [fn('DATE', col('createdAt'))],
      order: [[fn('DATE', col('createdAt')), 'ASC']],
      raw: true,
    });

    return res.json({
      success: true,
      data: {
        summary: {
          totalViews,
          totalUniqueVisitors,
          todayViews,
          todayUniqueVisitors,
        },
        topPages,
        deviceBreakdown,
        browserBreakdown,
        recentActivity,
        dailyViews,
      },
    });
  } catch (err) {
    next(err);
  }
}
