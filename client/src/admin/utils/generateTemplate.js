import * as XLSX from "xlsx";

export const downloadProductTemplate = () => {
  const workbook = XLSX.utils.book_new();

  const headers = [
    "name",
    "description",
    "price",
    "mrp",
    "category",
    "style",
    "sku",
    "stock_quantity",
    "tags",
    "images"
  ];

  const exampleData = [
    {
      name: "Gold Plated Necklace",
      description: "Beautiful gold plated necklace with intricate design and traditional patterns",
      price: 450,
      mrp: 899,
      category: "Necklaces",
      style: "Gold Plated",
      sku: "GOLD-NECK-001",
      stock_quantity: 15,
      tags: "gold, necklace, traditional, elegant",
      images: "https://example.com/gold-necklace-1.jpg"
    },
    {
      name: "Silver Oxidised Earrings",
      description: "Traditional oxidised silver earrings with artistic craftsmanship",
      price: 299,
      mrp: 599,
      category: "Earrings",
      style: "Oxidised",
      sku: "OXI-EARS-001",
      stock_quantity: 25,
      tags: "silver, oxidised, earrings, vintage",
      images: "https://example.com/silver-earrings-1.jpg"
    },
    {
      name: "Kundan Bracelet",
      description: "Exquisite kundan bracelet with semi-precious stones",
      price: 599,
      mrp: 1299,
      category: "Bracelets",
      style: "Kundan",
      sku: "KUN-BRAC-001",
      stock_quantity: 12,
      tags: "kundan, bracelet, festive, stones",
      images: "https://example.com/kundan-bracelet-1.jpg"
    },
    {
      name: "American Diamond Ring",
      description: "Sparkling American diamond ring perfect for any occasion",
      price: 349,
      mrp: 699,
      category: "Rings",
      style: "American Diamond",
      sku: "AD-RING-001",
      stock_quantity: 30,
      tags: "diamond, ring, sparkle, wedding",
      images: "https://example.com/ad-ring-1.jpg"
    },
    {
      name: "Temple Style Necklace Set",
      description: "Traditional temple style jewelry set with matching earrings",
      price: 799,
      mrp: 1599,
      category: "Necklaces",
      style: "Temple",
      sku: "TEMP-SET-001",
      stock_quantity: 8,
      tags: "temple, set, traditional, festival",
      images: "https://example.com/temple-set-1.jpg"
    }
  ];

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...exampleData.map(row =>
    headers.map(h => row[h])
  )]);

  // Set column widths
  worksheet["!cols"] = [
    { wch: 25 },
    { wch: 40 },
    { wch: 12 },
    { wch: 12 },
    { wch: 15 },
    { wch: 18 },
    { wch: 15 },
    { wch: 15 },
    { wch: 30 },
    { wch: 50 }
  ];

  // Add data validation and comments to headers
  const comments = {
    A1: "Product name (max 200 chars, required)",
    B1: "Product description (optional)",
    C1: "Selling price (required, must be > 0)",
    D1: "Maximum retail price (optional, must be >= price)",
    E1: "Category name (required, must match existing category)",
    F1: "Style: Gold Plated, Oxidised, Kundan, American Diamond, Temple, Silver Plated, Other",
    G1: "Unique SKU identifier (required, max 50 chars)",
    H1: "Stock quantity (required, must be >= 0)",
    I1: "Tags separated by comma (optional)",
    J1: "Image URLs separated by comma (optional)"
  };

  // Apply comments to header cells
  Object.keys(comments).forEach(cell => {
    if (!worksheet[cell]) worksheet[cell] = {};
    worksheet[cell].c = [{ t: comments[cell] }];
  });

  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  XLSX.writeFile(workbook, "product_template.xlsx");
};
