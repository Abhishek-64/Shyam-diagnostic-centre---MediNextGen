# Shyam Diagnostic Centre & MediNextGen Healthcare

A complete, production-grade diagnostic services and pathology laboratory platform built with **React 18 + Vite**, **Node.js + Express**, **Sequelize ORM**, and **MySQL 8.0+**.

Includes a public patient booking & inquiry portal, interactive 6-digit PIN code serviceability checker, contextual WhatsApp booking triggers, dual-branded responsive interface, and an administrative control suite with audit trails, catalogue management, and price verification guardrails.

---

## Key Features

### 1. Patient & Public Experience
- **Dual Brand Identity:** Seamless co-branding for *Shyam Diagnostic Centre* (Primary Diagnostic Unit) and *MediNextGen Healthcare* (Specialized / All-India Network).
- **Interactive Catalogue:**
  - Full-body health checkup packages with parameters covered, fasting rules, sample types, and turnaround times.
  - Individual pathology and biochemistry test search with category filters.
  - Transparent pricing in Indian Rupees (stored as integer paise to eliminate floating-point rounding errors).
- **PIN Code Serviceability Engine:**
  - Validates user-entered 6-digit PIN codes against configured active delivery areas.
  - Direct phlebotomist dispatch confirmation with immediate WhatsApp booking handoff.
  - Unconfigured PIN codes will **never** return false "available" claims.
- **Enquiry & Booking Management:**
  - Multi-step modal and page forms with phone number, prescription file uploads, preferred collection dates, and morning/afternoon time slots.
  - Auto-generated human-readable reference IDs: `SDC-YYYYMMDD-XXXX`.
- **Contextual WhatsApp Integration:**
  - Floating WhatsApp action trigger with pre-composed messages tailored to the active package, test, or home collection enquiry.
  - Configurable via Admin Settings without requiring code redeployments.
- **Design System & Accessibility:**
  - Bespoke color palette: Deep Clinical Navy (`#143566`), Vital Emerald Green (`#009960`), and Clinical Coral.
  - Modern typography powered by Google Fonts (*Outfit* and *Inter*).
  - Light & dark mode theme switcher with persistent user preference.
  - Mobile bottom navigation action bar for one-tap WhatsApp, calling, and package browsing.

### 2. Administrative Portal (`/admin`)
- **JWT Authentication & Session Security:**
  - HttpOnly cookie with fallback Bearer header token support.
  - Brute-force rate limiting (`authLimiter`).
- **Real-Time Operational Dashboard:**
  - Key performance indicators: Total Enquiries, Today's Bookings, Conversion Rates, Published Packages, Active Tests, and Serviceable PINs.
  - Quick-action shortcuts and recent enquiry feeds.
- **Enquiry CRM & Workflow:**
  - Filter by status: `new`, `contacted`, `sample_scheduled`, `completed`, `cancelled`.
  - Patient contact details, preferred collection dates, address, and notes.
  - One-click WhatsApp message composer to contact the patient directly using their enquiry reference.
- **Catalogue & Pricing Guardrails:**
  - **Mandatory Verification Gate:** Packages and offers *cannot* be published to live visitors until marked `priceVerified: true`.
  - Tests directory with parameter codes, specimen types, and turnaround hours.
  - Category manager for departmental organization.
- **Service Area & Partner Network Management:**
  - Manage 6-digit PIN codes for direct fleet and partner laboratory network.
  - Partner laboratory directory with NABL / ISO accreditation tracking.
- **System Settings & Audit Trail:**
  - Edit WhatsApp numbers, helpdesk lines, centre operating hours, and banner text.
  - Immutable audit trail recording administrative modifications with timestamps, user IDs, and client IP addresses.

---

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, React Router v6, Lucide Icons, Vanilla CSS & CSS Modules |
| **Backend** | Node.js, Express 4, Sequelize ORM, MySQL2, Helmet, CORS, Express-Rate-Limit, Zod |
| **Database** | MySQL 8.0+ (14 relational tables, foreign keys, timestamps, indexes) |
| **Security** | BCrypt password hashing, JWT authentication, Audit Logging, Input Sanitization |

---

