# Ecommerce Web Application

This project is a full-stack ecommerce application with a React customer storefront, an admin dashboard, and an Express API server. It supports product browsing, cart and wishlist features, customer checkout, order management, promo codes, image uploads, Clerk authentication, MongoDB persistence, Cloudinary media storage, and Razorpay payments.


## Main Features

### Customer Features

- Browse home content, collections, and product details.
- Sign in and sign up using Clerk authentication.
- Manage customer profile and delivery addresses.
- Add products to cart and wishlist.
- Apply promo codes during checkout.
- Place orders with Razorpay payment integration.
- View order success flow after checkout.
- Use reward points checkout flow.

### Admin Features

- View dashboard data.
- Create, update, and manage products.
- Upload and manage product images through Cloudinary.
- Manage promo codes and coupons.
- View and update customer orders.
- Manage application settings.
- Restrict admin pages by user role.

### Backend Features

- Express 5 API server written in TypeScript.
- MongoDB database through Mongoose.
- Clerk authentication middleware.
- Role-based admin protection.
- Centralized API response envelope.
- Centralized async error handling.
- CORS configuration for frontend origins.
- Razorpay order and payment support.
- Cloudinary upload support.

## Tech Stack

### Frontend

- React 19
- Vite
- TypeScript
- React Router
- Clerk React
- Zustand
- Tailwind CSS
- shadcn-style UI components
- Radix UI and Base UI primitives
- Sonner notifications
- Axios
- Lucide React icons

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB Compass
- Mongoose
- Clerk Express
- Cloudinary
- Razorpay
- Multer
- Zod
- Morgan
- CORS

## Prerequisites

Install the following before running the project:

- Node.js
- npm
- MongoDB database connection string
- Clerk application keys
- Cloudinary account credentials
- Razorpay account credentials

## Environment Variables

Create a `.env` file inside `server/`.

```env
PORT=5000
CORS_ORIGINS=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
ADMIN_EMAILS=admin@example.com
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Create a `.env` file inside `client/`.

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:5000
```

## Installation

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

## Running The Project

Start the backend server:

```bash
cd server
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Start the frontend development server:

```bash
cd client
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Build Commands

Build the frontend:

```bash
cd client
npm run build
```

Build the backend:

```bash
cd server
npm run build
```

Start the compiled backend:

```bash
cd server
npm start
```

Preview the built frontend:

```bash
cd client
npm run preview
```

## Application Routes

### Frontend Routes

| Route | Description |
| --- | --- |
| `/` | Customer home page |
| `/sign-in/*` | Sign in page |
| `/sign-up/*` | Sign up page |
| `/collections` | Product collections page |
| `/collection/:id` | Collection details page |
| `/order-success` | Protected order success page |
| `/admin` | Protected admin dashboard |
| `/admin/dashboard` | Admin dashboard |
| `/admin/products` | Admin product management |
| `/admin/coupons` | Admin promo and coupon management |
| `/admin/orders` | Admin order management |
| `/admin/settings` | Admin settings |

### Backend Route Groups

| Base Route | Purpose |
| --- | --- |
| `/health` | Server health check |
| `/auth` | Authentication and user bootstrap routes |
| `/customer` | Customer home, products, address, promo, cart, wishlist, checkout, points checkout, and orders |
| `/admin` | Admin dashboard, products, promos, orders, and settings |

## Data Models

The backend uses these main Mongoose models:

- `User`: Clerk user mapping, role, points, and saved addresses.
- `Product`: Product details, category, brand, stock, images, colors, sizes, price, sale percentage, status, and creator.
- `Category`: Product category data.
- `Cart`: Customer cart data.
- `Wishlist`: Customer wishlist data.
- `Order`: Customer order items, delivery details, payment status, order status, totals, and payment identifiers.
- `Promo`: Promo code and discount data.
- `Banner`: Home or promotional banner data.

## Authentication And Authorization

The frontend uses Clerk for sign in and sign up. The API uses Clerk Express middleware to read authenticated requests. Admin pages are protected on the frontend with role guards, and admin API routes are separated under `/admin`.

Admin users are configured with the `ADMIN_EMAILS` environment variable on the server.

## Payments

Razorpay is used for payment order creation and checkout processing. The server expects Razorpay credentials in `server/.env`.

## Media Uploads

Cloudinary is used for product image storage. The server expects Cloudinary credentials in `server/.env`.

## Development Notes

- The frontend API client uses `VITE_BACKEND_URL` and attaches Clerk bearer tokens to authenticated requests.
- The server defaults CORS to `http://localhost:5173` when `CORS_ORIGINS` is not set.
- The backend default port is `5000`.
- The repository currently includes `node_modules` and compiled `server/dist` output. In a production repository, these are usually excluded with `.gitignore`.

## Suggested Git Ignore

If this project is committed to Git, add or confirm these entries in `.gitignore`:

```gitignore
node_modules/
dist/
.env
.env.local
npm-debug.log*
```

## Useful Commands

```bash
# Frontend
cd client
npm run dev
npm run build
npm run lint
npm run preview

# Backend
cd server
npm run dev
npm run build
npm start
```

## Project Summary

This project is a complete ecommerce platform with separate customer and admin experiences. The customer side handles browsing, authentication, cart, wishlist, checkout, reward points, and order flow. The admin side handles products, promos, orders, settings, and dashboard management. The backend provides the API layer, database models, authentication integration, file upload support, and payment gateway integration needed to run the platform.
