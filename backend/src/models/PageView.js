import { DataTypes } from 'sequelize';

export default function definePageView(sequelize) {
  const PageView = sequelize.define(
    'PageView',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      visitorId: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      sessionId: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      path: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      deviceType: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: 'Desktop',
      },
      browser: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      os: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      referrer: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      ipHash: {
        type: DataTypes.STRING(64),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'page_views',
      timestamps: false,
      indexes: [
        { fields: ['visitorId'] },
        { fields: ['createdAt'] },
        { fields: ['path'] },
      ],
    }
  );

  return PageView;
}
