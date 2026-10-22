'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('enquiries', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      referenceNumber: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      fullName: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      pinCode: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      enquiryType: {
        type: Sequelize.ENUM(
          'home_collection',
          'package_booking',
          'test_enquiry',
          'all_india_service',
          'general'
        ),
        allowNull: false,
        defaultValue: 'general',
      },
      preferredDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      preferredTimeSlot: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      testId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'tests',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      packageId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'packages',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      additionalNotes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('new', 'contacted', 'scheduled', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'new',
      },
      isWhatsAppNotified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ipAddress: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      userAgent: {
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

    await queryInterface.addIndex('enquiries', ['referenceNumber'], {
      unique: true,
      name: 'idx_enquiries_reference_number',
    });
    await queryInterface.addIndex('enquiries', ['status'], {
      name: 'idx_enquiries_status',
    });
    await queryInterface.addIndex('enquiries', ['phone'], {
      name: 'idx_enquiries_phone',
    });
    await queryInterface.addIndex('enquiries', ['pinCode'], {
      name: 'idx_enquiries_pincode',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('enquiries');
  },
};
