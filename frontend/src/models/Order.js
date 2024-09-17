import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  items: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
      variantId: { type: String },
    },
  ],
  pickupDay: { type: String, required: true },
  pickupTime: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerAddress: { type: String, required: true }, // Ajout de l'adresse
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
