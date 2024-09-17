import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import logger from '../config/logger.js';
import { SENDGRID_API_KEY } from '../config/config.js';

dotenv.config();
sgMail.setApiKey(SENDGRID_API_KEY);

export const sendConfirmationEmail = async (msg) => {
  await sgMail.send(msg);
  logger.info('Confirmation email sent successfully.');
};
