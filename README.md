# ShopEase – E-Commerce Management System

A modern, responsive full-stack e-commerce platform and business management system built with **React 19**, **TypeScript**, **Tailwind CSS**, **Node.js / Express**, and **MongoDB Atlas**. Designed with a glassmorphism-inspired aesthetic, vibrant indigo/violet accents, real-time cart and order workflows, atomic inventory tracking, live MongoDB aggregation analytics, and an interactive MongoDB Query Lab.

---

## 1. Project Introduction & Objectives

ShopEase was designed as a production-ready e-commerce solution bridging customer storefront experiences with back-office operations:

- **Customer-First Commerce**: High-performance shopping catalog with real-time text search, department filtering, stock verification, coupon engine, dynamic cart management, multi-step checkout (Card & Cash on Delivery), live order tracking timelines, and customer profile management.
- **Enterprise Admin Operations**: Real-time business dashboard, SKU management with atomic stock adjustments, inventory audit trails, category taxonomy, CRM customer directory, and order status lifecycle control with automated stock restoration for cancellations.
- **MongoDB Deep Dive**: Interactive **MongoDB Query Lab** executing verified safe queries (`find`, `aggregate`, `$group`, `$unwind`, `$inc`, `$push`, text indexes) with real BSON explanations and execution plan metrics, alongside a dedicated **SQL vs. MongoDB Architectural Comparison**.

---

## 2. Features & Modules

### 🛍️ Customer Module
- **Authentication & Security**: Customer registration, login with bcrypt password hashing and JSON Web Tokens (JWT), session persistence, and instant demo account switcher.
- **Storefront & Catalog**:
  - Hero promotional banners with quick-department jump links.
  - 7 categorized departments: *Audio, Wearables, Computing, Smart Living, Electronics, Accessories, Gaming*.
  - Full-text search across titles and descriptions with category and sorting filters (Price Low/High, Rating, Newest).
  - High-fidelity product details with badges, features checklists, technical specifications, and verified customer reviews.
- **Shopping Cart**:
  - Quantity control, real-time subtotal calculation, free shipping threshold progress bar ($100+ threshold), and promo coupon validation (`SAVE15`, `TECH20`).
- **Checkout & Payments**:
  - Dual payment methods: Simulated Instant Card Processing and Cash on Delivery (COD).
  - Address capture and validation with default address storage.
  - Server-verified pricing and atomic stock reservation to prevent overselling race conditions.
- **Order Tracking & Profile**:
  - Real-time order tracking with 5-stage progress milestone timelines (*Order Placed*, *Processing*, *Shipped*, *Out for Delivery*, *Delivered*).
  - Order cancellation with automatic inventory replenishment.
  - Customer review submission with dynamic 1–5 star rating calculation.

### ⚙️ Admin Module
- **Secure Role-Based Authorization**: Protected routes checking JWT claims (`role === 'admin'`).
- **Live Executive Dashboard**:
  - Metric cards: Gross Merchandise Value (GMV), Total Completed Orders, Active SKUs, Customer Accounts, Low Stock Alerts.
  - **Zero Revenue Leakage**: Cancelled orders are strictly excluded from gross revenue and average order value metrics.
  - Monthly revenue trends, sales distribution by category, and best-seller leaderboards.
- **Product Management (CRUD)**:
  - Add, edit, and soft/hard delete product listings.
  - Real-time form validation for SKUs, pricing, discount percentages, and inventory counts.
- **Category Taxonomy Management**:
  - Create and manage department hierarchies, icon associations, and UI gradients.
- **Order Management & Fulfillment**:
  - Filter orders by status (*Pending, Processing, Shipped, Out for Delivery, Delivered, Cancelled*).
  - Advance orders through delivery milestones with automatic COD payment status syncing.
- **Inventory & Stock Management**:
  - Live low-stock detection (items with $\le 10$ units).
  - Instant restock modal with automated audit logging to `stock_logs`.
