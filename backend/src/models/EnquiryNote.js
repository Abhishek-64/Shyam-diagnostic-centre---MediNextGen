import { DataTypes } from 'sequelize';

export default function defineEnquiryNote(sequelize) {
  const EnquiryNote = sequelize.define(
    'EnquiryNote',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      enquiryId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      adminUserId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'enquiry_notes',
      timestamps: true,
      updatedAt: false, // Notes are append-only
    }
  );

  EnquiryNote.associate = (models) => {
    EnquiryNote.belongsTo(models.Enquiry, { foreignKey: 'enquiryId', as: 'enquiry' });
    EnquiryNote.belongsTo(models.AdminUser, { foreignKey: 'adminUserId', as: 'adminUser' });
  };

  return EnquiryNote;
}
