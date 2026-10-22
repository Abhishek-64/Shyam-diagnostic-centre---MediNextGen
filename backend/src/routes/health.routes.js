import { Router } from 'express';
import { sendSuccess, sendError } from '../utils/response.js';
import sequelize from '../config/database.js';

const router = Router();

/**
 * GET /api/v1/health
 * Basic liveness — reports that the application process is running.
 */
router.get('/', (_req, res) => {
  sendSuccess(
    res,
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
    },
    'Application is running.'
  );
});

/**
 * GET /api/v1/health/ready
 * Readiness — verifies the database is reachable.
 * Does NOT expose connection strings, credentials, or SQL.
 */
router.get('/ready', async (_req, res) => {
  try {
    // Use a lightweight query that doesn't lock tables
    await sequelize.authenticate();
    sendSuccess(
      res,
      {
        status: 'ready',
        database: 'connected',
        timestamp: new Date().toISOString(),
      },
      'Application is ready to serve traffic.'
    );
  } catch {
    // Never expose DB host, credentials, or error detail in the response
    sendError(
      res,
      'Database is not reachable. The application is not ready.',
      [],
      503
    );
  }
});

export default router;