- **MongoDB Query Lab**:
  - Interactive workbench running safe, authenticated database queries across collections.
  - Displays MongoDB BSON syntax, equivalent SQL queries, execution time ($ms$), docs examined, winning index plan (`IXSCAN`, `COLLSCAN`), and live result JSON.
- **SQL vs. MongoDB Architectural Comparison**:
  - Side-by-side analysis of Tables vs. Collections, Schemas vs. BSON Documents, Joins vs. Embedding, GROUP BY vs. Aggregation Pipelines, and Relational vs. Document Reviews.

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Routing & Navigation** | React Router DOM v7 |
| **Styling & Animation** | Tailwind CSS v4, Lucide Icons, Motion |
| **Data Visualization** | Recharts (Area, Bar, Pie, and Line charts) |
| **Backend Engine** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Official MongoDB Node.js Driver v7), In-Memory Mock Fallback |
| **Authentication & Auth** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| **Runtime & Tooling** | `tsx` TypeScript Execution, ESLint |

---

## 4. Project Folder Structure

```text
├── index.html                   # HTML entry point with synchronized SEO meta
├── metadata.json                # Applet configuration and capabilities
├── package.json                 # Dependency definitions and lifecycle scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite bundler configuration
├── vercel.json                  # Frontend deployment configuration for Vercel
├── render.yaml                  # Backend service blueprint for Render
├── server.ts                    # Full-stack Express server & dev proxy entry
│
├── server/                      # Express Backend Architecture
│   ├── config/
│   │   ├── db.ts                # MongoDB Atlas connection & in-memory engine
│   │   ├── queryPresets.ts      # Query Lab safe operation definitions
│   │   └── seedData.ts          # Comprehensive seed dataset (30 prods, 7 cats, 20 orders)
│   ├── controllers/
│   │   ├── authController.ts    # Customer & Admin authentication
│   │   ├── productController.ts # Product catalog & CRUD operations
│   │   ├── categoryController.ts# Category taxonomy operations
│   │   ├── cartController.ts    # Cart management & synchronization
│   │   ├── orderController.ts   # Checkout, order status, & stock replenishment
│   │   ├── reviewController.ts  # Customer reviews & product rating calculations
│   │   ├── inventoryController.ts# Stock level tracking & replenishment logs
│   │   └── analyticsController.ts# Aggregation pipelines & MongoLab executor
│   ├── middleware/
│   │   └── auth.ts              # JWT verification & role authorization (requireAdmin)
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── productRoutes.ts
│   │   ├── categoryRoutes.ts
│   │   ├── cartRoutes.ts
│   │   ├── orderRoutes.ts
│   │   ├── reviewRoutes.ts
│   │   ├── inventoryRoutes.ts
│   │   └── analyticsRoutes.ts
│   └── scripts/
│       ├── seed.ts              # CLI MongoDB Atlas database seeder
│       └── test-e2e.ts          # 20-point automated end-to-end test suite
│
└── src/                         # React Frontend Application
    ├── components/              # Reusable UI Components
    │   ├── Navbar.tsx           # Global navigation with badges & auth state
    │   ├── Footer.tsx           # Storefront footer and legal links
    │   ├── ProductCard.tsx      # Interactive product card with badges & add-to-cart
    │   ├── CartDrawer.tsx       # Slide-out shopping bag with coupon calculator
    │   ├── AuthModal.tsx        # Login & registration modal with demo shortcuts
    │   └── Toast.tsx            # Alert notifications
    ├── pages/                   # Application Views
    │   ├── Home.tsx             # Homepage with banner, categories, trending products
    │   ├── ProductsPage.tsx     # Filterable search catalog
    │   ├── ProductDetailPage.tsx# Comprehensive product page with review submission
    │   ├── CheckoutPage.tsx     # Shipping address and payment forms
    │   ├── OrderConfirmation.tsx# Post-purchase receipt with tracking links
    │   ├── OrderTrackingPage.tsx# Live order timeline and details
    │   ├── ProfilePage.tsx      # Saved addresses, order history, and account settings
    │   └── admin/
    │       ├── AdminLayout.tsx  # Admin navigation shell & status bar
    │       ├── AdminDashboard.tsx# Live metrics & summary charts
    │       ├── AdminProducts.tsx# Product CRUD catalog table & modals
    │       ├── AdminCategories.tsx# Category manager
    │       ├── AdminOrders.tsx  # Order fulfillment & status updater
    │       ├── AdminCustomers.tsx# Customer CRM list
    │       ├── AdminInventory.tsx# Low-stock alerts and restock logs
    │       ├── AdminAnalytics.tsx# Advanced aggregation breakdown
    │       ├── AdminMongoLab.tsx# Real-time query workbench
    │       └── AdminSqlVsMongo.tsx# Architectural concept comparison
    ├── services/
    │   ├── api.ts               # Centralized HTTP client wrapper
    │   ├── dataService.ts       # Service layer interfacing with API endpoints
    │   └── mockData.ts          # Fallback constants & structures
    └── types/
        └── index.ts             # TypeScript domain interfaces
```

