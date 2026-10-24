'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Tests display control fields
    const testCols = await queryInterface.describeTable('tests');
    if (!testCols.showPriceOnWebsite) {
      await queryInterface.addColumn('tests', 'showPriceOnWebsite', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }
    if (!testCols.showSampleType) {
      await queryInterface.addColumn('tests', 'showSampleType', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }
    if (!testCols.showReportingTime) {
      await queryInterface.addColumn('tests', 'showReportingTime', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }
    if (!testCols.showPreparationInstructions) {
      await queryInterface.addColumn('tests', 'showPreparationInstructions', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }

    // 2. Packages display control fields
    const pkgCols = await queryInterface.describeTable('packages');
    if (!pkgCols.showPriceOnWebsite) {
      await queryInterface.addColumn('packages', 'showPriceOnWebsite', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }
    if (!pkgCols.showOriginalPrice) {
      await queryInterface.addColumn('packages', 'showOriginalPrice', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }
    if (!pkgCols.showFastDuration) {
      await queryInterface.addColumn('packages', 'showFastDuration', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }
    if (!pkgCols.showReportTime) {
      await queryInterface.addColumn('packages', 'showReportTime', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }
  },

  async down(queryInterface) {
    const testCols = await queryInterface.describeTable('tests');
    if (testCols.showPriceOnWebsite) await queryInterface.removeColumn('tests', 'showPriceOnWebsite');
    if (testCols.showSampleType) await queryInterface.removeColumn('tests', 'showSampleType');
    if (testCols.showReportingTime) await queryInterface.removeColumn('tests', 'showReportingTime');
    if (testCols.showPreparationInstructions) await queryInterface.removeColumn('tests', 'showPreparationInstructions');

    const pkgCols = await queryInterface.describeTable('packages');
    if (pkgCols.showPriceOnWebsite) await queryInterface.removeColumn('packages', 'showPriceOnWebsite');
    if (pkgCols.showOriginalPrice) await queryInterface.removeColumn('packages', 'showOriginalPrice');
    if (pkgCols.showFastDuration) await queryInterface.removeColumn('packages', 'showFastDuration');
    if (pkgCols.showReportTime) await queryInterface.removeColumn('packages', 'showReportTime');
  },
};
