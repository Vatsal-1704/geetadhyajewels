const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String, rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String, isApproved: { type: Boolean, default: false },
  adminReply: String,
}, { timestamps: true });

const variantSchema = new mongoose.Schema({
  color: String, colorHex: String, images: [String],
  stock: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  shortDescription: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  style: { type: String, enum: ["Gold Plated", "Oxidised", "Kundan", "American Diamond", "Temple", "Silver Plated", "Other"] },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  images: [String],
  variants: [variantSchema],
  stock: { type: Number, default: 0 },
  sku: String,
  tags: [String],
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: true },
  status: { type: String, enum: ["published", "draft"], default: "published" },
  seoTitle: String, seoDescription: String,
  lowStockThreshold: { type: Number, default: 5 },
}, { timestamps: true });

productSchema.pre("save", function (next) {
  this.discount = Math.round(((this.mrp - this.price) / this.mrp) * 100);
  next();
});

// Text indexes for search functionality
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, style: 1, price: 1 });
productSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Product", productSchema);
