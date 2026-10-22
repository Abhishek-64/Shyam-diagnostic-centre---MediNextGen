'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('service_areas', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      pinCode: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
      },
      areaName: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'Gujarat',
      },
      isHomeCollectionActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isAllIndiaPartner: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('service_areas', ['pinCode'], {
      unique: true,
      name: 'idx_service_areas_pincode',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('service_areas');
  },
};
