const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema({
  name: String, phone: String, addressLine1: String, addressLine2: String,
  city: String, state: String, pincode: String, isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  addresses: [addressSchema],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  rewardPoints: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false },
  avatar: { type: String, default: "" },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);
