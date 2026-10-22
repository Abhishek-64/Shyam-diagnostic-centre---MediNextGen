import { DataTypes } from 'sequelize';

export default function defineAdminUser(sequelize) {
  const AdminUser = sequelize.define(
    'AdminUser',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('superadmin', 'admin', 'staff'),
        allowNull: false,
        defaultValue: 'admin',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'admin_users',
      timestamps: true,
    }
  );

  AdminUser.associate = (models) => {
    AdminUser.hasMany(models.EnquiryNote, { foreignKey: 'adminUserId', as: 'enquiryNotes' });
    AdminUser.hasMany(models.AuditLog, { foreignKey: 'adminUserId', as: 'auditLogs' });
  };

  return AdminUser;
}
