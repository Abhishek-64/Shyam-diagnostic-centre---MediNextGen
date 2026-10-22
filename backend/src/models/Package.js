import { DataTypes } from 'sequelize';

export default function definePackage(sequelize) {
  const Package = sequelize.define(
    'Package',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(220),
        allowNull: false,
        unique: true,
      },
      subtitle: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      parametersCovered: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      fastDuration: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: '10-12 hours fasting required',
      },
      reportTime: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'Same day / 24 hours',
      },
      priceInPaise: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      originalPriceInPaise: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      isPopular: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isFeatured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hasOfferBadge: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isHomeCollectionAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      priceVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      displayOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'packages',
      timestamps: true,
    }
  );

  Package.associate = (models) => {
    Package.belongsToMany(models.Test, {
      through: models.PackageTest,
      foreignKey: 'packageId',
      otherKey: 'testId',
      as: 'tests',
    });
    Package.hasMany(models.PackageTest, { foreignKey: 'packageId', as: 'packageTests' });
    Package.hasMany(models.Enquiry, { foreignKey: 'packageId', as: 'enquiries' });
  };

  return Package;
}
