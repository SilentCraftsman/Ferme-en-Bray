import path from 'path';
import fs from 'fs';

const invoiceDirectory = path.join(process.cwd(), 'factures');

if (!fs.existsSync(invoiceDirectory)) {
  fs.mkdirSync(invoiceDirectory, { recursive: true });
}

export const getInvoicePath = (orderId) =>
  path.join(invoiceDirectory, `facture-${orderId}.pdf`);
