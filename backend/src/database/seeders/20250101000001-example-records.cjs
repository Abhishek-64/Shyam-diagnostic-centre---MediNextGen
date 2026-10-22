'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('example_records', [
      {
        title: 'First Example Record',
        description: 'This is a seed record created for development and demonstration purposes.',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        title: 'Second Example Record',
        description: 'Another generic seed record. Replace with your own development data.',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      },
      {
        title: 'Archived Demo Entry',
        description: 'An example of an archived record status.',
        status: 'archived',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.bulkDelete('example_records', null, {});
  },
};
