/**
 * database.js — Sequelize instance.
 *
 * One shared Sequelize instance for the entire application.
 * Never instantiate Sequelize elsewhere.
 */

import { Sequelize } from 'sequelize';
import { env } from './env.js';

const dialectOptions = {};

if (env.DB_SSL) {
  dialectOptions.ssl = {
    rejectUnauthorized: false,
  };
}

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'mysql',
  dialectModule: await import('mysql2').then((m) => m.default || m),
  dialectOptions,
  logging: env.DB_LOGGING
    ? (sql) => {
        // Only log the SQL statement, not the full parameter list
        const truncated = sql.length > 300 ? sql.slice(0, 300) + '…' : sql;
        console.log('[SQL]', truncated);
      }
    : false,
  pool: {
    max: env.DB_POOL_MAX,
    min: env.DB_POOL_MIN,
    acquire: env.DB_POOL_ACQUIRE,
    idle: env.DB_POOL_IDLE,
  },
  define: {
    underscored: false,
    freezeTableName: false,
    timestamps: true,
  },
});

/**
 * Verify database connectivity.
 * Call this at startup before accepting HTTP traffic.
 */
export async function connectDatabase() {
  await sequelize.authenticate();
}

/**
 * Close all Sequelize connections.
 * Call during graceful shutdown.
 */
export async function closeDatabase() {
  await sequelize.close();
}

export default sequelize;
