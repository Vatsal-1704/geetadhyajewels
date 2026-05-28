const router = require("express").Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview, getSimilarProducts, adminGetProducts, bulkCreateProducts } = require("../controllers/productController");
const { protect, admin } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");
const multer = require("multer");

const fileUpload = multer({ storage: multer.memoryStorage() });

router.get("/", getProducts);
router.get("/admin/all", protect, admin, adminGetProducts);
router.post("/bulk-upload", protect, admin, fileUpload.single("file"), bulkCreateProducts);
router.post("/", protect, admin, createProduct);
router.get("/:slug", getProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.post("/:id/reviews", protect, addReview);
router.get("/:id/similar", getSimilarProducts);
router.post("/upload-image", protect, admin, upload.array("images", 10), (req, res) => {
  res.json({ images: req.files.map(f => f.path) });
});

module.exports = router;
