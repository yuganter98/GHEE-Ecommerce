# Deployment Guide

Your project is ready to be deployed to **Vercel** (the creators of Next.js). 

## 1. Will the Hero Section work?
**YES.** I checked your `public/gheee-jpg` folder:
- **Total Size**: ~7.6 MB
- **File Count**: 178 images
This is well within Vercel's limits. These images will be served via Vercel's Global CDN, so they will load *faster* for users than they do on your local machine.

---

## 2. ⚠️ CRITICAL: Database Migration
Currently, your `.env.local` points to a **Local Database**:
`DATABASE_URL="postgres://postgres:123@127.0.0.1:5432/ghee_db"`

This **WILL NOT WORK** when deployed, because Vercel cannot access your computer's hard drive. You must use a **Cloud Database**.

### Recommended: Neon.tech (Free Tier is excellent)
1.  Go to [Neon.tech](https://neon.tech) and Sign Up.
2.  Create a new Project (e.g., `ghee-prod`).
3.  Copy the connection string (matches `postgres://...`).

### How to Migrate your Data
You need to create the tables in the new Cloud Database. You can use the scripts we already wrote.

1.  **Update `.env.local` TEMPORARILY** to point to the **NEW** Cloud DB URL.
2.  Run the schema setup script:
    ```bash
    # (We didn't make a single master script, so run SQL manually or use a migration tool)
    # The easiest way right now is to connect to Neon/Supabase SQL Editor and run your schema SQL.
    ```
    *I will provide the full SQL Schema below for you to copy-paste into Neon's SQL Editor.*

---

## 3. Deployment Steps (Vercel)

1.  **Push code to GitHub** (if not already done).
2.  Go to [Vercel.com](https://vercel.com) -> "Add New..." -> "Project".
3.  Import your GitHub Repository.
4.  **Configure Environment Variables**:
    You must add all these variables in the Vercel Dashboard during setup:
    
    | Variable | Value |
    | :--- | :--- |
    | `DATABASE_URL` | **(Your NEW Cloud DB URL)** |
    | `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` (Automatic) |
    | `NODE_ENV` | `production` |
    | `RAZORPAY_KEY_ID` | (Your Key) |
    | `RAZORPAY_KEY_SECRET` | (Your Secret) |
    | `RAZORPAY_WEBHOOK_SECRET`| (Your Webhook Secret) |
    | `SMTP_HOST` | `smtp.gmail.com` |
    | `SMTP_user`, `SMTP_PASS` | (Your Gmail App Password) |
    | `CLOUDINARY_*` | (Your Cloudinary Keys) |
    | `ADMIN_EMAIL` | `kravelabco@gmail.com` |
    | `ADMIN_PASSWORD_HASH` | (Your Hash) |

5.  Click **Deploy**.

---

## Appendix: Full Database Schema (Run this in Neon SQL Editor)

```sql
-- 1. Users / Customers (Optional, mostly handled in Orders json now)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Stored in paise (e.g. 1000 = ₹10)
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  amount INTEGER NOT NULL, -- Total in paise
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, PAID, SHIPPED, etc.
  razorpay_order_id VARCHAR(255) UNIQUE,
  payment_id VARCHAR(255),
  customer_details JSONB, -- { name, email, phone, address }
  payment_method VARCHAR(50) DEFAULT 'ONLINE', -- ONLINE or COD
  tracking_id TEXT,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase INTEGER NOT NULL
);
```
