import { DataTypes } from 'sequelize';

export default function definePartnerLaboratory(sequelize) {
  const PartnerLaboratory = sequelize.define(
    'PartnerLaboratory',
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
      city: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      accreditation: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      isAccreditationVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Default unpublished until confirmed
      },
      contactPhone: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      contactEmail: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: 'partner_laboratories',
      timestamps: true,
    }
  );

  PartnerLaboratory.associate = (models) => {
    PartnerLaboratory.belongsToMany(models.ServiceArea, {
      through: models.PartnerServiceArea,
      foreignKey: 'partnerId',
      otherKey: 'serviceAreaId',
      as: 'serviceAreas',
    });
    PartnerLaboratory.hasMany(models.PartnerTest, { foreignKey: 'partnerId', as: 'partnerTests' });
  };

  return PartnerLaboratory;
}
