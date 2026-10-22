import { DataTypes } from 'sequelize';

export default function defineTest(sequelize) {
  const Test = sequelize.define(
    'Test',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING(220),
        allowNull: false,
        unique: true,
      },
      shortDescription: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      preparationInstructions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sampleType: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      reportingTime: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      priceInPaise: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      discountPriceInPaise: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      isPopular: {
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
      isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Default unpublished until confirmed
      },
    },
    {
      tableName: 'tests',
      timestamps: true,
    }
  );

  Test.associate = (models) => {
    Test.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    Test.belongsToMany(models.Package, {
      through: models.PackageTest,
      foreignKey: 'testId',
      otherKey: 'packageId',
      as: 'packages',
    });
    Test.hasMany(models.Enquiry, { foreignKey: 'testId', as: 'enquiries' });
  };

  return Test;
}
