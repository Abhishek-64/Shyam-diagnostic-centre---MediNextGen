import { DataTypes } from 'sequelize';

export default function defineServiceArea(sequelize) {
  const ServiceArea = sequelize.define(
    'ServiceArea',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      pinCode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
      },
      areaName: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'Gujarat',
      },
      isHomeCollectionActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isAllIndiaPartner: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'service_areas',
      timestamps: true,
    }
  );

  ServiceArea.associate = (models) => {
    ServiceArea.belongsToMany(models.PartnerLaboratory, {
      through: models.PartnerServiceArea,
      foreignKey: 'serviceAreaId',
      otherKey: 'partnerId',
      as: 'partners',
    });
  };

  return ServiceArea;
}
