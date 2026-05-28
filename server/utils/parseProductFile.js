const XLSX = require("xlsx");
const { parse } = require("csv-parse/sync");
const Category = require("../models/Category");
const Product = require("../models/Product");

const REQUIRED_FIELDS = ["name", "price", "category", "stock_quantity", "sku"];
const OPTIONAL_FIELDS = ["description", "mrp", "style", "tags", "images", "is_featured", "is_best_seller", "status"];
const VALID_STYLES = ["Gold Plated", "Oxidised", "Kundan", "American Diamond", "Temple", "Silver Plated", "Other"];

exports.parseExcel = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(worksheet);
};

exports.parseCSV = (buffer) => {
  const content = buffer.toString("utf-8");
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
};

exports.parseJSON = (buffer) => {
  const content = buffer.toString("utf-8");
  return JSON.parse(content);
};

exports.lookupCategoryId = async (categoryName) => {
  const category = await Category.findOne({
    $or: [
      { name: { $regex: `^${categoryName}$`, $options: "i" } },
      { slug: categoryName.toLowerCase() }
    ]
  });
  return category ? category._id : null;
};

exports.validateProductRow = async (row, rowIndex, existingSKUs = new Set()) => {
  const errors = [];
  const product = { ...row };

  // Normalize field names (handle both underscore and camelCase)
  if (product.stock_quantity !== undefined) product.stock_quantity = product.stock_quantity;
  if (product.is_featured !== undefined) product.is_featured = product.is_featured;
  if (product.is_best_seller !== undefined) product.is_best_seller = product.is_best_seller;

  // Validate required fields
  for (const field of REQUIRED_FIELDS) {
    const value = row[field] || row[field.replace(/_/g, "")];
    if (!value) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors, row: rowIndex + 2 };
  }

  const name = row.name || row.name;
  const price = parseFloat(row.price || row.price);
  const mrp = row.mrp ? parseFloat(row.mrp) : null;
  const categoryName = row.category || row.category;
  const stockQty = parseInt(row.stock_quantity || row.stock_quantity);
  const sku = (row.sku || row.sku || "").toString().trim();
  const style = row.style || row.style;
  const isFeatured = row.is_featured === true || row.is_featured === "true";
  const isBestSeller = row.is_best_seller === true || row.is_best_seller === "true";
  const status = row.status || "published";

  // Validate name
  if (name && name.length > 200) {
    errors.push("Name exceeds 200 characters");
  }

  // Validate price
  if (isNaN(price) || price <= 0) {
    errors.push("Price must be a positive number");
  }

  // Validate stock quantity
  if (isNaN(stockQty) || stockQty < 0) {
    errors.push("Stock quantity must be a non-negative number");
  }

  // Validate SKU
  if (!sku) {
    errors.push("SKU is required");
  } else if (sku.length > 50) {
    errors.push("SKU exceeds 50 characters");
  } else if (existingSKUs.has(sku)) {
    errors.push("Duplicate SKU in file");
  }

  // Validate category
  if (!categoryName) {
    errors.push("Category is required");
  } else {
    const categoryId = await exports.lookupCategoryId(categoryName);
    if (!categoryId) {
      errors.push(`Category '${categoryName}' not found`);
    } else {
      product.categoryId = categoryId;
    }
  }

  // Validate MRP
  if (mrp && isNaN(mrp)) {
    errors.push("MRP must be a number if provided");
  } else if (mrp && price && mrp < price) {
    errors.push("MRP must be greater than or equal to price");
  }

  // Validate style
  if (style && !VALID_STYLES.includes(style)) {
    errors.push(`Style must be one of: ${VALID_STYLES.join(", ")}`);
  }

  // Validate status
  if (status && !["published", "draft"].includes(status)) {
    errors.push("Status must be 'published' or 'draft'");
  }

  if (errors.length > 0) {
    return { valid: false, errors, row: rowIndex + 2, sku };
  }

  // Check for duplicate SKU in database
  const existingProduct = await Product.findOne({ sku });
  if (existingProduct) {
    errors.push("SKU already exists in database");
    return { valid: false, errors, row: rowIndex + 2, sku };
  }

  // Generate slug from product name
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  // Build valid product object
  const validProduct = {
    name,
    slug,
    price,
    mrp: mrp || price,
    category: product.categoryId,
    stock: stockQty,
    sku,
    description: row.description || "",
    shortDescription: row.shortDescription || "",
    style: style || null,
    isFeatured,
    isBestSeller,
    isNewArrival: true,
    status,
    tags: row.tags ? row.tags.split(",").map(t => t.trim()) : [],
    images: row.images ? row.images.split(",").map(i => i.trim()) : [],
  };

  return { valid: true, product: validProduct, row: rowIndex + 2, sku };
};

exports.validateBatch = async (rows) => {
  const results = [];
  const existingSKUs = new Set();
  const validProducts = [];

  for (let i = 0; i < rows.length; i++) {
    const validation = await exports.validateProductRow(rows[i], i, existingSKUs);

    if (validation.valid) {
      existingSKUs.add(validation.sku);
      validProducts.push(validation.product);
    } else {
      results.push({
        row: validation.row,
        sku: validation.sku || "N/A",
        errors: validation.errors,
      });
    }
  }

  return { validProducts, errors: results };
};
