# Environment Variables Reference

## Backend (`backend/.env`)

| Variable | Required | Default | Public? | Description |
|----------|----------|---------|---------|-------------|
| `NODE_ENV` | No | `development` | No | Runtime environment: `development`, `test`, `production` |
| `PORT` | No | `5000` | No | TCP port the Express server listens on |
| `CLIENT_ORIGINS` | No | `http://localhost:5173` | No | Comma-separated list of allowed CORS origins |
| `DB_HOST` | Yes (prod) | `127.0.0.1` | **SECRET** | MySQL server hostname or IP |
| `DB_PORT` | No | `3306` | No | MySQL server port |
| `DB_NAME` | Yes (prod) | `reusable_starter` | No | Database schema name |
| `DB_USER` | Yes (prod) | `root` | **SECRET** | Database login username |
| `DB_PASSWORD` | Yes (prod) | *(empty)* | **SECRET** | Database login password |
| `DB_LOGGING` | No | `false` | No | Set `true` to log SQL queries to stdout |
| `DB_SSL` | No | `false` | No | Set `true` to enable SSL/TLS for the DB connection |
| `DB_POOL_MAX` | No | `10` | No | Maximum connections in the pool |
| `DB_POOL_MIN` | No | `0` | No | Minimum connections kept alive |
| `DB_POOL_ACQUIRE` | No | `30000` | No | Max milliseconds to wait for a connection (ms) |
| `DB_POOL_IDLE` | No | `10000` | No | Milliseconds before idle connection is released (ms) |

## Frontend (`frontend/.env`)

| Variable | Required | Default | Public? | Description |
|----------|----------|---------|---------|-------------|
| `VITE_APP_NAME` | No | `Reusable Starter` | **PUBLIC** | Application display name |
| `VITE_API_BASE_URL` | No | `http://localhost:5000/api/v1` | **PUBLIC** | Backend API base URL used by Axios |

> **Warning:** All `VITE_*` variables are embedded in the browser bundle at build time. Never put server secrets, database credentials, or private API keys in frontend environment variables.

## Loading Order

### Development
1. `backend/.env` is loaded by `dotenv` before anything else in `server.js`.
2. `frontend/.env` is read by Vite during `vite dev` or `vite build`.

### Production
- Backend: set environment variables in your hosting dashboard (Render, Railway, etc.). Do not deploy a `.env` file to production.
- Frontend: set `VITE_*` variables in the hosting dashboard **before building**, or pass them during the build step. Changing them after deployment requires a new build.

## Precedence

For the backend, `dotenv` does not override variables that are already set in the process environment. Production platforms set environment variables directly, so the `.env` file is ignored.

## Security Rules

- **Never commit** real `.env` files. Only `.env.example` files are committed.
- **Never place** database passwords or private keys in `VITE_*` variables.
- Production database password must be a strong, randomly generated string.
- Rotate credentials immediately if they are accidentally exposed.
