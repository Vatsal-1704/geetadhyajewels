const router = require("express").Router();
const { getDashboard, getCustomers, toggleBlock, approveReview, getPendingReviews, getBanners, createBanner, updateBanner, deleteBanner, getRevenueReport, getBestSellers, getSettings, updateSettings, getCustomerDetail, getCustomerStats, updateCustomer, deleteCustomer, bulkUpdateCustomers } = require("../controllers/adminController");
const { protect, admin } = require("../middleware/auth");

router.use(protect, admin);
router.get("/dashboard", getDashboard);

// Customer routes
router.get("/customers/stats", getCustomerStats);
router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerDetail);
router.put("/customers/:id", updateCustomer);
router.delete("/customers/:id", deleteCustomer);
router.put("/customers/:id/toggle-block", toggleBlock);
router.post("/customers/bulk", bulkUpdateCustomers);

// Reviews
router.get("/reviews/pending", getPendingReviews);
router.post("/reviews/action", approveReview);

// Banners
router.get("/banners", getBanners);
router.post("/banners", createBanner);
router.put("/banners/:id", updateBanner);
router.delete("/banners/:id", deleteBanner);

// Reports & Settings
router.get("/reports/revenue", getRevenueReport);
router.get("/reports/bestsellers", getBestSellers);
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

module.exports = router;
