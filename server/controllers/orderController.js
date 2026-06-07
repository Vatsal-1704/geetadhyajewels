const Order = require("../models/Order");
const Coupon = require("../models/Coupon");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const {
  validateEmail,
  validatePhone,
  validateAddressLine,
  validateCity,
  validateState,
  validatePincode,
  validatePrice,
  validateRequired,
} = require("../utils/validate");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a new order
 * POST /api/orders
 */
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      couponCode,
      itemsPrice,
      shippingPrice,
      discount,
      totalPrice,
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    if (!deliveryMethod || !["standard", "express"].includes(deliveryMethod)) {
      return res.status(400).json({ message: "Invalid delivery method" });
    }

    if (!paymentMethod || !["razorpay", "cod"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    if (typeof totalPrice !== "number" || totalPrice <= 0) {
      return res.status(400).json({ message: "Invalid order total" });
    }

    // Validate shipping address
    const nameValidation = validateRequired(shippingAddress.name, "Recipient name");
    if (!nameValidation.valid) {
      return res.status(400).json({ message: nameValidation.error });
    }

    const phoneValidation = validatePhone(shippingAddress.phone);
    if (!phoneValidation.valid) {
      return res.status(400).json({ message: phoneValidation.error });
    }

    const addr1Validation = validateAddressLine(shippingAddress.addressLine1, 1);
    if (!addr1Validation.valid) {
      return res.status(400).json({ message: addr1Validation.error });
    }

    const cityValidation = validateCity(shippingAddress.city);
    if (!cityValidation.valid) {
      return res.status(400).json({ message: cityValidation.error });
    }

    const stateValidation = validateState(shippingAddress.state);
    if (!stateValidation.valid) {
      return res.status(400).json({ message: stateValidation.error });
    }

    const pincodeValidation = validatePincode(shippingAddress.pincode);
    if (!pincodeValidation.valid) {
      return res.status(400).json({ message: pincodeValidation.error });
    }

    // Validate prices
    const itemsPriceValidation = validatePrice(itemsPrice);
    if (!itemsPriceValidation.valid) {
      return res.status(400).json({ message: itemsPriceValidation.error });
    }

    if (shippingPrice < 0) {
      return res.status(400).json({ message: "Shipping price cannot be negative" });
    }

    if (discount < 0) {
      return res.status(400).json({ message: "Discount cannot be negative" });
    }

    // Validate coupon if provided
    let finalCoupon = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      });
      if (coupon && new Date() >= coupon.validFrom && new Date() <= coupon.validTo) {
        finalCoupon = coupon.code;
      }
    }

    // Create order
    const order = await Order.create({
      user: req.user?._id,
      items,
      shippingAddress: {
        name: shippingAddress.name.trim(),
        phone: shippingAddress.phone.replace(/[^\d]/g, ""),
        addressLine1: shippingAddress.addressLine1.trim(),
        addressLine2: shippingAddress.addressLine2 ? shippingAddress.addressLine2.trim() : "",
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim(),
      },
      deliveryMethod,
      paymentMethod,
      couponCode: finalCoupon,
      itemsPrice,
      shippingPrice,
      discount,
      totalPrice,
    });

    // If Razorpay payment, create Razorpay order
    if (paymentMethod === "razorpay") {
      const rzOrder = await razorpay.orders.create({
        amount: totalPrice * 100,
        currency: "INR",
        receipt: order.orderId,
      });
      order.razorpayOrderId = rzOrder.id;
      await order.save();
      return res.status(201).json({
        order,
        razorpayOrderId: rzOrder.id,
        key: process.env.RAZORPAY_KEY_ID,
      });
    }

    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Verify Razorpay payment
 * POST /api/orders/verify-payment
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing required payment verification fields" });
    }

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // Verify signature
    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (sign !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed: Invalid signature" });
    }

    // Find and update order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify order belongs to current user (if user is authenticated)
    if (req.user && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: Order does not belong to this user" });
    }

    // Update payment status
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.product", "name images").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/**
 * Get order by ID
 * GET /api/orders/:orderId
 */
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findOne({ orderId }).populate(
      "items.product",
      "name images slug"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify ownership if user is authenticated
    if (req.user && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: You cannot view this order" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.trackOrder = async (req, res) => {
  try {
    const { orderId, phone } = req.query;
    const order = await Order.findOne({ orderId }).select("orderId orderStatus trackingNumber courierName createdAt expectedDelivery items shippingAddress");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.adminGetOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const q = {};

    // Search by orderId or customer name/email
    if (req.query.search) {
      q.$or = [
        { orderId: { $regex: req.query.search, $options: "i" } }
      ];
    }

    if (req.query.status) q.orderStatus = req.query.status;
    if (req.query.payment) q.paymentMethod = req.query.payment;
    if (req.query.from) q.createdAt = { $gte: new Date(req.query.from) };
    if (req.query.to) q.createdAt = { ...(q.createdAt || {}), $lte: new Date(req.query.to) };

    // If search is present, also search in user name and email (requires aggregation)
    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: "i" };
      const [orders, total] = await Promise.all([
        Order.aggregate([
          { $match: q },
          { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "userDoc" } },
          { $match: {
              $or: [
                { "orderId": searchRegex },
                { "userDoc.name": searchRegex },
                { "userDoc.email": searchRegex }
              ]
            }
          },
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
          { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
          { $project: { "userDoc": 0 } }
        ]),
        Order.aggregate([
          { $match: q },
          { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "userDoc" } },
          { $match: {
              $or: [
                { "orderId": searchRegex },
                { "userDoc.name": searchRegex },
                { "userDoc.email": searchRegex }
              ]
            }
          },
          { $count: "total" }
        ])
      ]);
      const totalCount = total[0]?.total || 0;
      return res.json({ orders, total: totalCount, page, pages: Math.ceil(totalCount / limit) });
    }

    // Standard query without search
    const [orders, total] = await Promise.all([
      Order.find(q).populate("user", "name email").sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit),
      Order.countDocuments(q),
    ]);
    res.json({ orders, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/**
 * Admin: Update order status
 * PUT /api/orders/:id
 */
exports.adminUpdateOrder = async (req, res) => {
  try {
    const { orderStatus, trackingNumber, courierName, paymentStatus, notes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate status if provided
    if (orderStatus) {
      const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
      if (!validStatuses.includes(orderStatus)) {
        return res.status(400).json({
          message: `Invalid order status. Must be one of: ${validStatuses.join(", ")}`,
        });
      }
    }

    // Validate payment status if provided
    if (paymentStatus) {
      const validPaymentStatuses = ["pending", "paid", "failed", "refunded"];
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          message: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(", ")}`,
        });
      }
    }

    // Log status change to history
    if (orderStatus && orderStatus !== order.orderStatus) {
      order.statusHistory.push({
        status: orderStatus,
        changedBy: req.user?._id,
        changedByName: req.user?.name || "Admin",
        timestamp: new Date(),
        notes: notes ? notes.trim() : "",
      });
      order.orderStatus = orderStatus;
      order.lastUpdatedBy = req.user?._id;

      if (orderStatus === "delivered") {
        order.deliveredAt = new Date();
      }
      if (orderStatus === "cancelled") {
        order.cancelledAt = new Date();
      }
    }

    // Update other fields if provided
    if (trackingNumber) {
      order.trackingNumber = trackingNumber.trim();
    }
    if (courierName) {
      order.courierName = courierName.trim();
    }
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const [totalOrders, revenueToday, weeklyRevenue] = await Promise.all([
      Order.countDocuments({ orderStatus: { $ne: "cancelled" } }),
      Order.aggregate([{ $match: { createdAt: { $gte: today }, paymentStatus: "paid" } }, { $group: { _id: null, total: { $sum: "$totalPrice" } } }]),
      Order.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) }, paymentStatus: "paid" } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, revenue: { $sum: "$totalPrice" }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);
    res.json({ totalOrders, revenueToday: revenueToday[0]?.total || 0, weeklyRevenue });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getOrderStats = async (req, res) => {
  try {
    const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    const stats = {};
    const countPromises = statuses.map(status =>
      Order.countDocuments({ orderStatus: status }).then(count => {
        stats[status] = count;
      })
    );
    await Promise.all(countPromises);
    const total = Object.values(stats).reduce((a, b) => a + b, 0);
    res.json({ ...stats, total });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getOrderDetail = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.product", "name images")
      .populate("statusHistory.changedBy", "name");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.exportOrders = async (req, res) => {
  try {
    const { generateOrdersExcel } = require("../utils/orderExport");
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1000; // Max 1000 per export
    const q = {};

    // Apply same filters as adminGetOrders
    if (req.query.search) {
      q.$or = [{ orderId: { $regex: req.query.search, $options: "i" } }];
    }
    if (req.query.status) q.orderStatus = req.query.status;
    if (req.query.payment) q.paymentMethod = req.query.payment;
    if (req.query.from) q.createdAt = { $gte: new Date(req.query.from) };
    if (req.query.to) q.createdAt = { ...(q.createdAt || {}), $lte: new Date(req.query.to) };

    // Get filtered orders with user info
    const orders = await Order.find(q)
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Generate Excel file
    const buffer = await generateOrdersExcel(orders);

    // Set response headers for file download
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="orders_export.xlsx"');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
