import { Op } from 'sequelize';
import { Offer } from '../../database/models/index.js';
import { sendSuccess } from '../../utils/response.js';

export async function getPublicOffers(req, res) {
  return sendSuccess(res, []);
}
