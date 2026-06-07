const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
} = require("../utils/validate");

/**
 * Register a new user
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return res.status(400).json({ message: nameValidation.error });
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({ message: emailValidation.error });
    }

    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.valid) {
      return res.status(400).json({ message: phoneValidation.error });
    }

    const passwordValidation = validatePassword(password, 8, false);
    if (!passwordValidation.valid) {
      return res.status(400).json({ message: passwordValidation.error });
    }

    // Check if email already registered
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: "Email is already registered. Please login or use a different email." });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone.replace(/[^\d]/g, ""),
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({ message: emailValidation.error });
    }

    const passwordValidation = validatePassword(password, 6, true);
    if (!passwordValidation.valid) {
      return res.status(400).json({ message: passwordValidation.error });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if account is blocked
    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get user profile
 * GET /api/auth/profile
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate name if provided
    if (name) {
      const nameValidation = validateName(name);
      if (!nameValidation.valid) {
        return res.status(400).json({ message: nameValidation.error });
      }
      user.name = name.trim();
    }

    // Validate phone if provided
    if (phone) {
      const phoneValidation = validatePhone(phone);
      if (!phoneValidation.valid) {
        return res.status(400).json({ message: phoneValidation.error });
      }
      user.phone = phone.replace(/[^\d]/g, "");
    }

    const updated = await user.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      token: generateToken(updated._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Add address to user
 * POST /api/auth/addresses
 */
exports.addAddress = async (req, res) => {
  try {
    const { name, phone, addressLine1, addressLine2, city, state, pincode } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validation
    const {
      validateAddressLine,
      validateCity,
      validateState,
      validatePincode,
    } = require("../utils/validate");

    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return res.status(400).json({ message: nameValidation.error });
    }

    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.valid) {
      return res.status(400).json({ message: phoneValidation.error });
    }

    const addr1Validation = validateAddressLine(addressLine1, 1);
    if (!addr1Validation.valid) {
      return res.status(400).json({ message: addr1Validation.error });
    }

    const cityValidation = validateCity(city);
    if (!cityValidation.valid) {
      return res.status(400).json({ message: cityValidation.error });
    }

    const stateValidation = validateState(state);
    if (!stateValidation.valid) {
      return res.status(400).json({ message: stateValidation.error });
    }

    const pincodeValidation = validatePincode(pincode);
    if (!pincodeValidation.valid) {
      return res.status(400).json({ message: pincodeValidation.error });
    }

    // If this is default, unset other defaults
    if (req.body.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    // Add new address
    user.addresses.push({
      name: name.trim(),
      phone: phone.replace(/[^\d]/g, ""),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2 ? addressLine2.trim() : "",
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      isDefault: req.body.isDefault || false,
    });

    await user.save();
    res.status(201).json({ message: "Address added successfully", addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Delete address from user
 * DELETE /api/auth/addresses/:id
 */
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addressIndex = user.addresses.findIndex(
      (a) => a._id.toString() === req.params.id
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    user.addresses.splice(addressIndex, 1);
    await user.save();

    res.json({ message: "Address deleted successfully", addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Toggle product in wishlist
 * POST /api/auth/wishlist/:productId
 */
exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const pid = req.params.productId;

    // Validate product ID format
    if (!pid || pid.length !== 24) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const idx = user.wishlist.findIndex((id) => id.toString() === pid);

    if (idx > -1) {
      user.wishlist.splice(idx, 1);
    } else {
      user.wishlist.push(pid);
    }

    await user.save();
    res.json({ message: "Wishlist updated", wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get user wishlist
 * GET /api/auth/wishlist
 */
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
