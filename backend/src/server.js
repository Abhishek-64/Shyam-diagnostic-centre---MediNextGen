/**
 * server.js — HTTP server startup and graceful shutdown.
 *
 * Responsibilities:
 * 1. Load and validate environment configuration.
 * 2. Connect to the database.
 * 3. Start the HTTP server only after successful initialisation.
 * 4. Handle graceful shutdown (SIGTERM, SIGINT).
 * 5. Handle uncaught exceptions and unhandled rejections.
 */

import 'dotenv/config';
import { env } from './config/env.js';
import logger from './utils/logger.js';
import { connectDatabase, closeDatabase } from './config/database.js';
import app from './app.js';

const SHUTDOWN_TIMEOUT_MS = 10_000; // 10 seconds for in-flight requests to finish

let server;

async function start() {
  try {
    // Verify database connectivity before accepting traffic
    logger.info('Connecting to database…');
    try {
      await connectDatabase();
      logger.info('Database connection established.');
    } catch (dbErr) {
      if (env.isDev) {
        logger.warn(
          { err: dbErr.message },
          '⚠️ MySQL is not reachable at startup. Please start the MySQL80 Windows service (Win+R -> services.msc -> MySQL80 -> Start). Server is running in dev mode.'
        );
      } else {
        throw dbErr;
      }
    }

    // Start HTTP server
    server = app.listen(env.PORT, () => {
      logger.info(
        {
          port: env.PORT,
          env: env.NODE_ENV,
          origins: env.CLIENT_ORIGINS,
        },
        `Server listening on port ${env.PORT}`
      );
    });

    server.on('error', (err) => {
      logger.fatal({ err: err.message }, 'HTTP server error');
      process.exit(1);
    });
  } catch (err) {
    logger.fatal({ err: err.message }, 'Failed to start server');
    process.exit(1);
  }

}

async function shutdown(signal) {
  logger.info({ signal }, 'Shutdown signal received. Shutting down gracefully…');

  const timer = setTimeout(() => {
    logger.warn('Graceful shutdown timed out. Forcing exit.');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  try {
    // Stop accepting new connections
    if (server) {
      await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
      logger.info('HTTP server closed.');
    }

    // Close database connections
    await closeDatabase();
    logger.info('Database connections closed.');

    clearTimeout(timer);
    process.exit(0);
  } catch (err) {
    logger.error({ err: err.message }, 'Error during shutdown');
    clearTimeout(timer);
    process.exit(1);
  }
}

// Graceful shutdown on SIGTERM (hosting platforms) and SIGINT (Ctrl+C)
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Guard against unhandled rejections and uncaught exceptions
process.on('unhandledRejection', (reason) => {
  logger.fatal({ reason: String(reason) }, 'Unhandled promise rejection');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err: err.message, stack: err.stack }, 'Uncaught exception');
  process.exit(1);
});

start();
