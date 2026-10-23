'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add hasOfferBadge to tests table if not present
    const testTableDefinition = await queryInterface.describeTable('tests');
    if (!testTableDefinition.hasOfferBadge) {
      await queryInterface.addColumn('tests', 'hasOfferBadge', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }

    // 2. Add hasOfferBadge to packages table if not present
    const packageTableDefinition = await queryInterface.describeTable('packages');
    if (!packageTableDefinition.hasOfferBadge) {
      await queryInterface.addColumn('packages', 'hasOfferBadge', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }
  },

  async down(queryInterface) {
    const testTableDefinition = await queryInterface.describeTable('tests');
    if (testTableDefinition.hasOfferBadge) {
      await queryInterface.removeColumn('tests', 'hasOfferBadge');
    }

    const packageTableDefinition = await queryInterface.describeTable('packages');
    if (packageTableDefinition.hasOfferBadge) {
      await queryInterface.removeColumn('packages', 'hasOfferBadge');
    }
  },
};
