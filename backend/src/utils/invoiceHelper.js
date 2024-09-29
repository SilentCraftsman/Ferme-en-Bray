import path from 'path';
import fs from 'fs';
import { FACTURES_DIR } from '../config/config.js';

if (!fs.existsSync(FACTURES_DIR)) {
  fs.mkdirSync(FACTURES_DIR, { recursive: true });
}

export const getInvoicePath = (orderId) =>
  path.join(FACTURES_DIR, `facture-${orderId}.pdf`);
