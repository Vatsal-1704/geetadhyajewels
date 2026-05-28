const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String, image: String, price: Number, quantity: Number,
  variant: { color: String, colorHex: String },
});

const statusHistorySchema = new mongoose.Schema({
  status: String,
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  changedByName: String,
  timestamp: { type: Date, default: Date.now },
  notes: String,
}, { _id: true });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderId: { type: String, unique: true },
  items: [orderItemSchema],
  shippingAddress: {
    name: String, phone: String, addressLine1: String, addressLine2: String,
    city: String, state: String, pincode: String,
  },
  deliveryMethod: { type: String, enum: ["standard", "express"], default: "standard" },
  paymentMethod: { type: String, enum: ["razorpay", "cod"], required: true },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  razorpayOrderId: String, razorpayPaymentId: String, razorpaySignature: String,
  itemsPrice: Number, shippingPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 }, couponCode: String, totalPrice: Number,
  orderStatus: { type: String, enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"], default: "pending" },
  trackingNumber: String, courierName: String,
  expectedDelivery: Date, deliveredAt: Date, cancelledAt: Date,
  notes: String,
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  statusHistory: [statusHistorySchema],
}, { timestamps: true });

orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    this.orderId = "GJ" + Date.now() + Math.floor(Math.random() * 1000);
  }
  // Initialize status history on first save
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [{
      status: this.orderStatus,
      changedBy: this.user,
      changedByName: "System",
      timestamp: new Date(),
      notes: "Order created"
    }];
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