---

## 5. MongoDB Database & Collection Details

Database Name: `shopease`

### 1. `users` Collection
- **Purpose**: Stores administrators and customers, credentials, contact info, and addresses.
- **Indexes**: `{ email: 1 }` (unique), `{ role: 1 }`
```json
{
  "_id": "ObjectId",
  "id": "usr-admin",
  "name": "Administrator",
  "email": "admin@shopease.com",
  "password": "$2a$10$hashedBcryptPassword...",
  "role": "admin",
  "phone": "+1 (555) 019-2834",
  "avatarColor": "bg-indigo-600",
  "savedAddresses": [
    {
      "id": "addr-hq",
      "fullName": "HQ Operations",
      "street": "100 Silicon Vista Blvd, Suite 400",
      "city": "San Francisco",
      "state": "CA",
      "postalCode": "94105",
      "country": "United States",
      "isDefault": true
    }
  ],
  "joinedAt": "2025-06-01T00:00:00Z"
}
```

### 2. `categories` Collection
- **Purpose**: Taxonomy definitions for product classification.
- **Indexes**: `{ slug: 1 }` (unique), `{ name: 1 }` (unique)
```json
{
  "_id": "ObjectId",
  "id": "cat-1",
  "name": "Audio",
  "slug": "audio",
  "description": "Studio monitors and ANC headphones.",
  "icon": "Headphones",
  "itemCount": 5,
  "gradient": "from-blue-600 to-indigo-600"
}
```

### 3. `products` Collection
- **Purpose**: Product catalog with embedded reviews, attributes, and stock counters.
- **Indexes**: `{ sku: 1 }` (unique), `{ category: 1 }`, `{ price: 1 }`, `{ stock: 1 }`, `{ name: "text", description: "text" }`
```json
{
  "_id": "ObjectId",
  "id": "prod-01",
  "name": "UltraPulse Studio ANC Headphones",
  "slug": "ultrapulse-studio-anc-headphones",
  "sku": "AUD-UP-001",
  "category": "Audio",
  "price": 279,
  "originalPrice": 349,
  "discountPercentage": 20,
  "stock": 24,
  "rating": 4.9,
  "ratingCount": 142,
  "description": "Custom 40mm beryllium drivers...",
  "features": ["Hybrid ANC", "Lossless audio over USB-C"],
  "specifications": { "Driver": "40mm Beryllium", "Weight": "248g" },
  "isTrending": true,
  "badge": "Best Seller",
  "iconName": "Headphones",
  "bgGradient": "from-blue-600 to-violet-700",
  "reviews": [
    {
      "id": "rev-01",
      "userName": "Alexander Wright",
      "rating": 5,
      "comment": "Astonishing sound separation...",
      "date": "2026-02-04",
      "verifiedPurchase": true
    }
  ],
  "createdAt": "2026-01-15T08:00:00Z"
}
```

