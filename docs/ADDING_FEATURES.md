# Adding Features

How to extend this starter for new project requirements.

---

## Adding a New React Page

1. Create the page file:

```
frontend/src/pages/NewPage.jsx
frontend/src/pages/NewPage.module.css
```

2. Add the route in `frontend/src/routes/AppRoutes.jsx`:

```jsx
import NewPage from '../pages/NewPage.jsx';

// Inside <Routes>:
<Route path="/new-path" element={<NewPage />} />
```

3. Add a nav link in `frontend/src/components/layout/Header.jsx`:

```js
const navItems = [
  // ...existing
  { to: '/new-path', label: 'New Page' },
];
```

---

## Adding a Reusable Component

1. Create in the appropriate directory:
   - `frontend/src/components/common/` — generic UI primitives
   - `frontend/src/components/layout/` — page structure

2. Use CSS Modules for styling (`.module.css`).

3. Follow the existing patterns: accept `className` as a prop, use semantic HTML, support accessibility attributes.

---

## Adding a New Express Route

1. Create the route file:

```js
// backend/src/routes/users.routes.js
import { Router } from 'express';
const router = Router();
router.get('/', ...);
export default router;
```

2. Register in `backend/src/app.js`:

```js
import userRoutes from './routes/users.routes.js';
app.use('/api/v1/users', userRoutes);
```

---

## Adding a Controller and Service

Follow this pattern for every new resource:

```
backend/src/validators/user.validator.js     ← Zod schemas
backend/src/services/user.service.js         ← Database logic
backend/src/controllers/user.controller.js   ← Thin HTTP layer
backend/src/routes/users.routes.js           ← Route definitions
```

Controller pattern:
```js
export async function listUsers(req, res, next) {
  try {
    const users = await userService.listUsers(req.query);
    sendSuccess(res, users);
  } catch (err) {
    next(err); // Always forward to the error handler
  }
}
```

---

## Adding a Validation Schema

```js
// backend/src/validators/user.validator.js
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});
```

Apply with the validate middleware:
```js
router.post('/', validate(createUserSchema, 'body'), createUser);
```

---

## Adding a Sequelize Model

1. Create the model definition:

```js
// backend/src/models/User.js
import { DataTypes } from 'sequelize';

export default function defineUser(sequelize) {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  }, { tableName: 'users' });

  User.associate = (models) => {
    // User.hasMany(models.Post, { foreignKey: 'userId' });
  };

  return User;
}
```

2. Register in `backend/src/database/models/index.js`:

```js
import defineUser from '../../models/User.js';
const User = defineUser(sequelize);
const models = { ExampleRecord, User };
```

---

## Creating a Database Migration

```bash
cd backend
npm run db:migration:create -- --name create-users-table
```

Edit the generated `.cjs` file in `src/database/migrations/`:

```js
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true, allowNull: false },
      name: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
```

Run it:
```bash
npm run db:migrate
```

---

## Adding a Full CRUD Module

Copy the entire example pattern:

```
backend/src/validators/myResource.validator.js
backend/src/services/myResource.service.js
backend/src/controllers/myResource.controller.js
backend/src/routes/myResource.routes.js
backend/src/database/migrations/<timestamp>-create-my-resource.cjs
```

Register the routes in `app.js`:

```js
import myResourceRoutes from './routes/myResource.routes.js';
app.use('/api/v1/my-resources', myResourceRoutes);
```

---

## Adding Authentication (Future)

This starter intentionally excludes authentication so you can choose the right strategy for your deployment:

- **Session + cookie** — best for server-rendered or monolith apps. Requires `express-session`, a session store, CSRF protection, and `Secure; SameSite=Strict` cookies.
- **JWT (stateless)** — suitable for separate frontend/backend. Store tokens in memory (not `localStorage`). Use short expiry + refresh tokens.
- **OAuth / third-party** — use `passport.js` or a library like `lucia`.

When you add auth:
1. Create a `users` migration and model.
2. Add registration and login routes.
3. Add authentication middleware.
4. Apply it to protected routes.
5. Update `CLIENT_ORIGINS` and `credentials: true` in CORS if using cookies.
