/**
 * app.js — Express application configuration.
 *
 * Responsible for:
 * - Security middleware (Helmet, CORS, rate limiting)
 * - Request parsing
 * - Route registration
 * - Not-found and error handlers
 *
 * Exported for use in server.js and integration tests.
 * Does NOT start listening — that is server.js's responsibility.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { liveSecurityGuard } from './middlewares/liveSecurityGuard.middleware.js';
import apiRoutes from './routes/index.js';
import { sendError } from './utils/response.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ============================================================
// 1. Trust proxy — only when behind a known reverse proxy.
// ============================================================
if (env.isProd) {
  app.set('trust proxy', 1);
}

// ============================================================
// 2. Security headers via Helmet
// ============================================================
app.use(
  helmet({
    contentSecurityPolicy: env.isProd
      ? {
          directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", ...env.CLIENT_ORIGINS],
          },
        }
      : false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ============================================================
// 3. CORS
// ============================================================
const allowedOrigins = env.CLIENT_ORIGINS;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin "${origin}" is not allowed.`));
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    credentials: true, // Allow cookies (admin_token)
    maxAge: 86400,
  })
);

// Handle preflight requests
app.options('*', cors());

// ============================================================
// 4. Rate limiting
// ============================================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    errors: [],
  },
  skip: (req) => req.path.startsWith('/api/v1/health'),
});

app.use(limiter);

// ============================================================
// 5. Request parsing & Cookie parser
// ============================================================
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// Static uploads serving
app.use('/uploads', express.static(path.resolve(__dirname, '..', env.UPLOAD_DIR)));

// ============================================================
// 6. MediNextGen Live Security Guard (Threat Detection & Auto-Ban)
// ============================================================
app.use(liveSecurityGuard);

// ============================================================
// 7. Routes
// ============================================================
app.use('/api/v1', apiRoutes);


// ============================================================
// 7. Not-found handler (must be after all routes)
// ============================================================
app.use((_req, res) => {
  sendError(res, 'The requested endpoint does not exist.', [], 404);
});

// ============================================================
// 8. Centralised error handler (must be last)
// ============================================================
app.use(errorHandler);

export default app;
