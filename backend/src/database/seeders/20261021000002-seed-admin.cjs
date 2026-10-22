'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@shyamdiagnostic.com';
    const rawPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@Shyam2026!';
    const name = process.env.SEED_ADMIN_NAME || 'Admin Shyam Diagnostic';

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(rawPassword, salt);
    const now = new Date();

    const existingUsers = await queryInterface.sequelize.query(
      `SELECT id FROM admin_users WHERE email = :email LIMIT 1`,
      {
        replacements: { email },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (existingUsers && existingUsers.length > 0) {
      console.log(`Admin user with email ${email} already exists. Skipping seed.`);
      return;
    }

    await queryInterface.bulkInsert('admin_users', [
      {
        name,
        email,
        passwordHash,
        role: 'superadmin',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    console.log(`Initial admin user seeded: ${email}`);
  },

  async down(queryInterface) {
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@shyamdiagnostic.com';
    await queryInterface.bulkDelete('admin_users', { email }, {});
  },
};
