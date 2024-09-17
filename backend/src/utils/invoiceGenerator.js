import PDFDocument from 'pdfkit';
import fs from 'fs';
import sgMail from '@sendgrid/mail';
import logger from '../config/logger.js';
import {
  EMAIL_USER,
  PRODUCER_ADDRESS,
  PRODUCER_NAME,
  PRODUCER_TAX_ID,
  SENDGRID_API_KEY,
} from '../config/config.js';

// Fonction pour créer une facture
export function createInvoice(order, path) {
  const doc = new PDFDocument({ margin: 50 });

  // Pipe the document to a file
  doc.pipe(fs.createWriteStream(path));

  // Constants for positioning
  const margin = 50;
  const pageWidth = doc.page.width - 2 * margin;

  // En-tête de l'entreprise
  doc.fontSize(16).text('La volaille en Bray', { align: 'left' });

  doc.moveDown(1.2); // Ajoute de l'espace après l'en-tête

  doc
    .fontSize(12)
    .text('24 Rte de Beauvais, 76220 Ferrières-en-Bray', { align: 'left' });
  doc.moveDown(0.2);
  doc.text(`Numéro de TVA : ${PRODUCER_TAX_ID}`, { align: 'left' });

  doc.moveDown(2); // Espacement avant le titre de la facture

  doc.fontSize(20).text('Facture', { align: 'left' });

  doc.moveDown(1.4); // Espacement après le titre de la facture

  // Informations sur la facture
  doc.fontSize(12).text(`Date : ${new Date().toLocaleDateString()}`);
  doc.moveDown(0.2);
  doc.text(`Nom du producteur : ${PRODUCER_NAME}`);
  doc.moveDown(0.2);
  doc.text(`Adresse du producteur : ${PRODUCER_ADDRESS}`);

  doc.moveDown(1.5); // Espacement après les informations du producteur

  // Informations sur le client
  doc.text(`Client : ${order.customerName}`);
  doc.moveDown(0.2);
  doc.text(`Adresse : ${order.customerAddress}`);
  doc.moveDown(0.2);
  doc.text(`Email : ${order.customerEmail}`);

  doc.moveDown(8); // Espace avant le tableau pour le placer vers le milieu

  // Ajout d'un espace avant le tableau
  const tableTop = doc.y;

  // En-tête du tableau avec une bordure
  const table = {
    header: ['Produit', 'Quantité', 'Prix Unitaire', 'Total'],
    rows: order.items.map((item) => [
      item.title,
      item.quantity,
      parseFloat(item.price).toFixed(2) + ' €',
      (item.quantity * parseFloat(item.price)).toFixed(2) + ' €',
    ]),
    columnWidths: [pageWidth * 0.45, 80, 90, 90],
  };

  // Dessiner le tableau
  drawTable(doc, tableTop, table);

  doc.moveDown(2); // Espace après le tableau

  // Ajouter cet espace avant le "Total TTC :"
  doc.moveDown(1.6);

  // Calcul du montant total
  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.price),
    0
  );

  // Section Total
  // Ajout du total et du montant avec un alignement horizontal correct
  const totalLabelX = margin;
  const totalValueX = pageWidth + margin - 90; // Ajuster pour être en ligne avec "Total TTC :"
  const totalY = doc.y;

  doc.fontSize(12).text('Total TTC :', totalLabelX, totalY);
  doc.text(`${totalAmount.toFixed(2)} €`, totalValueX, totalY);

  doc.moveDown(6.5); // Espacement après le total

  // Ajout d'un pied de page avec un mot de remerciement et les informations de contact, étiré sur toute la largeur
  doc.fontSize(15).text('Merci pour votre achat !', margin, doc.y, {
    align: 'center',
    width: pageWidth,
  });

  // Finalisation du document
  doc.end();
}

// Fonction pour dessiner un tableau
function drawTable(doc, startY, table) {
  const { header, rows, columnWidths } = table;
  let y = startY;
  const rowHeight = 30; // Hauteur de chaque ligne de tableau
  const bottomPadding = 15; // Ajout d'un espace supplémentaire en bas de la dernière ligne du tableau

  // Ajuster la taille de la police en fonction du nombre de lignes
  const fontSize = rows.length > 10 ? 10 : 12; // Si plus de 10 lignes, réduire la police
  doc.fontSize(fontSize);

  // Fonction pour dessiner une ligne de tableau
  const drawRow = (row, y) => {
    let x = 50;
    row.forEach((text, i) => {
      doc.text(text, x, y, { width: columnWidths[i], align: 'center' });
      x += columnWidths[i];
    });
  };

  // Dessiner l'en-tête du tableau
  doc
    .fillColor('#f2f2f2')
    .rect(
      50,
      y - 10,
      columnWidths.reduce((a, b) => a + b, 0),
      rowHeight
    )
    .fill();
  doc.fillColor('#000').fontSize(fontSize);

  let x = 50;
  header.forEach((text, i) => {
    doc.text(text, x, y, { width: columnWidths[i], align: 'center' });
    x += columnWidths[i];
  });

  y += rowHeight;

  // Dessiner les lignes du tableau
  rows.forEach((row, index) => {
    // Vérifier si on doit passer à une nouvelle page
    if (y + rowHeight + bottomPadding > doc.page.height - 100) {
      // -100 pour garder une marge en bas
      // Finaliser la bordure du tableau avant de passer à une nouvelle page
      doc.strokeColor('#000').lineWidth(1);
      doc
        .rect(
          50,
          startY - 10,
          columnWidths.reduce((a, b) => a + b, 0),
          y - startY
        )
        .stroke();

      doc.addPage();
      y = 50; // Réinitialiser la position verticale

      // Redessiner l'en-tête du tableau sur la nouvelle page
      doc
        .fillColor('#f2f2f2')
        .rect(
          50,
          y - 10,
          columnWidths.reduce((a, b) => a + b, 0),
          rowHeight
        )
        .fill();
      doc.fillColor('#000').fontSize(fontSize);

      x = 50;
      header.forEach((text, i) => {
        doc.text(text, x, y, { width: columnWidths[i], align: 'center' });
        x += columnWidths[i];
      });

      y += rowHeight;
    }

    drawRow(row, y);
    y += rowHeight; // Ajuster l'espace après chaque ligne de tableau

    // Ajouter une marge supplémentaire après la dernière ligne du tableau de la page
    if (index === rows.length - 1) {
      y += bottomPadding;
    }
  });

  // Dessiner la bordure finale du tableau
  doc.strokeColor('#000').lineWidth(1);
  doc
    .rect(
      50,
      startY - 10,
      columnWidths.reduce((a, b) => a + b, 0),
      y - startY
    )
    .stroke();
}

// Fonction pour envoyer la facture par email
export function sendInvoiceEmail(customerEmail, invoicePath) {
  sgMail.setApiKey(SENDGRID_API_KEY);

  const msg = {
    to: customerEmail,
    from: EMAIL_USER,
    subject: 'Votre facture pour la commande',
    text: 'Merci pour votre commande. Veuillez trouver votre facture en pièce jointe.',
    attachments: [
      {
        content: fs.readFileSync(invoicePath).toString('base64'),
        filename: 'facture.pdf',
        type: 'application/pdf',
        disposition: 'attachment',
      },
    ],
  };

  sgMail
    .send(msg)
    .then(() => {
      logger.info('Invoice sent successfully');
    })
    .catch((error) => {
      console.error('Error sending invoice:', error);
    });
}
