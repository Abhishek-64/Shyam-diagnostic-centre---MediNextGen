# Database Guide

## Setup

### 1. Create the database

```sql
CREATE DATABASE reusable_starter
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 2. Create a dedicated user

```sql
CREATE USER 'starter_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP
  ON reusable_starter.* TO 'starter_user'@'localhost';
FLUSH PRIVILEGES;
```

In production, reduce privileges to only `SELECT, INSERT, UPDATE, DELETE` after initial migration.

---

## Sequelize Configuration

The Sequelize instance is in `backend/src/config/database.js`. It reads all settings from environment variables.

Key settings:

| Setting | Variable | Default |
|---------|----------|---------|
| Host | `DB_HOST` | `127.0.0.1` |
| Port | `DB_PORT` | `3306` |
| Database | `DB_NAME` | `reusable_starter` |
| User | `DB_USER` | `root` |
| Password | `DB_PASSWORD` | *(empty)* |
| SSL | `DB_SSL` | `false` |
| Pool max | `DB_POOL_MAX` | `10` |
| SQL logging | `DB_LOGGING` | `false` |

---

## Models

Models are defined in `backend/src/models/` and registered in `backend/src/database/models/index.js`.

### ExampleRecord

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | INT UNSIGNED (PK) | No | auto |
| `title` | VARCHAR(255) | No | — |
| `description` | TEXT | Yes | NULL |
| `status` | ENUM | No | `active` |
| `createdAt` | DATETIME | No | auto |
| `updatedAt` | DATETIME | No | auto |

### Associations

Associations are registered in each model's `associate` method, called from `models/index.js` after all models are initialised. This prevents circular import issues.

Example:
```js
ExampleRecord.associate = (models) => {
  ExampleRecord.belongsTo(models.User, { foreignKey: 'userId' });
};
```

---

## Migrations

Migrations are the **source of truth** for schema. Never use `sequelize.sync()` to create production tables.

### Commands (run from `backend/`)

```bash
# Run all pending migrations
npm run db:migrate

# Check status
npm run db:migrate:status

# Roll back last migration
npm run db:migrate:undo

# Roll back all
npm run db:migrate:undo:all

# Create a new migration file
npm run db:migration:create -- --name add-users-table
```

### Migration file format

Migrations use `.cjs` extension because `sequelize-cli` does not support ES modules natively. The application source uses ES modules (`.js`).

### Production Migration Procedure

1. Back up the production database.
2. Review the migration SQL (use `npm run db:migrate:status` to see pending).
3. Run migrations during a maintenance window or as a controlled release step.
4. Verify the application is working after migration.
5. Never run `sequelize.sync({ alter: true })` or `sequelize.sync({ force: true })` in production.

---

## Seeders

Seeders insert development/test data only. They are optional.

```bash
cd backend
npm run db:seed       # Insert seed data
npm run db:seed:undo  # Remove seed data
```

Seeders must not insert real users, real credentials, or sensitive personal data.

---

## Transactions

Use transactions for operations that must succeed or fail together:

```js
const t = await sequelize.transaction();
try {
  await RecordA.create({ ... }, { transaction: t });
  await RecordB.update({ ... }, { where: { id }, transaction: t });
  await t.commit();
} catch (err) {
  await t.rollback();
  throw err;
}
```

---

## Backup and Recovery

### Manual backup

```bash
mysqldump -u root -p reusable_starter > backup_$(date +%Y%m%d).sql
```

### Restore

```bash
mysql -u root -p reusable_starter < backup_20250101.sql
```

### Managed database backups

Most managed MySQL providers (PlanetScale, AWS RDS, Render, Railway) offer automated daily backups. Enable and test these before going to production.
