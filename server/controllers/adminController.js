const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Banner = require("../models/Banner");
const Category = require("../models/Category");
const Settings = require("../models/Settings");

exports.getDashboard = async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const [totalOrders, totalProducts, totalCustomers, revenueAgg, recentOrders, lowStock, weekRevenue] = await Promise.all([
      Order.countDocuments({ orderStatus: { $ne: "cancelled" } }),
      Product.countDocuments({ status: "published" }),
      User.countDocuments({ role: "customer" }),
      Order.aggregate([{ $match: { paymentStatus: "paid", createdAt: { $gte: today } } }, { $group: { _id: null, total: { $sum: "$totalPrice" } } }]),
      Order.find().populate("user", "name email").sort({ createdAt: -1 }).limit(5),
      Product.find({ $expr: { $lte: ["$stock", "$lowStockThreshold"] }, status: "published" }).select("name stock lowStockThreshold images"),
      Order.aggregate([
        { $match: { paymentStatus: "paid", createdAt: { $gte: new Date(Date.now() - 30*24*60*60*1000) } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, revenue: { $sum: "$totalPrice" }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);
    res.json({ stats: { totalOrders, totalProducts, totalCustomers, todayRevenue: revenueAgg[0]?.total || 0 }, recentOrders, lowStock, weekRevenue });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getCustomers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const q = { role: "customer" };

    console.log("📊 getCustomers Called with:", { page, limit, sortBy, sortOrder, search: req.query.search, status: req.query.status });

    // Search by name, email, or phone
    if (req.query.search) {
      q.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
        { phone: { $regex: req.query.search, $options: "i" } }
      ];
    }

    // Filter by status
    if (req.query.status) {
      if (req.query.status === "active") q.isBlocked = false;
      if (req.query.status === "blocked") q.isBlocked = true;
    }

    // Filter by join date range
    if (req.query.dateFrom || req.query.dateTo) {
      q.createdAt = {};
      if (req.query.dateFrom) q.createdAt.$gte = new Date(req.query.dateFrom);
      if (req.query.dateTo) q.createdAt.$lte = new Date(req.query.dateTo);
    }

    // Get customers with order aggregation
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const customers = await User.aggregate([
      { $match: q },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "user",
          as: "orders"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
          isBlocked: 1,
          createdAt: 1,
          avatar: 1,
          addresses: 1,
          rewardPoints: 1,
          wishlist: 1,
          totalOrders: { $size: "$orders" },
          totalSpent: { $sum: "$orders.totalPrice" }
        }
      },
      { $sort: sortObj },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);

    const total = await User.countDocuments(q);

    console.log("✅ Customers Found:", customers.length, "out of", total, "total");

    res.json({
      customers,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error("❌ getCustomers Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.toggleBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isBlocked = !user.isBlocked; await user.save();
    res.json({ isBlocked: user.isBlocked });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.approveReview = async (req, res) => {
  try {
    const { productId, reviewId, action } = req.body;
    const product = await Product.findById(productId);
    const review = product.reviews.id(reviewId);
    if (action === "approve") {
      review.isApproved = true;
      const approved = product.reviews.filter(r => r.isApproved);
      product.numReviews = approved.length;
      product.rating = approved.reduce((a, r) => a + r.rating, 0) / approved.length;
    } else if (action === "reply") { review.adminReply = req.body.reply; }
    else { product.reviews = product.reviews.filter(r => r._id.toString() !== reviewId); }
    await product.save(); res.json({ message: "Done" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getPendingReviews = async (req, res) => {
  try {
    const products = await Product.find({ "reviews.isApproved": false }).select("name reviews").populate("reviews.user", "name");
    const pending = [];
    products.forEach(p => p.reviews.filter(r => !r.isApproved).forEach(r => pending.push({ ...r.toObject(), productId: p._id, productName: p.name })));
    res.json(pending);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getBanners = async (req, res) => { try { res.json(await Banner.find().sort({ displayOrder: 1 })); } catch (err) { res.status(500).json({ message: err.message }); } };
exports.createBanner = async (req, res) => { try { res.status(201).json(await Banner.create(req.body)); } catch (err) { res.status(400).json({ message: err.message }); } };
exports.updateBanner = async (req, res) => { try { res.json(await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { res.status(400).json({ message: err.message }); } };
exports.deleteBanner = async (req, res) => { try { await Banner.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (err) { res.status(500).json({ message: err.message }); } };

exports.getRevenueReport = async (req, res) => {
  try {
    const { from, to, group } = req.query;
    const fmt = group === "month" ? "%Y-%m" : group === "week" ? "%Y-%U" : "%Y-%m-%d";
    const data = await Order.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: new Date(from), $lte: new Date(to) } } },
      { $group: { _id: { $dateToString: { format: fmt, date: "$createdAt" } }, revenue: { $sum: "$totalPrice" }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getSettings = async (req, res) => {
  try {
    let s = await Settings.findOne();
    if (!s) s = await Settings.create({});
    res.json(s);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateSettings = async (req, res) => {
  try {
    let s = await Settings.findOne();
    if (!s) s = await Settings.create(req.body);
    else { Object.assign(s, req.body); await s.save(); }
    res.json(s);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getBestSellers = async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      { $group: { _id: "$items.product", totalSold: { $sum: "$items.quantity" }, revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } },
      { $sort: { totalSold: -1 } }, { $limit: 10 },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
    ]);
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get customer detail with full profile
exports.getCustomerDetail = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select("-password").populate("wishlist", "name price images rating");
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // Get orders with populated product details
    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 }).populate("items.product", "name images");

    // Get all reviews submitted by customer
    const Product = require("../models/Product");
    const reviewedProducts = await Product.find({ "reviews.user": req.params.id }).select("_id name reviews");
    const reviews = [];
    reviewedProducts.forEach(product => {
      product.reviews.filter(r => r.user.toString() === req.params.id).forEach(review => {
        reviews.push({
          ...review.toObject(),
          productId: product._id,
          productName: product.name
        });
      });
    });

    const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    res.json({
      customer,
      orders,
      reviews: reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      wishlist: customer.wishlist || [],
      totalOrders: orders.length,
      totalSpent,
      totalRewardPoints: customer.rewardPoints || 0,
      accountCreatedAt: customer.createdAt,
      lastOrderAt: orders.length > 0 ? orders[0].createdAt : null
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get customer statistics for dashboard
exports.getCustomerStats = async (req, res) => {
  try {
    const [totalCustomers, activeCustomers, blockedCustomers, newThisMonth] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "customer", isBlocked: false }),
      User.countDocuments({ role: "customer", isBlocked: true }),
      User.countDocuments({
        role: "customer",
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      })
    ]);

    const orderStats = await Order.aggregate([
      { $group: { _id: null, avgSpent: { $avg: "$totalPrice" }, totalRevenue: { $sum: "$totalPrice" } } }
    ]);

    const customersWithOrders = await Order.distinct("user");
    const customersNoOrders = totalCustomers - customersWithOrders.length;

    res.json({
      totalCustomers,
      activeCustomers,
      blockedCustomers,
      newThisMonth,
      customersWithOrders: customersWithOrders.length,
      customersNoOrders,
      avgLifetimeValue: orderStats[0]?.avgSpent || 0,
      totalRevenue: orderStats[0]?.totalRevenue || 0
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Bulk update customers (status, tags, etc.)
exports.bulkUpdateCustomers = async (req, res) => {
  try {
    const { customerIds, action, value } = req.body;
    if (!customerIds?.length) return res.status(400).json({ message: "No customers selected" });

    let updateObj = {};
    if (action === "block") updateObj.isBlocked = true;
    if (action === "unblock") updateObj.isBlocked = false;
    if (action === "setRewards") updateObj.rewardPoints = value;

    const result = await User.updateMany({ _id: { $in: customerIds } }, updateObj);
    res.json({ message: `Updated ${result.modifiedCount} customers` });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
