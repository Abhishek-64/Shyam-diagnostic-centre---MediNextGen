import 'dotenv/config';

/**
 * env.js — Centralised environment configuration.
 *
 * Validates all required environment variables before the app starts.
 * Provides typed, sanitised values instead of raw process.env strings.
 */

function requireEnv(key) {
  const value = process.env[key];
  if (value === undefined || value === '') {
    throw new Error(`Required environment variable "${key}" is missing or empty.`);
  }
  return value;
}

function optionalEnv(key, defaultValue) {
  return process.env[key] ?? defaultValue;
}

function parsePort(key, defaultValue) {
  const raw = process.env[key];
  if (!raw) return defaultValue;
  const port = parseInt(raw, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Environment variable "${key}" must be a valid port number (1–65535). Got: "${raw}"`);
  }
  return port;
}

function parsePositiveInt(key, defaultValue) {
  const raw = process.env[key];
  if (!raw) return defaultValue;
  const n = parseInt(raw, 10);
  if (isNaN(n) || n < 0) {
    throw new Error(`Environment variable "${key}" must be a non-negative integer. Got: "${raw}"`);
  }
  return n;
}

function parseBool(key, defaultValue) {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return defaultValue;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  throw new Error(`Environment variable "${key}" must be "true" or "false". Got: "${raw}"`);
}

function parseOrigins(raw) {
  if (!raw) return [];
  return raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

// Validate and export
const NODE_ENV = optionalEnv('NODE_ENV', 'development');
const isDev = NODE_ENV === 'development';
const isProd = NODE_ENV === 'production';

// In production, DB credentials must be present.
// In development, we tolerate missing DB_PASSWORD (empty string allowed).
if (isProd) {
  requireEnv('DB_HOST');
  requireEnv('DB_NAME');
  requireEnv('DB_USER');
  requireEnv('DB_PASSWORD');
}

export const env = {
  NODE_ENV,
  isDev,
  isProd,
  PORT: parsePort('PORT', 5000),

  // CORS
  CLIENT_ORIGINS: parseOrigins(optionalEnv('CLIENT_ORIGINS', 'http://localhost:5173')),

  // Database
  DB_HOST: optionalEnv('DB_HOST', '127.0.0.1'),
  DB_PORT: parsePort('DB_PORT', 3306),
  DB_NAME: optionalEnv('DB_NAME', 'shyam_diagnostic'),
  DB_USER: optionalEnv('DB_USER', 'root'),
  DB_PASSWORD: optionalEnv('DB_PASSWORD', 'root'),
  DB_LOGGING: parseBool('DB_LOGGING', false),
  DB_SSL: parseBool('DB_SSL', false),

  // Pool
  DB_POOL_MAX: parsePositiveInt('DB_POOL_MAX', 10),
  DB_POOL_MIN: parsePositiveInt('DB_POOL_MIN', 0),
  DB_POOL_ACQUIRE: parsePositiveInt('DB_POOL_ACQUIRE', 30000),
  DB_POOL_IDLE: parsePositiveInt('DB_POOL_IDLE', 10000),

  // Auth / JWT
  JWT_SECRET: optionalEnv('JWT_SECRET', 'shyam_diagnostic_jwt_dev_secret_2026'),
  JWT_EXPIRES_IN: optionalEnv('JWT_EXPIRES_IN', '7d'),

  // Admin Seeding
  SEED_ADMIN_EMAIL: optionalEnv('SEED_ADMIN_EMAIL', 'admin@shyamdiagnostic.com'),
  SEED_ADMIN_PASSWORD: optionalEnv('SEED_ADMIN_PASSWORD', 'Admin@Shyam2026!'),
  SEED_ADMIN_NAME: optionalEnv('SEED_ADMIN_NAME', 'Admin Shyam Diagnostic'),

  // Uploads & Static
  UPLOAD_DIR: optionalEnv('UPLOAD_DIR', 'public/uploads'),

  // Defaults
  WHATSAPP_DEFAULT_PHONE: optionalEnv('WHATSAPP_DEFAULT_PHONE', '8320740996'),

  // Gmail SMTP Email Service
  SMTP_HOST: optionalEnv('SMTP_HOST', 'smtp.gmail.com'),
  SMTP_PORT: parsePort('SMTP_PORT', 465),
  SMTP_SECURE: parseBool('SMTP_SECURE', true),
  SMTP_USER: optionalEnv('SMTP_USER', 'vadoliyaakshy@gmail.com'),
  SMTP_PASS: optionalEnv('SMTP_PASS', 'dknujygkocmrcysb'),
  ADMIN_EMAIL: optionalEnv('ADMIN_EMAIL', 'vadoliyaakshy@gmail.com'),
};

