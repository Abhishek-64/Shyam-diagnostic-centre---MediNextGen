import { DataTypes } from 'sequelize';

export default function defineEnquiry(sequelize) {
  const Enquiry = sequelize.define(
    'Enquiry',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      referenceNumber: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      fullName: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      pinCode: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      enquiryType: {
        type: DataTypes.ENUM(
          'home_collection',
          'package_booking',
          'test_booking',
          'test_enquiry',
          'all_india_service',
          'general'
        ),
        allowNull: false,
        defaultValue: 'general',
      },
      preferredDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      preferredTimeSlot: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      testId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      packageId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      additionalNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('new', 'contacted', 'scheduled', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'new',
      },
      isWhatsAppNotified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: 'enquiries',
      timestamps: true,
    }
  );

  Enquiry.associate = (models) => {
    Enquiry.belongsTo(models.Test, { foreignKey: 'testId', as: 'test' });
    Enquiry.belongsTo(models.Package, { foreignKey: 'packageId', as: 'package' });
    Enquiry.hasMany(models.EnquiryNote, { foreignKey: 'enquiryId', as: 'notes' });
  };

  return Enquiry;
}
