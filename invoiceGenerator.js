import PDFDocument from "pdfkit";
import fs from "fs";
import sgMail from "@sendgrid/mail";

// Assurez-vous que le répertoire des factures existe
const directory = "C:/Users/giogi/Desktop/factures";
if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true });
}

// Génération de la facture en PDF
export function createInvoice(order, path) {
  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(fs.createWriteStream(path));

  doc.fontSize(20).text("Facture", { align: "center" });

  doc.fontSize(12).text(`Date : ${new Date().toLocaleDateString()}`);
  doc.text(`Nom du producteur : ${process.env.PRODUCER_NAME}`);
  doc.text(`Adresse du producteur : ${process.env.PRODUCER_ADDRESS}`);
  doc.text(`Numéro de TVA : ${process.env.PRODUCER_TAX_ID}`);

  doc.text(`\nClient : ${order.customerName}`);
  doc.text(`Adresse : ${order.customerAddress}`);
  doc.text(`Email : ${order.customerEmail}`);

  doc.text(`\nProduits commandés :`);
  order.items.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.title} - ${item.quantity} x ${item.price} €`
    );
  });

  // Calcul du coût total
  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.price),
    0
  );

  doc.text(`\nTotal : ${totalAmount.toFixed(2)} €`);

  doc.end();
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
