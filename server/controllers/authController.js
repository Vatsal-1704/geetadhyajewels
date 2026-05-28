const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });
    const user = await User.create({ name, email, password, phone });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: "Invalid credentials" });
    if (user.isBlocked) return res.status(403).json({ message: "Account blocked. Contact support." });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, phone, password } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (password) user.password = password;
    const updated = await user.save();
    res.json({ _id: updated._id, name: updated.name, email: updated.email, token: generateToken(updated._id) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.isDefault) user.addresses.forEach(a => a.isDefault = false);
    user.addresses.push(req.body);
    await user.save();
    res.json(user.addresses);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
    await user.save();
    res.json(user.addresses);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const pid = req.params.productId;
    const idx = user.wishlist.indexOf(pid);
    if (idx > -1) user.wishlist.splice(idx, 1);
    else user.wishlist.push(pid);
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user.wishlist);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
