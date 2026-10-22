'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('packages', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(220),
        allowNull: false,
        unique: true,
      },
      subtitle: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      parametersCovered: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      fastDuration: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      reportTime: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      priceInPaise: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      originalPriceInPaise: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      isPopular: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isFeatured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isHomeCollectionAvailable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      priceVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isPublished: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      displayOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

    await queryInterface.addIndex('packages', ['slug'], {
      unique: true,
      name: 'idx_packages_slug',
    });
    await queryInterface.addIndex('packages', ['isPublished'], {
      name: 'idx_packages_is_published',
    });
    await queryInterface.addIndex('packages', ['isFeatured'], {
      name: 'idx_packages_is_featured',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('packages');
  },
};
