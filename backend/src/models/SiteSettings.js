import { DataTypes } from 'sequelize';

export default function defineSiteSettings(sequelize) {
  const SiteSettings = sequelize.define(
    'SiteSettings',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      settingKey: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      settingValue: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: 'site_settings',
      timestamps: true,
    }
  );

  return SiteSettings;
}
