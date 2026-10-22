# Production Deployment Guide

## Overview

This guide covers deployment procedures for **Shyam Diagnostic Centre & MediNextGen Healthcare** application on Linux (Ubuntu 22.04 LTS / 24.04 LTS) with **Node.js (v20+ / v22+)**, **MySQL 8.0+**, **PM2**, and **Nginx** reverse proxy with SSL.

---

## 1. System Requirements

- **Server OS:** Ubuntu 22.04 / 24.04 LTS
- **Hardware:** 2 vCPU, 4 GB RAM, 40 GB SSD (minimum recommended)
- **Runtimes:**
  - Node.js `v20.x` or `v22.x` (LTS)
  - npm `v10.x` or higher
  - MySQL Server `8.0+`
  - Nginx `1.18+`
  - PM2 process manager

---

## 2. Server Provisioning & Installation

### Step 2.1: Update Server Packages
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw build-essential
```

### Step 2.2: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### Step 2.3: Install & Configure MySQL
```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

Log in to MySQL and provision the database:
```sql
CREATE DATABASE shyam_diagnostic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'shyam_user'@'localhost' IDENTIFIED BY 'Strong_Production_Password!2026';
GRANT ALL PRIVILEGES ON shyam_diagnostic.* TO 'shyam_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 3. Application Deployment

### Step 3.1: Clone and Set Up Workspace
```bash
git clone <repository_url> /var/www/shyam-diagnostic
cd /var/www/shyam-diagnostic
npm install
```

### Step 3.2: Configure Environment Variables
Create `/var/www/shyam-diagnostic/backend/.env`:
```env
PORT=5000
NODE_ENV=production

# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=shyam_diagnostic
DB_USER=shyam_user
DB_PASSWORD=Strong_Production_Password!2026
DB_DIALECT=mysql

# JWT Security
JWT_SECRET=production_super_secret_jwt_random_key_64_bytes_minimum
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://shyamdiagnostic.com

# Defaults
WHATSAPP_DEFAULT_PHONE=8320740996
ADMIN_SEED_EMAIL=admin@shyamdiagnostic.com
ADMIN_SEED_PASSWORD=Admin@Shyam2026!
```

### Step 3.3: Initialize Database Migrations & Seeds
```bash
npm run db:init --workspace=backend
```

### Step 3.4: Build Frontend Assets
```bash
npm run build --workspace=frontend
```
Production static assets will be compiled to `/var/www/shyam-diagnostic/frontend/dist`.

---

## 4. Process Management with PM2

Create `/var/www/shyam-diagnostic/ecosystem.config.cjs`:
```javascript
module.exports = {
  apps: [
    {
      name: 'shyam-backend',
      script: 'backend/src/server.js',
      instances: 2,
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
```

Launch with PM2:
```bash
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

---

## 5. Nginx Configuration & SSL

Create `/etc/nginx/sites-available/shyamdiagnostic.com`:
```nginx
server {
    listen 80;
    server_name shyamdiagnostic.com www.shyamdiagnostic.com;

    # Frontend Static Distribution
    location / {
        root /var/www/shyam-diagnostic/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API Proxy to Express Cluster
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static uploads directory
    location /uploads/ {
        alias /var/www/shyam-diagnostic/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

Enable site and test configuration:
```bash
sudo ln -s /etc/nginx/sites-available/shyamdiagnostic.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Install SSL with Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d shyamdiagnostic.com -d www.shyamdiagnostic.com
```

---

## 6. Firewall & Security Hardening

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

---

## 7. Operational Maintenance & Backups

### Automated Nightly MySQL Database Backup
Add to `crontab -e`:
```bash
0 2 * * * mysqldump -u shyam_user -p'Strong_Production_Password!2026' shyam_diagnostic | gzip > /var/backups/mysql/shyam_diagnostic_$(date +\%F).sql.gz
```
