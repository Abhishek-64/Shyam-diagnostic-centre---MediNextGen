import 'dotenv/config';
import mysql from 'mysql2/promise';
import { execSync } from 'child_process';
import { env } from '../config/env.js';

async function initDb() {
  console.log(`Connecting to MySQL server at ${env.DB_HOST}:${env.DB_PORT}...`);
  try {
    const connection = await mysql.createConnection({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      ssl: env.DB_SSL ? { rejectUnauthorized: false } : undefined,
    });

    console.log(`Ensuring database "${env.DB_NAME}" exists...`);
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await connection.end();
    console.log(`Database "${env.DB_NAME}" is ready.`);

    console.log('Running migrations...');
    execSync('npm run db:migrate', { stdio: 'inherit', cwd: process.cwd() });

    console.log('Running seeders...');
    execSync('npm run db:seed', { stdio: 'inherit', cwd: process.cwd() });

    console.log('Database initialization and seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to initialize database:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error(
        '\n[ACTION REQUIRED] MySQL service is not currently running.\nTo start it:\n1. Open Start menu or press Win+R\n2. Type "services.msc" and press Enter\n3. Locate "MySQL80"\n4. Right-click and choose "Start"\n5. Re-run "npm run db:init"\n'
      );
    }
    process.exit(1);
  }
}

initDb();