### 4. `orders` Collection
- **Purpose**: Immutable order records with frozen price snapshots and tracking histories.
- **Indexes**: `{ orderNumber: 1 }` (unique), `{ customerId: 1 }`, `{ orderStatus: 1 }`, `{ createdAt: -1 }`
```json
{
  "_id": "ObjectId",
  "id": "ord-1001",
  "orderNumber": "SE-2026-1001",
  "customerId": "usr-cust-01",
  "customerName": "Sarah Chen",
  "customerEmail": "sarah.chen@example.com",
  "shippingAddress": { "street": "742 Evergreen Terrace", "city": "Seattle", "state": "WA" },
  "items": [
    {
      "product": { "id": "prod-01", "name": "UltraPulse Studio ANC Headphones", "price": 279 },
      "quantity": 1
    }
  ],
  "subtotal": 279,
  "discount": 0,
  "shippingFee": 0,
  "tax": 20.93,
  "total": 299.93,
  "paymentMethod": "card",
  "paymentStatus": "Paid",
  "orderStatus": "Delivered",
  "trackingNumber": "TRK-SE-8829104",
  "carrier": "FedEx Express Air",
  "timeline": [
    { "status": "Pending", "completed": true },
    { "status": "Delivered", "completed": true, "current": true }
  ],
  "createdAt": "2026-02-28T09:15:00Z"
}
```

### 5. `carts` Collection
- **Purpose**: Ephemeral and customer shopping bag states.
- **Indexes**: `{ userId: 1 }` (unique)

### 6. `reviews` Collection
- **Purpose**: Flat indexable customer feedback linked to products.
- **Indexes**: `{ productId: 1 }`, `{ userEmail: 1 }`

### 7. `stock_logs` Collection
- **Purpose**: Inventory adjustment audit trail for stock additions, sales, and order cancellations.
- **Indexes**: `{ productId: 1 }`, `{ timestamp: -1 }`

---

## 6. Installation Instructions

### Prerequisites
- Node.js (version 18 or 20+ recommended)
- npm or yarn
- MongoDB Atlas cluster URI (optional — in-memory store activates if omitted)

### Step 1: Clone Repository & Install Dependencies
```bash
git clone <repository-url>
cd shopease
npm install
```

---

## 7. Environment Variable Setup

Copy the environment example file:
```bash
cp .env.example .env
```

Configure your `.env` variables:
```env
# Port for Express fullstack server
PORT=3000

# MongoDB Atlas Connection URI
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/shopease?retryWrites=true&w=majority"
MONGODB_DB_NAME="shopease"

# JWT Secret for signing tokens
JWT_SECRET="your_secure_random_jwt_secret_key"
```

---

## 8. Run Commands

| Task | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts Express server with Vite middleware on `http://localhost:3000` |
| **Production Build** | `npm run build` | Builds Vite frontend bundle into `/dist` |
| **Production Server**| `npm start` | Runs Express server serving production assets and APIs |
| **Database Seed** | `npm run seed` | Seeds MongoDB Atlas with 1 admin, 10 customers, 7 categories, 30 products, 20 orders |
| **Automated Tests** | `npx tsx server/scripts/test-e2e.ts` | Runs 20-point automated end-to-end verification |
| **Lint Check** | `npm run lint` | Runs `tsc --noEmit` to verify 100% TypeScript type safety |

---

## 9. API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register customer account `{ name, email, password, phone }`
- `POST /api/auth/login` — Sign in as customer or admin `{ email, password }`
- `GET /api/auth/me` — Retrieve authenticated user profile *(Bearer Token)*
- `PUT /api/auth/profile` — Update address, name, or phone

