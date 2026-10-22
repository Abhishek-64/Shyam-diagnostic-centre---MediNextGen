# Security Guide

## Default Security Configuration

### HTTP Security Headers (Helmet)

Helmet sets the following headers automatically:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 0` (modern browsers don't need this)
- `Strict-Transport-Security` (HSTS) in production
- `Referrer-Policy: no-referrer`

Content-Security-Policy is disabled in development and configured minimally in production. Tighten the CSP directives once you know your frontend's asset sources.

### CORS

CORS controls which browser **origins** may call the API. It is **not** authentication or authorisation.

- Allowed origins are read from `CLIENT_ORIGINS` (comma-separated).
- Wildcard origins (`*`) are never used with credentials.
- For local development: `CLIENT_ORIGINS=http://localhost:5173`
- For production: `CLIENT_ORIGINS=https://your-app.vercel.app`

CORS headers only affect browser-initiated requests. Server-to-server calls are not restricted by CORS.

### Rate Limiting

- 200 requests per 15-minute window per IP by default.
- Health endpoints are excluded from rate limiting.
- Adjust `max` and `windowMs` in `backend/src/app.js` based on your traffic patterns.

### Request Size Limits

- JSON bodies: 1 MB maximum.
- URL-encoded bodies: 1 MB maximum.
- File uploads are not enabled by default — add `multer` or a similar library with explicit size and type validation when needed.

---

## Secrets Management

### Rules

1. **Never commit** real `.env` files to version control.
2. **Never put** database passwords or private API keys in `VITE_*` variables — they are embedded in the browser bundle.
3. Use strong, randomly generated passwords for database accounts.
4. Rotate credentials immediately if they are exposed.

### In Production

- Set environment variables in your hosting dashboard (Render, Railway, Vercel, etc.).
- Use a secrets manager (AWS Secrets Manager, Doppler, Vault) for large or regulated deployments.
- Never log passwords, tokens, or sensitive query parameters.

---

## Database Security

- Use a dedicated, least-privilege database account: grant only `SELECT`, `INSERT`, `UPDATE`, `DELETE` on the specific database — not `GRANT ALL` on `*.*`.
- Enable `DB_SSL=true` when your database provider requires it.
- Never expose the MySQL port (3306) publicly. Use private networking or an allowlist.
- Run migrations before deploying code that depends on new tables.
- Back up the database before running destructive migrations.

---

## Input Validation

All API inputs are validated with Zod before reaching the service layer:

- Request bodies (`req.body`)
- Query parameters (`req.query`)
- Route parameters (`req.params`)

Validated data replaces raw input, so controllers only receive safe, typed values.

---

## Error Responses

- Stack traces are never returned in production responses.
- SQL errors are never returned in API responses.
- Database hostnames, connection strings, and credentials are never included in responses.
- Development mode returns slightly more detail to help debugging.

---

## Logging

- Pino is used for structured JSON logging.
- Sensitive fields (`password`, `token`, `authorization`) are automatically redacted.
- Request bodies are never logged (they may contain credentials).
- In production, log verbosity is `info` (not `debug`).

---

## Dependency Updates

Run `npm audit` regularly:

```bash
npm audit
npm audit fix
```

Review breaking changes before upgrading major versions of Sequelize, Express, or Vite.

---

## Production Checklist

- [ ] `NODE_ENV=production` is set on the backend host.
- [ ] Database credentials are strong and set via hosting environment variables.
- [ ] `DB_SSL=true` if the database provider requires it.
- [ ] `CLIENT_ORIGINS` is set to the production frontend URL only.
- [ ] HTTPS is enabled on both frontend and backend hosts.
- [ ] Health-check path is configured correctly on the hosting platform.
- [ ] Migrations have been reviewed and run against the production database.
- [ ] No real `.env` file is deployed alongside the application.
- [ ] `npm audit` reports no high or critical vulnerabilities.
