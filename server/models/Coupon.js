const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ["percentage", "flat", "free_shipping", "buy2get1"], required: true },
  value: { type: Number, default: 0 },
  minOrderValue: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  usageLimit: { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  description: String,
}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);
