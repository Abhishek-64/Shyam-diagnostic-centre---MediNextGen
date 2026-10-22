'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('site_settings', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      settingKey: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      settingValue: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      description: {
        type: Sequelize.STRING(255),
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

    await queryInterface.addIndex('site_settings', ['settingKey'], {
      unique: true,
      name: 'idx_site_settings_key',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('site_settings');
  },
};
