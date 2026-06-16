const router = require("express").Router();
const { createOrder, verifyPayment, getMyOrders, getOrderById, trackOrder, adminGetOrders, adminUpdateOrder, getAnalytics, getOrderStats, getOrderDetail, exportOrders } = require("../controllers/orderController");
const { protect, admin } = require("../middleware/auth");

router.post("/", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);
router.get("/track", trackOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/admin/stats", protect, admin, getOrderStats);
router.get("/admin/analytics", protect, admin, getAnalytics);
router.get("/admin/export", protect, admin, exportOrders);
router.get("/admin/:id/detail", protect, admin, getOrderDetail);
router.get("/admin", protect, admin, adminGetOrders);
router.get("/:orderId", getOrderById);
router.put("/admin/:id", protect, admin, adminUpdateOrder);

module.exports = router;
