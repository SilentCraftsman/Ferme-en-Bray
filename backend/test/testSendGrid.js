import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: process.env.PRODUCER_EMAIL,
  from: process.env.EMAIL_USER,
  subject: 'Test Email',
  text: 'This is a test email sent from SendGrid.',
  html: '<strong>This is a test email sent from SendGrid.</strong>',
};

sgMail
  .send(msg)
  .then(() => {
    console.log('Test email sent successfully.');
  })
  .catch((error) => {
    console.error('Error sending test email:', error.message);
  });
