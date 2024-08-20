// invoiceGenerator.js
import PDFDocument from "pdfkit";
import fs from "fs";
import sgMail from "@sendgrid/mail";

const directory = "C:/Users/giogi/Desktop/factures";
if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true });
}

// Génération de la facture en PDF
export function createInvoice(order, path) {
  let doc = new PDFDocument({ margin: 50 });

  doc.fontSize(20).text("Facture", 50, 50);
  doc.fontSize(10).text(`Date : ${new Date().toLocaleDateString()}`, 50, 80);

  doc.text(`Nom du producteur : ${process.env.PRODUCER_NAME}`, 50, 120);
  doc.text(`Adresse du producteur : ${process.env.PRODUCER_ADDRESS}`, 50, 140);
  doc.text(`Numéro de TVA : ${process.env.PRODUCER_TAX_ID}`, 50, 160);

  doc.text(`Client : ${order.customerName || "N/A"}`, 50, 200);
  doc.text(`Adresse : ${order.customerAddress || "N/A"}`, 50, 220);
  doc.text(`Email : ${order.customerEmail || "N/A"}`, 50, 240);

  doc.text(`\nProduits commandés :`, 50, 280);
  order.items.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.title} - ${item.quantity} x ${item.price} €`,
      50,
      300 + index * 20
    );
  });

  doc.text(`\nTotal : ${order.totalAmount || "N/A"} €`, 50, 380);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

// Envoi de la facture par email
export function sendInvoiceEmail(customerEmail, invoicePath) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: customerEmail,
    from: process.env.EMAIL_USER,
    subject: "Votre facture pour la commande",
    text: "Merci pour votre commande. Veuillez trouver votre facture en pièce jointe.",
    attachments: [
      {
        content: fs.readFileSync(invoicePath).toString("base64"),
        filename: "facture.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Invoice sent successfully");
    })
    .catch((error) => {
      console.error("Error sending invoice:", error);
    });
}
