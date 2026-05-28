const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: String,
  image: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
