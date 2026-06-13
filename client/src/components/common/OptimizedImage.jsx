import { useState, useEffect } from "react";
import { getOptimizedImageUrl, getLazyLoadPlaceholder, getResponsiveImageSrcset } from "../../utils/cloudinary";
import "./OptimizedImage.css";

/**
 * Optimized Image Component
 * Handles lazy loading, responsive sizing, and image optimization via Cloudinary
 *
 * @param {string} src - Cloudinary public ID or direct URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} preset - Image preset (e.g., 'productCard', 'productDetail')
 * @param {number} width - Width in pixels (optional)
 * @param {number} height - Height in pixels (optional)
 * @param {string} className - Additional CSS classes
 * @param {object} props - Other img attributes
 */
export default function OptimizedImage({
  src,
  alt = "Image",
  preset = null,
  width = null,
  height = null,
  className = "",
  onLoad = null,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [placeholderUrl, setPlaceholderUrl] = useState(null);

  useEffect(() => {
    if (!src) return;

    try {
      // Check if src is a Cloudinary public ID or direct URL
      const isCloudinaryId = !src.startsWith("http");

      if (isCloudinaryId) {
        // Generate optimized URL from Cloudinary public ID
        const options = preset ? {} : { width: width || 800, height };
        const optimizedUrl = getOptimizedImageUrl(src, options);
        const placeholder = getLazyLoadPlaceholder(src, 50);

        setImageUrl(optimizedUrl);
        setPlaceholderUrl(placeholder);
      } else {
        // Use direct URL (fallback)
        setImageUrl(src);
      }
    } catch (error) {
      console.error("Error generating image URL:", error);
      setImageUrl(src);
    }
  }, [src, preset, width, height]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  if (!imageUrl) {
    return (
      <div
        className={`optimized-image optimized-image-skeleton ${className}`}
        style={{ width, height }}
      >
        <div className="optimized-image-skeleton-content" />
      </div>
    );
  }

  return (
    <div className={`optimized-image-wrapper ${className}`}>
      {/* Placeholder (blurred low-quality image) */}
      {placeholderUrl && !isLoaded && (
        <img
          src={placeholderUrl}
          alt={alt}
          className="optimized-image-placeholder"
          aria-hidden="true"
        />
      )}

      {/* Main image with lazy loading */}
      <img
        src={imageUrl}
        alt={alt}
        loading="lazy"
        className={`optimized-image ${isLoaded ? "loaded" : ""}`}
        onLoad={handleLoad}
        width={width}
        height={height}
        {...props}
      />

      {/* Loading indicator */}
      {!isLoaded && <div className="optimized-image-loading" />}
    </div>
  );
}
