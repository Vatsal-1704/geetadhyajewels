# GeetadhyaJewels — Full E-Commerce Website

> *Elegant Imitation Jewellery for Every Occasion* ✨

A complete production-ready e-commerce platform built with React + Node.js + MongoDB.

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Configure Environment

```bash
cp server/.env.example server/.env
# Edit server/.env with your credentials
```

**Required values in `server/.env`:**
| Variable | Description |
|---|---|
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Random secret for JWT signing |
| `RAZORPAY_KEY_ID` | From Razorpay Dashboard |
| `RAZORPAY_KEY_SECRET` | From Razorpay Dashboard |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary |
| `CLOUDINARY_API_KEY` | From Cloudinary |
| `CLOUDINARY_API_SECRET` | From Cloudinary |

### 3. Seed Admin User

Start MongoDB and run:
```bash
cd server
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.create({ name: 'Admin', email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, role: 'admin' });
  console.log('Admin created!'); process.exit(0);
});
"
```

### 4. Run Development

```bash
npm run dev
```

- 🛍️ **Store:** http://localhost:3000
- 🔐 **Admin Panel:** http://localhost:3000/admin

---

## 📁 Folder Structure

```
geetadhyajewels/
├── client/               # React 18 frontend (Tailwind CSS)
│   └── src/
│       ├── pages/        # All customer-facing pages
│       ├── admin/        # Admin panel pages & layout
│       ├── components/   # Reusable UI components
│       ├── context/      # Auth, Cart, Wishlist contexts
│       └── utils/        # Axios API instance
├── server/               # Node.js + Express backend
│   ├── models/           # Mongoose schemas
│   ├── controllers/      # Business logic
│   ├── routes/           # API route handlers
│   ├── middleware/        # Auth + error handlers
│   └── config/           # DB + Cloudinary config
└── README.md
```

---

## 🌐 Pages Built

### Customer Pages
| Page | Route |
|---|---|
| Homepage | `/` |
| Collections | `/collections` or `/collections/:slug` |
| Product Detail | `/product/:slug` |
| Cart | `/cart` |
| Checkout | `/checkout` |
| Order Confirmation | `/order-confirmation/:id` |
| Login / Register | `/login` |
| My Account | `/account` |
| Order Tracking | `/track-order` |
| Search | `/search` |
| Offers / Sale | `/offers` |
| About Us | `/about` |
| Contact | `/contact` |
| FAQ | `/faq` |
| Policies | `/shipping-policy`, `/return-policy`, `/privacy-policy`, `/terms` |

### Admin Panel (at `/admin`)
- Dashboard with KPI cards & sales charts
- Product CRUD (add/edit/delete/bulk)
- Order management with status updates & tracking
- Customer management with block/unblock
- Category management
- Coupon & offer management
- Banner / CMS management
- Review moderation with reply
- Inventory with low-stock alerts
- Revenue reports & best-seller analytics
- Store settings

---

## 🎨 Brand Identity

| Token | Value |
|---|---|
| Primary Black | `#1a1a1a` |
| Gold Accent | `#C9A84C` |
| Cream BG | `#FAF7F2` |
| Heading Font | Playfair Display |
| Body Font | Poppins |

---

## 💳 Payments

- **Razorpay** — UPI, Cards, Net Banking, Wallets (default)
- **Cash on Delivery** — available on all orders

---

## 📦 Tech Stack

- **Frontend:** React 18 + Tailwind CSS + React Router 6
- **State:** Context API (Auth + Cart + Wishlist)
- **Backend:** Node.js + Express 4
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (customer + admin roles)
- **Images:** Cloudinary
- **Payments:** Razorpay
- **Charts:** Recharts

---

*Built for GeetadhyaJewels — Elegant Imitation Jewellery for Every Occasion ✨*
