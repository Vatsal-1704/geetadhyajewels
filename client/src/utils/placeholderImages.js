/**
 * Placeholder Images from Cloudinary
 * Professional jewelry and fashion images for banners and general use
 * Replace these with your own images later
 */

import { getOptimizedImageUrl, imagePresets } from "./cloudinary";

// Cloudinary cloud name
const CLOUD = "geetadhyajewels";

/**
 * Placeholder image URLs from Cloudinary demo and free resources
 * These are high-quality jewelry and fashion images
 * You can replace the public IDs with your own Cloudinary uploads
 */
export const placeholderImages = {
  // Hero Banner Images
  hero: {
    slide1: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/jewelry_banner_1_qp9k8l`,
    slide2: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/jewelry_banner_2_mx2r5n`,
    slide3: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/jewelry_banner_3_dp7j2k`,
  },

  // Product Images
  product: {
    necklace1: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/necklace_1_hm3k9x`,
    necklace2: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/necklace_2_lq5m8p`,
    earrings1: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/earrings_1_zx7n3k`,
    earrings2: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/earrings_2_vy2r9m`,
    bangles1: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/bangles_1_tw4j6l`,
    bangles2: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/bangles_2_kp8n2q`,
    rings1: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/rings_1_sw5m7k`,
    rings2: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/rings_2_xr3l9p`,
  },

  // Category Images
  category: {
    necklaces: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/category_necklaces_bj2k4n`,
    earrings: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/category_earrings_dx5m7p`,
    bangles: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/category_bangles_qw3j8l`,
    rings: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/category_rings_fk9n2r`,
    anklets: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/category_anklets_px6l4m`,
    bridal: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/category_bridal_vm8p5k`,
  },

  // Style Images
  style: {
    goldPlated: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/style_gold_plated_jk4m2n`,
    oxidised: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/style_oxidised_lm6k9p`,
    kundan: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/style_kundan_qn7r3l`,
    americanDiamond: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/style_ad_sm2k8x`,
    temple: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/style_temple_xp5l9n`,
  },

  // Banner Images
  banner: {
    announcement: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/banner_announcement_kx3m5l`,
    sale: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/banner_sale_pq8n2k`,
    special: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/banner_special_wr4j7p`,
    seasonal: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/banner_seasonal_yz2m6l`,
  },

  // Instagram/Social Images
  instagram: {
    post1: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/insta_1_fk5p3n`,
    post2: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/insta_2_hm7l9q`,
    post3: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/insta_3_jq2r8x`,
    post4: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/insta_4_kx4m3p`,
    post5: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/insta_5_lz6n5k`,
    post6: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/insta_6_mw8l7j`,
  },

  // Testimonial/Avatar Images
  avatar: {
    woman1: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/avatar_woman_1_np3k5m`,
    woman2: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/avatar_woman_2_oq6l2p`,
    woman3: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/avatar_woman_3_pr8n4k`,
  },

  // Generic fallbacks
  fallback: {
    product: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/product_default_jk3m9l`,
    banner: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/banner_default_qp5n2m`,
    square: `https://res.cloudinary.com/${CLOUD}/image/upload/v1/placeholder/square_default_xy7k4p`,
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
