/**
 * ExampleRecord controller — thin layer between routes and service.
 * No database logic here.
 */

import * as exampleService from '../services/exampleRecord.service.js';
import {
  sendSuccess,
  sendCreated,
  sendNotFound,
} from '../utils/response.js';

export async function listExamples(req, res, next) {
  try {
    const { page, limit, status } = req.query;
    const result = await exampleService.listExampleRecords({ page, limit, status });
    sendSuccess(res, result, 'Records retrieved successfully.');
  } catch (err) {
    next(err);
  }
}

export async function getExample(req, res, next) {
  try {
    const { id } = req.params;
    const record = await exampleService.getExampleRecordById(id);
    if (!record) return sendNotFound(res, 'Example record not found.');
    sendSuccess(res, record.toJSON(), 'Record retrieved successfully.');
  } catch (err) {
    next(err);
  }
}

export async function createExample(req, res, next) {
  try {
    const record = await exampleService.createExampleRecord(req.body);
    sendCreated(res, record.toJSON(), 'Record created successfully.');
  } catch (err) {
    next(err);
  }
}

export async function updateExample(req, res, next) {
  try {
    const { id } = req.params;
    const record = await exampleService.updateExampleRecord(id, req.body);
    if (!record) return sendNotFound(res, 'Example record not found.');
    sendSuccess(res, record.toJSON(), 'Record updated successfully.');
  } catch (err) {
    next(err);
  }
}

export async function deleteExample(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await exampleService.deleteExampleRecord(id);
    if (!deleted) return sendNotFound(res, 'Example record not found.');
    // 204 No Content — no body
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
