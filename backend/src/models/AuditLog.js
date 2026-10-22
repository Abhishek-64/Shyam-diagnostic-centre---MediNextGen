import { DataTypes } from 'sequelize';

export default function defineAuditLog(sequelize) {
  const AuditLog = sequelize.define(
    'AuditLog',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      adminUserId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      entityType: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      entityId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      details: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
    },
    {
      tableName: 'audit_logs',
      timestamps: true,
      updatedAt: false, // Audit logs are append-only
    }
  );

  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.AdminUser, { foreignKey: 'adminUserId', as: 'adminUser' });
  };

  return AuditLog;
}
