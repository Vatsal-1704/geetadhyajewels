const router = require("express").Router();
const { validateCoupon, adminGetCoupons, adminCreateCoupon, adminUpdateCoupon, adminDeleteCoupon } = require("../controllers/couponController");
const { protect, admin } = require("../middleware/auth");

router.post("/validate", validateCoupon);
router.get("/admin", protect, admin, adminGetCoupons);
router.post("/admin", protect, admin, adminCreateCoupon);
router.put("/admin/:id", protect, admin, adminUpdateCoupon);
router.delete("/admin/:id", protect, admin, adminDeleteCoupon);

module.exports = router;
