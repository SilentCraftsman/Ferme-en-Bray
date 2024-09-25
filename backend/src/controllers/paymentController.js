import {
  adminFeePercentage,
  fixedStripeFeeInCent,
  stripe,
  stripeFeePercentage,
} from '../config/stripeConfig.js';
import { ordersCollection } from '../services/orderService.js';
import { createInvoice, sendInvoiceEmail } from '../utils/invoiceGenerator.js';
import sgMail from '@sendgrid/mail';
import { ObjectId } from 'mongodb';
import { getInvoicePath } from '../utils/invoiceHelper.js';
import logger from '../config/logger.js';
import {
  EMAIL_USER,
  PRODUCER_ACCOUNT_ID,
  PRODUCER_EMAIL,
  SENDGRID_API_KEY,
  FRONTEND_BASE_URL,
} from '../config/config.js';

sgMail.setApiKey(SENDGRID_API_KEY);

export const createCheckoutSession = async (req, res) => {
  const {
    items,
    pickupDay,
    pickupTime,
    customerName,
    customerEmail,
    customerAddress,
  } = req.body;

  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    !customerName ||
    !customerEmail
  ) {
    console.error('Invalid request data:', req.body);
    return res.status(400).send('Bad Request: Invalid request data');
  }

  try {
    const lineItems = items.map((item) => {
      const selectedVariant = item.selectedVariant;
      let updatedTitle = item.title;

      if (selectedVariant) {
        updatedTitle = updatedTitle.replace(
          /(\d+(\.\d+)?kg)/,
          selectedVariant.weight
        );
      }

      const unitAmount = Math.round(
        parseFloat(
          selectedVariant
            ? selectedVariant.price
            : item.price.replace('€', '').replace(',', '.')
        ) * 100
      );

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: updatedTitle,
            images: [item.image],
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    const totalAmount = lineItems.reduce(
      (sum, item) => sum + item.price_data.unit_amount * item.quantity,
      0
    );

    // Calculate the application fee amount including Stripe fee
    const stripeFee = Math.round(
      totalAmount * stripeFeePercentage + fixedStripeFeeInCent
    );
    const remainingAmount = totalAmount - stripeFee;
    const adminFee = Math.round(remainingAmount * adminFeePercentage);
    const applicationFeeAmount = stripeFee + adminFee;

    logger.info(`Total amount: ${totalAmount}`);
    logger.info(`Stripe fee: ${stripeFee}`);
    logger.info(`Admin fee: ${adminFee}`);
    logger.info(`Application fee amount: ${applicationFeeAmount}`);

    // Stockage des détails de la commande dans MongoDB
    const order = {
      items,
      pickupDay,
      pickupTime,
      customerName,
      customerEmail,
      customerAddress,
      createdAt: new Date(),
    };

    const result = await ordersCollection.insertOne(order);
    const orderId = result.insertedId;

    // Création de la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${FRONTEND_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_BASE_URL}/cancel`,
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        on_behalf_of: PRODUCER_ACCOUNT_ID,
        transfer_data: {
          destination: PRODUCER_ACCOUNT_ID,
        },
      },
      customer_email: customerEmail,
      metadata: {
        order_id: orderId.toString(),
        pickupDay,
        pickupTime,
      },
      billing_address_collection: 'required',
      customer_creation: 'always',
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).send(`Internal Server Error: ${err.message}`);
  }
};

export const handlePaymentSuccess = async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    console.error('Missing session_id in query parameters');
    return res.status(400).send('Bad Request: Missing session_id');
  }

  let session;

  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch (err) {
    // check if contains No such checkout.session
    if (err.message.includes('No such checkout.session')) {
      logger.error(`Session not found: ${session_id}`);
      return res.status(404).send('Session not found');
    }

    throw err;
  }

  if (!session) {
    console.error('Session not found');
    return res.status(404).send('Session not found');
  }

  if (session.payment_status === 'paid') {
    const order = await ordersCollection.findOne({
      _id: new ObjectId(session.metadata.order_id),
    });

    if (!order) {
      console.error('Order not found');
      return res.status(404).send('Order not found');
    }

    const customerName = session.customer_details.name || order.customerName;
    const customerEmail = session.customer_details.email || order.customerEmail;
    const customerAddress = order.customerAddress;

    const itemsHtml = order.items
      .map((item) => {
        const variantInfo = item.selectedVariant
          ? `${item.selectedVariant.type} - ${item.selectedVariant.weight}`
          : 'Sans variante';
        return `
          <tr>
            <td>${item.title || 'Sans description'}</td>
            <td>${parseFloat(item.price).toFixed(2)} €</td>
            <td>${item.quantity}</td>
            <td>${variantInfo}</td>
          </tr>`;
      })
      .join('');

    const totalHtml = `
        <tr>
          <td colspan="4"><strong>Total</strong></td>
          <td><strong>${(session.amount_total / 100).toFixed(2)} €</strong></td>
        </tr>`;

    const msg = {
      to: PRODUCER_EMAIL,
      from: EMAIL_USER,
      subject: 'Confirmation de votre commande',
      html: `
          <strong>Le client de la commande : ${customerName}</strong><br>
          <strong>Le nom et prénom qui figure sur la carte bancaire qui a payé de la commande : ${customerName}</strong><br>
          Le retrait de la commande par le client est prévu pour ${session.metadata.pickupDay} à ${session.metadata.pickupTime}.<br><br>
          <strong>Email du client :</strong> ${customerEmail}<br>
          <strong>Adresse du client :</strong> ${customerAddress}<br><br>
          <table border="1" cellpadding="5" cellspacing="0">
            <thead>
              <tr>
                <th>Description</th>
                <th>Prix</th>
                <th>Quantité</th>
                <th>Variante</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              ${totalHtml}
            </tbody>
          </table>`,
    };

    await sgMail.send(msg);
    logger.info('Confirmation email sent successfully.');

    const invoicePath = getInvoicePath(session.metadata.order_id);

    createInvoice(order, invoicePath);

    setTimeout(() => {
      sendInvoiceEmail(customerEmail, invoicePath);
    }, 1000);
  } else {
    logger.info('Payment not completed. Email not sent.');

    return res.status(400).send('Payment not completed');
  }

  res.status(200).send('Success');
};
