/**
 * ExampleRecord.js — Sequelize model definition.
 *
 * Generic demonstration model. Replace or extend this for your project.
 * Do not add real business, patient, payment, or user data here.
 */

import { DataTypes } from 'sequelize';

export default function defineExampleRecord(sequelize) {
  const ExampleRecord = sequelize.define(
    'ExampleRecord',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Title must not be empty.' },
          len: { args: [1, 255], msg: 'Title must be between 1 and 255 characters.' },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'archived'),
        allowNull: false,
        defaultValue: 'active',
        validate: {
          isIn: {
            args: [['active', 'inactive', 'archived']],
            msg: 'Status must be one of: active, inactive, archived.',
          },
        },
      },
    },
    {
      tableName: 'example_records',
      timestamps: true,
      // Writable fields — prevents mass-assignment of id, createdAt, updatedAt
      // Enforced manually in service layer via allowedFields
    }
  );

  // Define associations here when adding relationships
  ExampleRecord.associate = (_models) => {
    // e.g. ExampleRecord.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return ExampleRecord;
}
