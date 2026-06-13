/**
 * Placeholder Images from Cloudinary
 * Professional jewelry and fashion images for banners and general use
 * Replace these with your own images later
 */

import { getOptimizedImageUrl, imagePresets } from "./cloudinary";

// Cloudinary cloud name
const CLOUD = "geetadhyajewels";

/**
 * Placeholder image URLs - Real working images
 * Using high-quality jewelry and fashion images
 * You can replace these with your own Cloudinary uploads
 */
export const placeholderImages = {
  // Hero Banner Images - High quality luxury jewelry banners
  hero: {
    slide1: `https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1920&h=600&fit=crop`,
    slide2: `https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1920&h=600&fit=crop`,
    slide3: `https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1920&h=600&fit=crop`,
  },

  // Product Images - Jewelry products
  product: {
    necklace1: `https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=400&fit=crop`,
    necklace2: `https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=300&h=400&fit=crop`,
    earrings1: `https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=400&fit=crop`,
    earrings2: `https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=400&fit=crop`,
    bangles1: `https://images.unsplash.com/photo-1515622141207-5dde32aadeba?w=300&h=400&fit=crop`,
    bangles2: `https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=300&h=400&fit=crop`,
    rings1: `https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=400&fit=crop`,
    rings2: `https://images.unsplash.com/photo-1540632066927-ab7c9ab60908?w=300&h=400&fit=crop`,
  },

  // Category Images - Shop by category
  category: {
    necklaces: `https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=200&fit=crop`,
    earrings: `https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop`,
    bangles: `https://images.unsplash.com/photo-1515622141207-5dde32aadeba?w=200&h=200&fit=crop`,
    rings: `https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=200&fit=crop`,
    anklets: `https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop`,
    bridal: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop`,
  },

  // Style Images
  style: {
    goldPlated: `https://images.unsplash.com/photo-1515562141207-5dde32aadeba?w=300&h=300&fit=crop`,
    oxidised: `https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop`,
    kundan: `https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=300&h=300&fit=crop`,
    americanDiamond: `https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop`,
    temple: `https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop`,
  },

  // Banner Images
  banner: {
    announcement: `https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&h=400&fit=crop`,
    sale: `https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&h=400&fit=crop`,
    special: `https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1200&h=400&fit=crop`,
    seasonal: `https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&h=400&fit=crop`,
  },

  // Instagram/Social Images
  instagram: {
    post1: `https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop`,
    post2: `https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop`,
    post3: `https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=500&h=500&fit=crop`,
    post4: `https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop`,
    post5: `https://images.unsplash.com/photo-1515622141207-5dde32aadeba?w=500&h=500&fit=crop`,
    post6: `https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&h=500&fit=crop`,
  },

  // Testimonial/Avatar Images
  avatar: {
    woman1: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop`,
    woman2: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop`,
    woman3: `https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop`,
  },

  // Generic fallbacks
  fallback: {
    product: `https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=400&fit=crop`,
    banner: `https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&h=400&fit=crop`,
    square: `https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=300&h=300&fit=crop`,
  },
};

/**
 * Get optimized placeholder image URL
 * @param {string} imageKey - Key from placeholderImages object (e.g., 'hero.slide1')
 * @param {string} preset - Image preset name (optional)
 * @returns {string} - Optimized image URL
 */
export function getPlaceholderImage(imageKey, preset = null) {
  const keys = imageKey.split(".");
  let image = placeholderImages;

  for (const key of keys) {
    image = image?.[key];
    if (!image) return placeholderImages.fallback.product;
  }

  if (!image) return placeholderImages.fallback.product;

  // If preset provided, optimize the URL
  if (preset && imagePresets[preset]) {
    // Extract public ID from URL
    const publicId = image.split("/").pop();
    return getOptimizedImageUrl(publicId, imagePresets[preset]);
  }

  return image;
}

/**
 * Get random product placeholder image
 * @returns {string} - Random product image URL
 */
export function getRandomProductImage() {
  const products = Object.values(placeholderImages.product);
  return products[Math.floor(Math.random() * products.length)];
}

/**
 * Get random category image
 * @returns {string} - Random category image URL
 */
export function getRandomCategoryImage() {
  const categories = Object.values(placeholderImages.category);
  return categories[Math.floor(Math.random() * categories.length)];
}

/**
 * Get all placeholder images with their keys
 * Useful for mapping to components
 * @returns {Array} - Array of { key, url } objects
 */
export function getAllPlaceholderImages() {
  const images = [];

  function flatten(obj, prefix = "") {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "string") {
        images.push({ key: fullKey, url: value });
      } else if (typeof value === "object") {
        flatten(value, fullKey);
      }
    });
  }

  flatten(placeholderImages);
  return images;
}

/**
 * Helper function to replace placeholder images later
 * Usage: updateImageInProduction('hero.slide1', 'your_new_cloudinary_id')
 */
export function updateImageInProduction(imageKey, newCloudinaryId) {
  console.warn(`⚠️ TODO: Replace placeholder image "${imageKey}" with "${newCloudinaryId}"`);
  // In production, this would update the database or config
  // For now, it's just a warning for developers
}

export default placeholderImages;