## Directory Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/             # Environment, DB, and logger configs
│   │   ├── controllers/        # Public and Admin controller handlers
│   │   │   ├── admin/          # Auth, Enquiries, Packages, Tests, Settings, Audit
│   │   │   └── public/         # Packages, Tests, Categories, Service Areas, Enquiries
│   │   ├── database/
│   │   │   ├── migrations/     # 14 Sequential database schema migrations
│   │   │   ├── models/         # 14 Sequelize models with associations
│   │   │   └── seeders/        # Categories, Admin user, Packages, Tests, Settings
│   │   ├── middlewares/        # Auth (JWT), Audit Log, Rate Limiters, Errors
│   │   ├── routes/             # Public and Admin Express route definitions
│   │   ├── utils/              # Reference ID, Slug generator, WhatsApp link, Response
│   │   ├── validators/         # Zod schemas for input validation
│   │   ├── app.js              # Express app assembly & middleware pipeline
│   │   └── server.js           # Server bootstrap with resilient DB reconnect
│   └── .env                    # Backend configuration & secrets
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── catalogue/      # PackageCard, TestCard, CategoryCard
│   │   │   ├── common/         # Buttons, Modals, PriceDisplay, ThemeToggle, Badges
│   │   │   ├── forms/          # EnquiryForm, PinCodeChecker
│   │   │   └── layout/         # Header, Footer, AdminSidebar, AdminHeader, MobileBar
│   │   ├── context/            # AuthContext, ThemeContext, ToastContext
│   │   ├── layouts/            # MainLayout, AdminLayout
│   │   ├── pages/              # 12 Public pages (Home, Packages, Tests, About, Contact, etc.)
│   │   │   └── admin/          # 8 Admin pages (Dashboard, Enquiries, Packages, Tests, Settings, etc.)
│   │   ├── routes/             # AppRoutes with ProtectedAdminRoute
│   │   ├── services/           # Axios API client with auth interceptors
│   │   └── styles/             # globals.css design system & CSS variables
│   └── vite.config.js          # Vite config with /api proxy to Express :5000
│
├── docs/                       # Project documentation
│   ├── CLIENT_VERIFICATION_REQUIRED.md  # Signoff requirements for client pricing & phone
│   ├── WHATSAPP_SETUP.md                # WhatsApp integration & wa.me deep links
│   └── DEPLOYMENT.md                    # Ubuntu/Nginx/PM2/SSL deployment guide
└── scripts/
    └── patch-cmd.cjs           # Windows ampersand path patch for npm cmd wrappers
```

---

## Quick Start (Local Development)

### 1. Prerequisites
- **Node.js:** v20.x or v22.x LTS
- **MySQL Server:** v8.0+ running on port `3306`

### 2. Environment Setup
Verify `backend/.env` settings:
```env
PORT=5000
NODE_ENV=development

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=shyam_diagnostic
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_DIALECT=mysql

JWT_SECRET=super_secret_jwt_random_key_shyam_diagnostic_2026!
WHATSAPP_DEFAULT_PHONE=8320740996
ADMIN_SEED_EMAIL=admin@shyamdiagnostic.com
ADMIN_SEED_PASSWORD=Admin@Shyam2026!
```

### 3. Initialize Database & Seed Initial Data
Ensure your MySQL service is running, then run:
```bash
npm run db:init --workspace=backend
```
This automatically:
1. Creates the `shyam_diagnostic` database if it does not exist.
2. Executes all 14 schema migrations.
3. Seeds initial clinical categories, default site settings, root administrator account, and medical test catalogue.

### 4. Run Development Servers
Start both backend (port `5000`) and frontend (port `5173`) concurrently:
```bash
npm run dev
```

- Public Portal: `http://localhost:5173/`
- Admin Portal: `http://localhost:5173/admin/login`

---

## Default Admin Credentials

- **Email:** `admin@shyamdiagnostic.com`
- **Password:** `Admin@Shyam2026!`
- *Important:* Change the password in production via the profile settings or backend environment variable.

---

## Key Documentation

- [Client Verification Required](docs/CLIENT_VERIFICATION_REQUIRED.md) - Mandatory checklist for phone numbers, WhatsApp, and pricing sign-off.
- [WhatsApp Integration Setup](docs/WHATSAPP_SETUP.md) - Deep linking formats and WhatsApp Business guidelines.
- [Production Deployment Guide](docs/DEPLOYMENT.md) - Step-by-step Linux, Nginx, PM2, and SSL production setup.

---

## License

Proprietary — All rights reserved © Shyam Diagnostic Centre & MediNextGen Healthcare.
