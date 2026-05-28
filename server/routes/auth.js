const router = require("express").Router();
const { register, login, getProfile, updateProfile, addAddress, deleteAddress, toggleWishlist, getWishlist } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/address", protect, addAddress);
router.delete("/address/:id", protect, deleteAddress);
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:productId", protect, toggleWishlist);

module.exports = router;
