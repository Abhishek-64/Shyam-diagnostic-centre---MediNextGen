import { DataTypes } from 'sequelize';

export default function definePartnerServiceArea(sequelize) {
  const PartnerServiceArea = sequelize.define(
    'PartnerServiceArea',
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
      serviceAreaId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      tableName: 'partner_service_areas',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['partnerId', 'serviceAreaId'],
          name: 'idx_partner_service_area_unique',
        },
      ],
    }
  );

  return PartnerServiceArea;
}
