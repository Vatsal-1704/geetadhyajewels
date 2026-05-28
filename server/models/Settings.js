const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  storeName: { type: String, default: "GeetadhyaJewels" },
  tagline: { type: String, default: "Elegant Imitation Jewellery for Every Occasion" },
  email: { type: String, default: "hello@geetadhyajewels.com" },
  phone: { type: String, default: "" },
  whatsapp: { type: String, default: "" },
  instagram: { type: String, default: "@geetadhyajewels" },
  facebook: { type: String, default: "geetadhyajewels" },
  razorpayKey: { type: String, default: "" },
  razorpaySecret: { type: String, default: "" },
  freeShippingThreshold: { type: Number, default: 999 },
  standardShipping: { type: Number, default: 99 },
  expressShipping: { type: Number, default: 199 },
  metaTitle: { type: String, default: "GeetadhyaJewels — Elegant Imitation Jewellery" },
  metaDesc: { type: String, default: "Premium imitation jewellery for every occasion." },
}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);