### Products (`/api/products`)
- `GET /api/products` — List products (query params: `search`, `category`, `sort`, `limit`)
- `GET /api/products/:id` — Get single product details by ID or slug
- `POST /api/products` — Admin create product *(Admin Only)*
- `PUT /api/products/:id` — Admin update product price, stock, or details *(Admin Only)*
- `DELETE /api/products/:id` — Admin delete product *(Admin Only)*

### Categories (`/api/categories`)
- `GET /api/categories` — List all 7 departments with item counts
- `POST /api/categories` — Create category *(Admin Only)*
- `DELETE /api/categories/:id` — Delete category *(Admin Only)*

### Cart (`/api/cart`)
- `GET /api/cart` — Get current session or user cart
- `POST /api/cart` — Sync full cart items array
- `POST /api/cart/items` — Add single item `{ productId, quantity }`
- `PUT /api/cart/items` — Update item quantity `{ productId, quantity }`
- `DELETE /api/cart/items/:productId` — Remove item from cart
- `DELETE /api/cart` — Clear all items

### Orders (`/api/orders`)
- `POST /api/orders/checkout` — Checkout order with atomic stock decrement
- `GET /api/orders/my-orders` — Get current customer order history *(Authenticated)*
- `GET /api/orders/:id` — Get single order tracking details
- `GET /api/orders` — Admin get all customer orders *(Admin Only)*
- `PUT /api/orders/:id/status` — Admin update order status (*Restores inventory on `Cancelled`*)

### Reviews (`/api/reviews`)
- `POST /api/reviews/products/:id` — Submit product review `{ userName, rating, comment }`

### Inventory (`/api/inventory`)
- `GET /api/inventory` — Get inventory levels, low-stock flags, and stats *(Admin Only)*
- `POST /api/inventory/restock/:productId` — Restock inventory `{ amount, reason }` *(Admin Only)*

### Admin Analytics & MongoLab (`/api/analytics`)
- `GET /api/analytics/dashboard` — Live aggregation KPIs, sales trends, categories, and bestsellers
- `GET /api/analytics/customers` — Customer CRM list with total orders and computed spend
- `GET /api/analytics/mongolab/presets` — Predefined safe query catalog
- `POST /api/analytics/mongolab/execute` — Execute safe query preset `{ presetId }`

---

## 10. Testing & Deployment Instructions

### Automated Verification
Run the comprehensive test suite locally:
```bash
npx tsx server/scripts/test-e2e.ts
```
*Expected Result: 20 / 20 Tests Passed.*

### Deploying to MongoDB Atlas
1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
3. Under **Database Access**, create a database user (e.g., `shopease_admin`).
4. Copy your cluster connection string and export it in `.env`:
   ```bash
   MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/shopease?retryWrites=true&w=majority"
   ```
5. Seed the database with the pre-built dataset:
   ```bash
   npm run seed
   ```

### Deploying Backend to Render
1. Push this repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **New + > Web Service** and connect your repository.
3. Configure the service:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Atlas connection string>`
   - `MONGODB_DB_NAME`: `shopease`
   - `JWT_SECRET`: `<Your secret key>`
5. Click **Create Web Service**. Render provides your live backend URL (e.g., `https://shopease-backend.onrender.com`).

### Deploying Frontend to Vercel
1. In the [Vercel Dashboard](https://vercel.com), click **Add New > Project** and import the repository.
2. Set Framework Preset to **Vite**.
3. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://shopease-backend.onrender.com`
4. The included `vercel.json` ensures client-side routes rewrite to `/index.html` seamlessly.
5. Click **Deploy**.

---

## 11. Default Demo Credentials

For quick evaluation, use the pre-configured accounts below:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@shopease.com` | `admin123` | Full Admin Dashboard, CRUD, Inventory, Query Lab |
| **Demo Customer 1** | `sarah.chen@example.com` | `password123` | Storefront, Cart, Checkout, Order History |
| **Demo Customer 2** | `marcus.sterling@example.com`| `password123` | Storefront, Cart, Checkout, Order History |
