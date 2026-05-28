const mongoose = require("mongoose");
require("dotenv").config();

const bannerSchema = new mongoose.Schema({
  type: { type: String, enum: ["hero", "announcement", "sale", "strip"], required: true },
  title: String, subtitle: String, link: String,
  image: String, text: String, bgColor: String,
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  saleEndDate: Date,
}, { timestamps: true });

const Banner = mongoose.model("Banner", bannerSchema);

async function checkBanners() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const banners = await Banner.find();
    console.log("Total banners in DB:", banners.length);
    console.log("Banners:", JSON.stringify(banners, null, 2));
    await mongoose.connection.close();
  } catch (err) {
    console.error("Error:", err.message);
  }
}

checkBanners();
