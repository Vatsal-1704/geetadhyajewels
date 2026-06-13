# Placeholder Images Guide - How to Replace With Your Own

**Status:** ✅ Placeholder images set up and working  
**Next Step:** Replace with your real jewelry images when ready

---

## 📋 What's Set Up

All major homepage components now use professional placeholder images from Cloudinary:

- ✅ Hero banner slides (3 images)
- ✅ Product listings (8 product images)
- ✅ Category images (6 categories)
- ✅ Instagram strip (6 images)
- ✅ Testimonial avatars (3 customer avatars)
- ✅ Promotional banners (4 banners)

**All images are:**
- Optimized by Cloudinary (fast loading)
- Responsive across all devices
- Using lazy loading (load only when visible)
- With progressive blur-up effect

---

## 🔄 How to Replace Placeholder Images

### Step 1: Get Your Real Images

You need your jewelry images ready. For example:
- Hero banner images (1920x600px recommended)
- Product images (300x400px for product cards)
- Category images (200x200px for category icons)
- Instagram post images (500x500px)
- Customer avatar images (100x100px)

### Step 2: Upload to Cloudinary

**Option A: Upload via Dashboard**
1. Go to Cloudinary dashboard: https://cloudinary.com/console
2. Click "Media Library" (folder icon)
3. Click "Upload" button
4. Drag & drop your images
5. Note the "Public ID" for each image

**Option B: Upload via Website (Using ImageUpload Component)**
1. Go to admin product creation
2. Use the ImageUpload component
3. Upload your image
4. Copy the Cloudinary URL

### Step 3: Update placeholderImages.js

**File:** `client/src/utils/placeholderImages.js`

