import { DataTypes } from 'sequelize';

export default function defineOffer(sequelize) {
  const Offer = sequelize.define(
    'Offer',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      discountPercentage: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      discountAmountInPaise: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      validFrom: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      validUntil: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      bannerText: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'offers',
      timestamps: true,
    }
  );

  return Offer;
}
