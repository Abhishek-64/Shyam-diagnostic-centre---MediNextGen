import { DataTypes } from 'sequelize';

export default function definePartnerTest(sequelize) {
  const PartnerTest = sequelize.define(
    'PartnerTest',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      partnerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      testId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      partnerPriceInPaise: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      tableName: 'partner_tests',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['partnerId', 'testId'],
          name: 'idx_partner_test_unique',
        },
      ],
    }
  );

  PartnerTest.associate = (models) => {
    PartnerTest.belongsTo(models.PartnerLaboratory, { foreignKey: 'partnerId', as: 'partner' });
    PartnerTest.belongsTo(models.Test, { foreignKey: 'testId', as: 'test' });
  };

  return PartnerTest;
}
