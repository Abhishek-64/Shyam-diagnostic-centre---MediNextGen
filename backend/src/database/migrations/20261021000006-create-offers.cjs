'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('offers', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      discountPercentage: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      discountAmountInPaise: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      validFrom: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      validUntil: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      bannerText: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isPublished: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    await queryInterface.addIndex('offers', ['isPublished'], {
      name: 'idx_offers_is_published',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('offers');
  },
};
