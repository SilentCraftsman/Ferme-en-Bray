import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import logger from '../config/logger.js';

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendConfirmationEmail = async (msg) => {
  await sgMail.send(msg);
  logger.info('Confirmation email sent successfully.');
};
