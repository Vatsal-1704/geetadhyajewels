import { useState, useRef } from "react";
import { FiUpload, FiX, FiCheck } from "react-icons/fi";
import { uploadImage, isCloudinaryConfigured } from "../../utils/cloudinary";
import { toast } from "react-toastify";
import "./ImageUpload.css";

/**
 * Image Upload Component
 * Handles uploading images to Cloudinary with preview and validation
 *
 * @param {Function} onUpload - Callback when image is uploaded (receives { url, publicId })
 * @param {number} maxSize - Max file size in MB (default: 5)
 * @param {string[]} acceptedFormats - Accepted file types (default: ['image/jpeg', 'image/png', 'image/webp'])
 * @param {string} folder - Cloudinary folder to upload to (e.g., 'geetadhya/products')
 */
export default function ImageUpload({
  onUpload = () => {},
  maxSize = 5,
  acceptedFormats = ["image/jpeg", "image/png", "image/webp"],
  folder = "geetadhya/products",
  label = "Upload Image"
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [error, setError] = useState(null);

  // Check if Cloudinary is configured
  if (!isCloudinaryConfigured()) {
    return (
      <div className="image-upload-error">
        <p>⚠️ Cloudinary is not configured. Please set up your .env file with Cloudinary credentials.</p>
      </div>
    );
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      setError("Invalid file format. Please upload JPEG, PNG, or WebP images.");
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit.`);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    try {
      setUploading(true);
      const result = await uploadImage(file, {
        folder,
        tags: ["product", "uploaded"],
      });

      setUploadedUrl(result.url);
      onUpload(result);
      toast.success("Image uploaded successfully!");

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image. Please try again.");
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setUploadedUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="image-upload">
      {/* Success State */}
      {uploadedUrl && (
        <div className="image-upload-success">
          <div className="image-upload-preview-container">
            <img src={uploadedUrl} alt="Uploaded" className="image-upload-preview-image" />
            <div className="image-upload-success-overlay">
              <FiCheck size={32} className="image-upload-check-icon" />
            </div>
          </div>
          <p className="image-upload-success-text">✓ Image uploaded successfully</p>
          <button onClick={handleReset} className="image-upload-reset-button">
            Upload Another Image
          </button>
        </div>
      )}

      {/* Upload State */}
      {!uploadedUrl && (
        <>
          <label htmlFor="image-upload-input" className="image-upload-label">
            {label}
          </label>

          <div className="image-upload-zone">
            {preview && (
              <div className="image-upload-preview-container">
                <img src={preview} alt="Preview" className="image-upload-preview-image" />
                {uploading && (
                  <div className="image-upload-uploading-overlay">
                    <div className="image-upload-spinner" />
                    <p>Uploading...</p>
                  </div>
                )}
              </div>
            )}

            {!preview && (
              <div className="image-upload-empty">
                <FiUpload size={40} className="image-upload-icon" />
                <p className="image-upload-text">Click to upload or drag and drop</p>
                <p className="image-upload-subtext">PNG, JPG or WebP (max {maxSize}MB)</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              id="image-upload-input"
              type="file"
              accept={acceptedFormats.join(",")}
              onChange={handleFileSelect}
              disabled={uploading}
              className="image-upload-input"
              aria-label={label}
            />
          </div>

          {/* Upload Button */}
          {preview && !uploading && (
            <div className="image-upload-actions">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="image-upload-button-retry"
              >
                Choose Different Image
              </button>
              <button onClick={handleReset} className="image-upload-button-cancel">
                Cancel
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="image-upload-error-message">
              <p>{error}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