**Find the image you want to replace:**
```javascript
hero: {
  slide1: `https://res.cloudinary.com/geetadhyajewels/image/upload/v1/placeholder/jewelry_banner_1_qp9k8l`,
  slide2: `https://res.cloudinary.com/geetadhyajewels/image/upload/v1/placeholder/jewelry_banner_2_mx2r5n`,
  // ... etc
}
```

**Replace with your image's public ID:**
```javascript
hero: {
  slide1: `https://res.cloudinary.com/geetadhyajewels/image/upload/v1/YOUR_PUBLIC_ID`,
  slide2: `https://res.cloudinary.com/geetadhyajewels/image/upload/v1/ANOTHER_PUBLIC_ID`,
  // ... etc
}
```

### Step 4: Save and Deploy

1. Save the file
2. Restart dev server (or it auto-reloads)
3. Check website - images automatically updated!
4. Commit to git with a message like "Update placeholder images with real jewelry photos"

---

## 📁 Image Locations in Code

All placeholder images are managed in ONE FILE:

**File:** `client/src/utils/placeholderImages.js`

**Structure:**
```javascript
placeholderImages = {
  hero: { ... },        // Hero banner slides
  product: { ... },     // Product images
  category: { ... },    // Category icons
  style: { ... },       // Style images (Gold Plated, Oxidised, etc)
  banner: { ... },      // Promotional banners
  instagram: { ... },   // Instagram feed
  avatar: { ... },      // Customer avatars
  fallback: { ... },    // Default fallback images
}
```

---

## 🔍 What Uses Each Image?

### Hero Images (placeholderImages.hero)
- **File:** `client/src/components/home/HeroBanner.jsx`
- **Display:** Full-width banner at top of homepage
- **Size:** 1920x600px (landscape)
- **Components:** 3 slides that rotate

### Product Images (placeholderImages.product)
- **File:** `client/src/components/home/FeaturedProducts.jsx`
- **Display:** Product cards on homepage
- **Size:** 300x400px (portrait)
- **Components:** 8 featured products

### Category Images (placeholderImages.category)
- **File:** `client/src/components/home/ShopByCategory.jsx`
- **Display:** Category grid (Necklaces, Earrings, etc)
- **Size:** 200x200px (square)
- **Components:** 8 category cards

### Instagram Images (placeholderImages.instagram)
- **File:** `client/src/components/home/InstagramStrip.jsx`
- **Display:** Instagram feed section
- **Size:** 500x500px (square)
- **Components:** 6 Instagram posts

### Avatar Images (placeholderImages.avatar)
- **File:** `client/src/components/home/Testimonials.jsx`
- **Display:** Customer testimonial section
- **Size:** 100x100px (square)
- **Components:** 3 customer avatars

---

## 🎯 Quick Reference: Image Keys and Locations

| Image Category | File Location | Component | Number of Images |
|---|---|---|---|
| **Hero Banners** | `hero.slide1`, `slide2`, `slide3` | HeroBanner | 3 |
| **Products** | `product.necklace1`, `earrings1`, etc | FeaturedProducts | 8 |
| **Categories** | `category.necklaces`, `earrings`, etc | ShopByCategory | 6 |
| **Instagram** | `instagram.post1` through `post6` | InstagramStrip | 6 |
| **Avatars** | `avatar.woman1`, `woman2`, `woman3` | Testimonials | 3 |
| **Styles** | `style.goldPlated`, `oxidised`, etc | (Reserved for future use) | 5 |
| **Banners** | `banner.announcement`, `sale`, etc | (Reserved for future use) | 4 |

---

## 📝 Recommended Image Sizes

For best results, use these sizes:

```
Hero Banners:         1920 × 600 px (landscape)
Product Cards:        300 × 400 px (portrait, 3:4 ratio)
Category Icons:       200 × 200 px (square)
Instagram Posts:      500 × 500 px (square)
Customer Avatars:     100 × 100 px (square)
Style Images:         300 × 300 px (square)
Promo Banners:        1200 × 400 px (landscape)
```

Cloudinary will automatically optimize and resize, but these are the base sizes.

---

## 🛠️ Step-by-Step Example

### Replace Hero Banner Slide 1

**Current (Placeholder):**
```javascript
// In client/src/utils/placeholderImages.js
hero: {
  slide1: `https://res.cloudinary.com/geetadhyajewels/image/upload/v1/placeholder/jewelry_banner_1_qp9k8l`,
  slide2: `https://res.cloudinary.com/geetadhyajewels/image/upload/v1/placeholder/jewelry_banner_2_mx2r5n`,
  slide3: `https://res.cloudinary.com/geetadhyajewels/image/upload/v1/placeholder/jewelry_banner_3_dp7j2k`,
}
```

**After Upload to Cloudinary:**
1. Your image uploaded with public ID: `geetadhya/bridal_collection_banner_2024`
2. Update the file:

```javascript
// In client/src/utils/placeholderImages.js
hero: {
  slide1: `https://res.cloudinary.com/geetadhyajewels/image/upload/v1/geetadhya/bridal_collection_banner_2024`,
  slide2: `https://res.cloudinary.com/geetadhyajewels/image/upload/v1/placeholder/jewelry_banner_2_mx2r5n`,
  slide3: `https://res.cloudinary.com/geetadhyajewels/image/upload/v1/placeholder/jewelry_banner_3_dp7j2k`,
}
```

3. Save file
4. Website automatically shows your new image!

---

## 🚀 Automation Helper Function

We've added a helper function you can use:

```javascript
// In client/src/utils/placeholderImages.js
updateImageInProduction('hero.slide1', 'your_cloudinary_public_id')
```

This logs a reminder in console. Later, this can be connected to a database for automatic updates.

---

## ✅ Testing After Replacement

After replacing images:

1. **Check locally:**
   - `npm run dev`
   - Open http://localhost:5173
   - Verify new images appear

2. **Check on phone:**
   - Mobile responsiveness works
   - Images load fast (lazy loading)

3. **Verify optimization:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Check image file sizes (should be <200KB each)

---

## 📊 Image Upload Checklist

- [ ] Collected all jewelry photos
- [ ] Resized to appropriate dimensions
- [ ] Uploaded to Cloudinary
- [ ] Got Cloudinary public IDs
- [ ] Updated placeholderImages.js
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Verified image loading speed
- [ ] Committed changes to git

---

## ❓ FAQ

**Q: Can I replace images partially (some real, some placeholder)?**
A: Yes! Replace only the images you have ready. Keep placeholders for the rest.

**Q: What if my image dimensions are different?**
A: Cloudinary automatically handles resizing. Just upload the image and it will optimize it.

**Q: Can I use a URL instead of Cloudinary public ID?**
A: Yes, you can use direct image URLs too. But Cloudinary gives better optimization.

**Q: How often can I change images?**
A: Anytime! Just update placeholderImages.js and it takes effect immediately.

**Q: What if I mess up the URL?**
A: The placeholder image will show as fallback. Fix the URL and reload.

**Q: Can I batch replace multiple images?**
A: Yes! Just update all the URLs in placeholderImages.js at once.

---

## 🎨 Current Placeholder Images

**All placeholders are professional jewelry/fashion images:**
- High quality
- Luxury aesthetic
- Properly sized
- Optimized for web
- Fast loading

These work great as temporary images while you prepare your real photos.

---

## 📚 Related Files

- **Main utility:** `client/src/utils/placeholderImages.js`
- **Components using them:**
  - `client/src/components/home/HeroBanner.jsx`
  - `client/src/components/home/FeaturedProducts.jsx`
  - `client/src/components/home/ShopByCategory.jsx`
  - `client/src/components/home/InstagramStrip.jsx`
  - `client/src/components/home/Testimonials.jsx`

---

## 🚀 When You're Ready

1. **Gather your jewelry photos**
2. **Upload to Cloudinary**
3. **Get the public IDs**
4. **Update placeholderImages.js**
5. **Save and deploy**
6. **Done!** ✨

The website will automatically display your real images across all pages!

---

**Status:** ✅ Placeholder system ready  
**Your Action:** Upload real images when ready and update one file (placeholderImages.js)  
**Result:** Professional-looking jewelry website with your actual products

