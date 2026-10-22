/**
 * ExampleRecord service layer.
 *
 * All database operations go here — keep controllers thin.
 * Uses explicit field selection to prevent mass assignment.
 */

import { Op } from 'sequelize';
import { ExampleRecord } from '../database/models/index.js';
import sequelize from '../config/database.js';

// Writable fields — never allow id, createdAt, updatedAt from user input
const WRITABLE_FIELDS = ['title', 'description', 'status'];

function pickWritable(data) {
  return Object.fromEntries(
    WRITABLE_FIELDS.filter((k) => k in data).map((k) => [k, data[k]])
  );
}

/**
 * List records with pagination and optional status filter.
 */
export async function listExampleRecords({ page = 1, limit = 10, status }) {
  const where = {};
  if (status) where.status = status;

  const offset = (page - 1) * limit;

  const { count, rows } = await ExampleRecord.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'title', 'description', 'status', 'createdAt', 'updatedAt'],
  });

  return {
    records: rows,
    pagination: {
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      limit,
    },
  };
}

/**
 * Get single record by ID.
 */
export async function getExampleRecordById(id) {
  const record = await ExampleRecord.findByPk(id, {
    attributes: ['id', 'title', 'description', 'status', 'createdAt', 'updatedAt'],
  });
  return record;
}

/**
 * Create a new record.
 */
export async function createExampleRecord(data) {
  const safe = pickWritable(data);
  const record = await ExampleRecord.create(safe);
  return record;
}

/**
 * Update an existing record (partial update).
 */
export async function updateExampleRecord(id, data) {
  const record = await ExampleRecord.findByPk(id);
  if (!record) return null;

  const safe = pickWritable(data);
  await record.update(safe);
  return record;
}

/**
 * Delete a record.
 */
export async function deleteExampleRecord(id) {
  // Use transaction to prevent race conditions
  const t = await sequelize.transaction();
  try {
    const record = await ExampleRecord.findByPk(id, { transaction: t });
    if (!record) {
      await t.rollback();
      return false;
    }
    await record.destroy({ transaction: t });
    await t.commit();
    return true;
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
