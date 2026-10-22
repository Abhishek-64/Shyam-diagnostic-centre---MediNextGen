'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tests', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      categoryId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      slug: {
        type: Sequelize.STRING(220),
        allowNull: false,
        unique: true,
      },
      shortDescription: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      preparationInstructions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sampleType: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      reportingTime: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      priceInPaise: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      discountPriceInPaise: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      isPopular: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isHomeCollectionAvailable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.addIndex('tests', ['slug'], {
      unique: true,
      name: 'idx_tests_slug',
    });
    await queryInterface.addIndex('tests', ['categoryId'], {
      name: 'idx_tests_category_id',
    });
    await queryInterface.addIndex('tests', ['isPublished'], {
      name: 'idx_tests_is_published',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tests');
  },
};
