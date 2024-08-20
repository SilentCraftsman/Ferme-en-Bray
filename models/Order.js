import mongoose from "mongoose";

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
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
