import { DataTypes } from 'sequelize';

export default function definePackageTest(sequelize) {
  const PackageTest = sequelize.define(
    'PackageTest',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      packageId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      testId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      displayOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'package_tests',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['packageId', 'testId'],
          name: 'idx_package_test_unique',
        },
      ],
    }
  );

  PackageTest.associate = (models) => {
    PackageTest.belongsTo(models.Package, { foreignKey: 'packageId', as: 'package' });
    PackageTest.belongsTo(models.Test, { foreignKey: 'testId', as: 'test' });
  };

  return PackageTest;
}
