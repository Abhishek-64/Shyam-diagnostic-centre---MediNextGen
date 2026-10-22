# Local Setup Guide

Step-by-step instructions to get the project running on your machine.

## Prerequisites

| Tool | Minimum Version | Installation |
|------|----------------|-------------|
| Node.js | 18 LTS | https://nodejs.org/ |
| npm | 8 | Included with Node.js |
| MySQL | 8.0 | https://dev.mysql.com/downloads/ |
| Git | any | https://git-scm.com/ |

---

## Step 1 — Clone the Repository

```bash
git clone <your-repo-url>
cd reusable-fullstack-starter
```

---

## Step 2 — Install Dependencies

From the repository root:

```bash
npm install
```

This installs dependencies for both `frontend` and `backend` workspaces.

---

## Step 3 — Create the MySQL Database

### Using the MySQL CLI

```bash
mysql -u root -p
```

Then at the MySQL prompt:

```sql
CREATE DATABASE reusable_starter
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Create a dedicated user (recommended)
CREATE USER 'starter_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON reusable_starter.* TO 'starter_user'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

### Using MySQL Workbench or another GUI

Create a schema named `reusable_starter` with character set `utf8mb4`.

---

## Step 4 — Configure Backend Environment

```bash
# Windows PowerShell
Copy-Item backend\.env.example backend\.env

# macOS / Linux
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```dotenv
NODE_ENV=development
PORT=5000
CLIENT_ORIGINS=http://localhost:5173

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=reusable_starter
DB_USER=starter_user
DB_PASSWORD=your_strong_password
DB_LOGGING=false
DB_SSL=false
```

---

## Step 5 — Configure Frontend Environment

```bash
# Windows PowerShell
Copy-Item frontend\.env.example frontend\.env

# macOS / Linux
cp frontend/.env.example frontend/.env
```

The default values work for local development:

```dotenv
VITE_APP_NAME=Reusable Starter
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## Step 6 — Run Database Migrations

```bash
cd backend
npm run db:migrate
cd ..
```

Expected output:

```
== 20250101000001-create-example-records: migrating =======
== 20250101000001-create-example-records: migrated (0.123s)
```

---

## Step 7 — Optionally Seed Development Data

```bash
cd backend
npm run db:seed
cd ..
```

This inserts 3 generic ExampleRecord rows for testing.

---

## Step 8 — Start the Application

**Frontend + backend together (recommended):**

```bash
npm run dev
```

**Frontend only:**

```bash
npm run dev:frontend
```

**Backend only:**

```bash
npm run dev:backend
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api/v1 |
| Health check | http://localhost:5000/api/v1/health |
| DB readiness | http://localhost:5000/api/v1/health/ready |

---

## Step 9 — Verify the Setup

1. Open http://localhost:5173 — you should see the homepage.
2. Open http://localhost:5000/api/v1/health — should return `{ "success": true }`.
3. Open http://localhost:5000/api/v1/health/ready — should return `{ "database": "connected" }`.
4. Navigate to the Examples page — records from the seeder should appear.

---

## Common Problems

### `ER_ACCESS_DENIED_ERROR`
Incorrect database username or password. Check `DB_USER` and `DB_PASSWORD` in `backend/.env`.

### `ER_BAD_DB_ERROR`
The database does not exist. Run the `CREATE DATABASE` command in Step 3.

### Port 5173 or 5000 already in use
- Change `PORT` in `backend/.env`.
- Or change `server.port` in `frontend/vite.config.js`.

### `ECONNREFUSED 127.0.0.1:3306`
MySQL is not running. Start it with:

```bash
# macOS with Homebrew
brew services start mysql

# Linux (systemd)
sudo systemctl start mysql

# Windows — start MySQL service from Services panel or:
net start MySQL80
```
