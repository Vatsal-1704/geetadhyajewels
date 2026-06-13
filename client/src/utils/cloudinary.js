/**
 * Cloudinary Image Management Utility
 * Handles image uploads, optimization, and URL generation
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Uploaded image data
 */
export async function uploadImage(file, options = {}) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary credentials not configured");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  // Optional: Add tags for organization
  if (options.tags) {
    formData.append("tags", options.tags.join(","));
  }

  // Optional: Add folder
  if (options.folder) {
    formData.append("folder", options.folder);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
    };
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
}

/**
 * Generate optimized Cloudinary image URL
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized image URL
 */
export function getOptimizedImageUrl(publicId, options = {}) {
  if (!CLOUD_NAME) {
    throw new Error("Cloudinary cloud name not configured");
  }

  const {
    width = 800,
    height = null,
    quality = "auto",
    format = "auto",
    crop = "fill",
    gravity = "auto",
  } = options;

  let transformations = [];

  // Width
  if (width) {
    transformations.push(`w_${width}`);
  }

  // Height
  if (height) {
    transformations.push(`h_${height}`);
    transformations.push(`c_${crop}`);
    transformations.push(`g_${gravity}`);
  }

  // Quality and format for optimization
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  // Responsive images (add quality hint)
  transformations.push("fl_progressive");

  const transformString = transformations.join(",");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformString}/${publicId}`;
}

/**
 * Generate responsive image srcset
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Options for image generation
 * @returns {string} - srcset string for responsive images
 */
export function getResponsiveImageSrcset(publicId, options = {}) {
  if (!CLOUD_NAME) {
    throw new Error("Cloudinary cloud name not configured");
  }

  const sizes = [320, 640, 960, 1280, 1920];
  const srcset = sizes
    .map((size) => {
      const url = getOptimizedImageUrl(publicId, { ...options, width: size });
      return `${url} ${size}w`;
    })
    .join(", ");

  return srcset;
}

/**
 * Generate lazy load placeholder (low quality image)
 * @param {string} publicId - Cloudinary public ID
 * @param {number} width - Placeholder width
 * @returns {string} - Low quality placeholder URL
 */
export function getLazyLoadPlaceholder(publicId, width = 100) {
  return getOptimizedImageUrl(publicId, {
    width,
    quality: 20,
    format: "jpg",
  });
}

/**
 * Delete image from Cloudinary (requires API key on backend)
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Delete response
 */
export async function deleteImage(publicId) {
  // This should be done on backend for security
  // Call your backend endpoint instead
  console.warn("Image deletion should be handled on the backend");
}

/**
 * Image transformation presets for common use cases
 */
export const imagePresets = {
  thumbnail: { width: 150, height: 150, crop: "thumb" },
  productCard: { width: 300, height: 400 },
  productDetail: { width: 800, height: 1000 },
  heroBanner: { width: 1920, height: 600 },
  categoryIcon: { width: 200, height: 200 },
  testimonialAvatar: { width: 100, height: 100, crop: "thumb" },
  instagram: { width: 500, height: 500 },
  thumbnail_mobile: { width: 150, height: 150 },
  productCard_mobile: { width: 200, height: 300 },
};

/**
 * Batch upload multiple images
 * @param {File[]} files - Array of image files
 * @param {Object} options - Upload options
 * @returns {Promise<Object[]>} - Array of uploaded image data
 */
export async function uploadMultipleImages(files, options = {}) {
  try {
    const uploads = files.map((file) => uploadImage(file, options));
    return await Promise.all(uploads);
  } catch (error) {
    console.error("Batch upload error:", error);
    throw error;
  }
}

/**
 * Check if Cloudinary is properly configured
 * @returns {boolean} - True if configured
 */
export function isCloudinaryConfigured() {
  return !!(CLOUD_NAME && UPLOAD_PRESET);
}
