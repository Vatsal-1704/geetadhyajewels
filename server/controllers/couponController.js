const Coupon = require("../models/Coupon");

exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderValue } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ message: "Invalid coupon code" });
    if (new Date() < coupon.validFrom || new Date() > coupon.validTo) return res.status(400).json({ message: "Coupon expired" });
    if (orderValue < coupon.minOrderValue) return res.status(400).json({ message: `Min order ₹${coupon.minOrderValue} required` });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: "Coupon usage limit reached" });
    let discountAmount = 0;
    if (coupon.type === "percentage") { discountAmount = (orderValue * coupon.value) / 100; if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount); }
    else if (coupon.type === "flat") discountAmount = coupon.value;
    else if (coupon.type === "free_shipping") discountAmount = 0;
    res.json({ valid: true, coupon: { code: coupon.code, type: coupon.type, value: coupon.value, description: coupon.description }, discountAmount });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.adminGetCoupons = async (req, res) => { try { res.json(await Coupon.find().sort({ createdAt: -1 })); } catch (err) { res.status(500).json({ message: err.message }); } };
exports.adminCreateCoupon = async (req, res) => { try { res.status(201).json(await Coupon.create(req.body)); } catch (err) { res.status(400).json({ message: err.message }); } };
exports.adminUpdateCoupon = async (req, res) => { try { res.json(await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { res.status(400).json({ message: err.message }); } };
exports.adminDeleteCoupon = async (req, res) => { try { await Coupon.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (err) { res.status(500).json({ message: err.message }); } };
