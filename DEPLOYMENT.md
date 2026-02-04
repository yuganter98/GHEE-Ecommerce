# Deployment Guide for Ghee Ecommerce

Your project is fully configured and ready to be deployed to **Vercel**. 

Since you have already migrated your database to Supabase and pushed your code to GitHub, the deployment process is straightforward.

## 1. Prerequisites Checklist
- [x] **Database**: Supabase (Configured & Migrated)
- [x] **Code**: Pushed to GitHub
- [x] **Images**: Cloudinary (Configured)
- [x] **Payments**: Razorpay (Live Keys Configured)

---

## 2. Deploy on Vercel

1.  **Go to [Vercel.com](https://vercel.com)** and Log In / Sign Up.
2.  Click **"Add New..."** -> **"Project"**.
3.  **Import Git Repository**: Select your repo `GHEE-Ecommerce`.
4.  **Configure Project**:
    *   **Framework Preset**: Next.js (Default)
    *   **Root Directory**: `./` (Default)
    *   **Build Command**: `next build` (Default)
    
5.  **Environment Variables (CRITICAL step)**:
    You typically copy these directly from your local `.env.local` file.
    Expand the "Environment Variables" section and add the following:

    | Variable Name | Value Description |
    | :--- | :--- |
    | **Database** | |
    | `DATABASE_URL` | Copy from `.env.local` (starts with `postgresql://...`) |
    | **App Config** | |
    | `NODE_ENV` | `production` |
    | `NEXT_PUBLIC_APP_URL` | `https://your-project-name.vercel.app` (or your custom domain) |
    | **Payments (Razorpay)** | |
    | `RAZORPAY_KEY_ID` | Copy from `.env.local` |
    | `RAZORPAY_KEY_SECRET` | Copy from `.env.local` |
    | `RAZORPAY_WEBHOOK_SECRET`| Copy from `.env.local` |
    | **Images (Cloudinary)** | |
    | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `dbesx6ijh` |
    | `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`| `ml_default` |
    | `CLOUDINARY_API_KEY` | Copy from `.env.local` |
    | `CLOUDINARY_API_SECRET` | Copy from `.env.local` |
    | **Email (SMTP)** | |
    | `SMTP_HOST` | `smtp.gmail.com` |
    | `SMTP_PORT` | `587` |
    | `SMTP_USER` | `kravelabco@gmail.com` |
    | `SMTP_PASS` | Copy from `.env.local` (Your App Password) |
    | `SMTP_FROM` | `orders@gheestore.com` |
    | **Admin Security** | |
    | `ADMIN_EMAIL` | `kravelabco@gmail.com` |
    | `ADMIN_PASSWORD_HASH` | Copy from `.env.local` (The long string starting with `0544...`) |

6.  Click **Deploy**.

---

## 3. Post-Deployment Checks

1.  **Visit your live URL** (e.g., `https://ghee-store.vercel.app`).
2.  **Test the Shop**: Ensure images load (Cloudinary).
3.  **Test Admin Login**: Go to `/admin/login` and try `vip#321`.
4.  **Test Checkout**: Try to buy a product (Refund it later via Razorpay Dashboard if testing with real money).

## 4. Webhook Setup (Optional but Recommended)
To automatically update order status to `PAID` even if the user closes the window:
1.  Go to **Razorpay Dashboard** -> Settings -> Webhooks.
2.  Add New Webhook.
3.  **Webhook URL**: `https://YOUR-VERCEL-DOMAIN.vercel.app/api/webhooks/razorpay`
4.  **Active Events**: `order.paid`, `payment.captured`.
5.  **Secret**: Use the value of `RAZORPAY_WEBHOOK_SECRET`.
