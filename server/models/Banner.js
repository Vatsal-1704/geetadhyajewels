const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  type: { type: String, enum: ["hero", "announcement", "sale", "strip"], required: true },
  title: String, subtitle: String, link: String,
  image: String, text: String, bgColor: String,
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  saleEndDate: Date,
}, { timestamps: true });

module.exports = mongoose.model("Banner", bannerSchema);
