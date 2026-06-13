const Product = require("../models/Product");
const { validateRequired, validatePrice, validateStock, validateSKU, validateRating } = require("../utils/validate");

const buildQuery = (reqQuery) => {
  const q = { status: "published" };
  if (reqQuery.category) q.category = reqQuery.category;
  if (reqQuery.style) q.style = reqQuery.style;
  if (reqQuery.minPrice || reqQuery.maxPrice) {
    q.price = {};
    if (reqQuery.minPrice) q.price.$gte = Number(reqQuery.minPrice);
    if (reqQuery.maxPrice) q.price.$lte = Number(reqQuery.maxPrice);
  }
  if (reqQuery.search) q.$text = { $search: reqQuery.search };
  if (reqQuery.isFeatured) q.isFeatured = true;
  if (reqQuery.isBestSeller) q.isBestSeller = true;
  if (reqQuery.isNewArrival) q.isNewArrival = true;
  return q;
};

exports.getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const sortMap = {
      "trending": { isBestSeller: -1, isNewArrival: -1, createdAt: -1 },
      "popularity": { numReviews: -1, rating: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      "newest": { createdAt: -1 },
      "rating": { rating: -1 }
    };
    const sort = sortMap[req.query.sort] || { createdAt: -1 };
    const q = { status: "published" };

    // Handle category slug - convert to ObjectId
    if (req.query.category) {
      const Category = require("../models/Category");
      const cat = await Category.findOne({ slug: req.query.category });
      if (cat) q.category = cat._id;
    }

    if (req.query.style) q.style = req.query.style;
    if (req.query.minPrice || req.query.maxPrice) {
      q.price = {};
      if (req.query.minPrice) q.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) q.price.$lte = Number(req.query.maxPrice);
    }
    if (req.query.search) q.$text = { $search: req.query.search };
    if (req.query.isFeatured) q.isFeatured = true;
    if (req.query.isBestSeller) q.isBestSeller = true;
    if (req.query.isNewArrival) q.isNewArrival = true;

    const [products, total] = await Promise.all([
      Product.find(q).populate("category", "name slug").sort(sort).skip(skip).limit(limit),
      Product.countDocuments(q),
    ]);
    res.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category", "name slug")
      .populate("reviews.user", "name avatar");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/**
 * Admin: Create a new product
 * POST /api/products
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, sku, stock_quantity } = req.body;

    // Validate required fields
    const nameValidation = validateRequired(name, "Product name");
    if (!nameValidation.valid) {
      return res.status(400).json({ message: nameValidation.error });
    }

    const priceValidation = validatePrice(price);
    if (!priceValidation.valid) {
      return res.status(400).json({ message: priceValidation.error });
    }

    const categoryValidation = validateRequired(category, "Category");
    if (!categoryValidation.valid) {
      return res.status(400).json({ message: categoryValidation.error });
    }

    const skuValidation = validateSKU(sku);
    if (!skuValidation.valid) {
      return res.status(400).json({ message: skuValidation.error });
    }

    const stockValidation = validateStock(stock_quantity);
    if (!stockValidation.valid) {
      return res.status(400).json({ message: stockValidation.error });
    }

    // Check for duplicate SKU
    const existingSKU = await Product.findOne({ sku: sku.trim().toUpperCase() });
    if (existingSKU) {
      return res.status(400).json({ message: "A product with this SKU already exists" });
    }

    const product = await Product.create({
      ...req.body,
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Admin: Update product
 * PUT /api/products/:id
 */
exports.updateProduct = async (req, res) => {
  try {
    const { price, stock_quantity, sku } = req.body;

    // Validate if provided
    if (price !== undefined) {
      const priceValidation = validatePrice(price);
      if (!priceValidation.valid) {
        return res.status(400).json({ message: priceValidation.error });
      }
    }

    if (stock_quantity !== undefined) {
      const stockValidation = validateStock(stock_quantity);
      if (!stockValidation.valid) {
        return res.status(400).json({ message: stockValidation.error });
      }
    }

    if (sku) {
      const skuValidation = validateSKU(sku);
      if (!skuValidation.valid) {
        return res.status(400).json({ message: skuValidation.error });
      }

      // Check for duplicate SKU (if different from current)
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (sku.toUpperCase() !== product.sku) {
        const existingSKU = await Product.findOne({ sku: sku.trim().toUpperCase() });
        if (existingSKU) {
          return res.status(400).json({ message: "A product with this SKU already exists" });
        }
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        ...(sku && { sku: sku.trim().toUpperCase() }),
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/**
 * Add review to product
 * POST /api/products/:id/reviews
 */
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Validate rating
    const ratingValidation = validateRating(rating);
    if (!ratingValidation.valid) {
      return res.status(400).json({ message: ratingValidation.error });
    }

    // Validate comment if provided
    if (comment && comment.length > 500) {
      return res.status(400).json({ message: "Review comment must not exceed 500 characters" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // Add review
    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating,
      comment: comment || "",
    });

    // Update rating
    const approvedReviews = product.reviews.filter((r) => r.isApproved);
    product.numReviews = approvedReviews.length;
    product.rating =
      approvedReviews.length > 0
        ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
        : 0;

    await product.save();

    res.status(201).json({
      message: "Review added successfully and is pending approval",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSimilarProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const similar = await Product.find({
      category: product.category, _id: { $ne: product._id }, status: "published",
    }).limit(6).populate("category", "name");
    res.json(similar);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.adminGetProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const q = {};
    if (req.query.search) q.name = { $regex: req.query.search, $options: "i" };
    if (req.query.status) q.status = req.query.status;
    if (req.query.category) q.category = req.query.category;
    const [products, total] = await Promise.all([
      Product.find(q).populate("category", "name").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(q),
    ]);
    res.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.bulkCreateProducts = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { parseExcel, parseCSV, parseJSON, validateBatch } = require("../utils/parseProductFile");
    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();

    let rows = [];
    try {
      if (fileExtension === "xlsx" || fileExtension === "xls") {
        rows = parseExcel(req.file.buffer);
      } else if (fileExtension === "csv") {
        rows = parseCSV(req.file.buffer);
      } else if (fileExtension === "json") {
        rows = parseJSON(req.file.buffer);
      } else {
        return res.status(400).json({ message: "Invalid file format. Supported: xlsx, csv, json" });
      }
    } catch (parseErr) {
      return res.status(400).json({ message: "File parse error: " + parseErr.message });
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: "File contains no valid data rows" });
    }

    if (rows.length > 500) {
      return res.status(400).json({ message: "Batch size exceeds 500 products. Please split into multiple uploads." });
    }

    const { validProducts, errors } = await validateBatch(rows);

    if (validProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid products to upload",
        summary: { total: rows.length, created: 0, skipped: rows.length },
        errors
      });
    }

    // Use transaction for atomic insert
    const session = await Product.startSession();
    session.startTransaction();

    try {
      const created = await Product.insertMany(validProducts, { session });

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        success: true,
        summary: {
          total: rows.length,
          created: created.length,
          skipped: errors.length
        },
        errors,
        createdProductIds: created.map(p => p._id)
      });
    } catch (insertErr) {
      await session.abortTransaction();
      session.endSession();
      throw insertErr;
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
