# SCANOVA - Project Analysis

## Executive Summary

**SCANOVA** is a full-stack Next.js e-commerce platform for selling QR-code-enabled Augmented Reality (AR) experiences. It combines a modern web shop with AR technology to create interactive "keychain" and "sticker" experiences that users can scan with QR codes. The platform bridges physical merchandise with digital experiences, featuring both a public storefront and an admin dashboard for order and inventory management.

---

## Project Overview

### Core Purpose
SCANOVA enables customers to:
1. **Browse and purchase** physical AR-enabled products (keychains and stickers)
2. **Claim AR experiences** by scanning QR codes on purchased items
3. **Customize and share** personalized AR content (photos, messages)

Admin users can:
1. Manage product inventory and pricing
2. Monitor orders and analytics
3. Create AR experiences and assign them to orders

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|  
| **Frontend** | Next.js | ^16.1.6 |
| **Runtime** | React | ^19.2.3 |
| **Styling** | Tailwind CSS | ^4 |
| **CSS Utilities** | class-variance-authority, clsx, tailwind-merge | ^0.7.1, ^2.1.1, ^3.5.0 |
| **Animation** | tw-animate-css | ^1.4.0 |
| **Database** | PostgreSQL | (via pg and @prisma/adapter-pg) |
| **ORM** | Prisma | ^7.5.0 |
| **3D Engine** | Three.js | ^0.160.0 |
| **3D AR Tracking** | MindAR (via CDN) | @1.2.5 |
| **Animation Library** | GSAP (via CDN) | ^3.12.5 |
| **QR Generation** | qrcode.react | ^4.2.0 |
| **Image Hosting** | Cloudinary (via next-cloudinary) | ^6.17.5 |
| **Environment Config** | dotenv | ^17.3.1 |
| **Node Requirement** | Node.js | >=18.17.0 |

---

## Project Structure

### Root Configuration Files
- **package.json** - Dependencies and build script configuration
- **next.config.mjs** - CORS headers, security policies, and external image domains
- **tsconfig.json** / **jsconfig.json** - JavaScript configuration
- **prisma.config.ts** - Prisma configuration
- **tailwind.config.mjs** - Tailwind CSS customization
- **eslint.config.mjs** - Code linting rules
- **postcss.config.mjs** - PostCSS processing

### Directory Structure

#### `/src/app/` - Next.js App Router
**User Routes:**
- `/` - Landing page with hero and navigation
- `/shop` - Product listing and browsing
- `/checkout` - Shopping cart and order placement
- `/order-confirmation` - Post-purchase confirmation page
- `/scanner` - QR code scanning interface
- `/keychain/[code]` - Individual keychain AR viewer (dynamic route)
- `/sticker/[code]` - Individual sticker AR viewer (dynamic route)

**Admin Routes (Protected):**
- `/admin/login` - Admin authentication page
- `/admin` - Dashboard overview
- `/admin/products` - Product management
- `/admin/orders` - Order management and tracking
- `/admin/analytics` - Sales and engagement analytics
- `/admin/experiences` - AR experience management

#### `/src/app/api/` - RESTful API Endpoints

**Public APIs:**
- `GET /api/products` - Fetch all active products with optional type filter
- `POST /api/products/[id]` - Get product by ID
- `GET /api/orders/[id]` - Track order status
- `POST /api/keychain-claim` - Claim keychain AR experience (first scan)
- `POST /api/keychain-payload/[code]` - Retrieve keychain AR data
- `POST /api/sticker-experience/[code]` - Retrieve sticker AR data
- `POST /api/track` - Track AR experience scan metrics

**Admin APIs:**
- `POST /api/products` - Create new product (admin only)
- `POST /api/admin-auth` - Admin login/session creation
- `GET /api/admin/stats` - Dashboard analytics

**Order & Experience Management:**
- `POST /api/orders` - Place new order with validation
- `GET /api/orders` - Fetch all orders (paginated)
- `POST /api/experience` - Create AR experience
- `POST /api/keychain-bulk` - Bulk generate AR keychains
- `POST /api/keychain-payload/[code]` - Manage keychain payload

#### `/src/components/` - React Components

**User-facing:**
- `CameraPermissionScreen.jsx` - Request camera access for AR scanning
- `keychain-ar/KeychainARScene.jsx` - 3D AR rendering for keychains
- `keychain-ar/KeychainSetupPage.jsx` - Keychain customization interface
- `keychain-ar/ImageUpload.jsx` - Photo upload component
- `sticker-ar/StickerARScene.jsx` - 3D AR rendering for stickers
- `sticker-ar/AROverlay.jsx` - AR overlay UI elements

**Admin:**
- `admin/AdminShell.jsx` - Admin layout container

**UI System:**
- `ui/button.jsx` - Reusable button component

#### `/src/hooks/` - Custom React Hooks
- `useKeychainARDocument.js` - Manages keychain AR session state
- `useMindARDocument.js` - MindAR initialization and tracking

#### `/src/lib/` - Utility Functions
- `prisma.js` - Singleton Prisma client instance
- `utils.js` - Helper functions for validation, formatting, and generation

#### `/prisma/` - Database Schema
- `schema.prisma` - Data model definitions with PostgreSQL

#### `/public/` - Static Assets
- `ar.html` - Static AR viewer template

#### Middleware
- `src/middleware.js` - Admin route protection with session-based authentication

---

## Data Model

### Core Entities

#### 1. **ARExperience** (Keychain AR)
```
- id (CUID primary key)
- code (unique identifier for QR scanning)
- message (custom user message, up to 40 chars)
- imageUrl (user's uploaded photo)
- type ("keychain")
- claimed (boolean - whether user has claimed it)
- theme (customization theme, default "love")
- isActive (can be deactivated)
- scanCount (engagement metric)
- createdAt, updatedAt (timestamps)
```
**Relationships:** One-to-One with OrderItem (optional)
**Indexes:** On `code` for fast QR lookups

#### 2. **StickerExperience** (Sticker AR)
```
- id (CUID primary key)
- code (unique identifier)
- targetImage (base image for sticker overlay)
- assetUrl (3D model or asset URL)
- message (description, default empty)
- isActive (can be deactivated)
- scanCount (engagement tracking)
- createdAt, updatedAt
```
**Relationships:** One-to-One with OrderItem (optional)
**Indexes:** On `code`

#### 3. **Product** (Shop Inventory)
```
- id (CUID primary key)
- name (product title)
- slug (URL-friendly unique identifier)
- description (details about product)
- type ("keychain" | "sticker")
- price (in paise,₹100 = 10000 paise)
- stock (quantity available)
- isActive (can hide without deleting)
- imageUrl (product photo)
- features (array of feature strings)
- theme (for keychains, default "love")
- createdAt, updatedAt
```
**Relationships:** One-to-Many with OrderItem
**Indexes:** On `slug`, `type`

#### 4. **Order** (Customer Purchases)
```
- id (CUID primary key)
- orderNumber (human-readable e.g., SCNV-00001)
- status ("pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled")
- paymentStatus ("pending" | "paid" | "failed" | "refunded")
- paymentMethod ("cod" | "razorpay" | "stripe")
- paymentId (external gateway transaction ID)

Customer Info:
- customerName, customerEmail, customerPhone

Shipping Address:
- addressLine1, addressLine2, city, state, pincode, country

Pricing (all in paise):
- subtotal, shippingCharge, discount, total

- notes (special instructions)
- createdAt, updatedAt
```
**Relationships:** One-to-Many with OrderItem
**Indexes:** On `orderNumber`, `customerEmail`, `status`

#### 5. **OrderItem** (Line Items)
```
- id (CUID primary key)
- orderId (FK to Order)
- productId (FK to Product)
- quantity (how many units)
- unitPrice (price in paise at time of purchase)
- total (quantity × unitPrice)
- arExperienceId (unique FK to ARExperience - assigned after order confirmed)
- stickerExperienceId (unique FK to StickerExperience)
- createdAt
```
**Relationships:** Many-to-One with Order, Product, and optional One-to-One with ARExperience/StickerExperience
**Indexes:** On `orderId`, `productId`
**Cascade Delete:** When parent Order is deleted, OrderItem deletes automatically

---

## Key Features

### 1. **E-Commerce Platform**
- Public product listing with type filtering (keychain/sticker)
- Shopping cart and checkout flow
- **Cash-on-Delivery (COD) support** (Razorpay/Stripe payment fields exist in schema but not yet integrated)
- Order validation with stock checking
- Sequential order number generation (SCNV-00001 format)
- Indian address validation (phone, pincode, email)

### 2. **AR Experience Management**
- QR code generation and claiming system
- Photo capture and message customization (max 40 chars)
- Theme-based styling ("love" theme mentioned as default)
- Scan counting and engagement tracking
- One AR experience per order item
- Experience can be active/inactive status control

### 3. **Admin Dashboard**
- Protected admin routes via session-based authentication
- Admin login page with session token validation
- Product CRUD operations
- Order tracking and management
- Analytics dashboard (sales metrics)
- Bulk keychain generation
- AR experience creation and assignment

### 4. **Security & Compliance**
- Session-based admin authentication with `ADMIN_PASSWORD` verification  
- Secure HTTP-only cookies for session management (7-day expiry, sameSite: "lax")
- Admin login page with password-based access control
- Permission policies for camera access in AR experiences
- CORS headers for safe cross-origin AR access
- COEP/COOP headers for CDN module imports (MindAR, GSAP)
- Cross-Origin-Embedder-Policy enforcement
- Cross-Origin-Opener-Policy for iframe isolation
- Secure cookie handling (httpOnly, sameSite, production-only secure flag)

### 5. **Cloudinary Integration**
- Image upload and hosting for products and AR experiences
- Remote pattern configuration for trusted image domains

---

## User Flows

### 1. **Customer Purchase Flow**
```
Homepage → Shop (Browse Products) 
  → Click Product 
  → Add to Cart 
  → Checkout (Enter Address)
  → Payment 
  → Order Confirmation
```

### 2. **Keychain AR Experience Flow**
```
Receive Physical Keychain with QR Code
  → Scan QR 
  → Grant Camera Permission
  → Upload Photo (claim endpoint)
  → Enter Message (max 40 chars)
  → View Customized AR Experience in 3D
  → Share/Revisit Anytime via Unique Code
```

### 3. **Sticker AR Experience Flow**
```
Receive Sticker with QR Code
  → Scan QR
  → View Sticker 3D Model Overlay
  → Point Camera at Target Image (if applicable)
  → Interactive AR Visualization
```

### 4. **Admin Management Flow**
```
Admin Login → Dashboard
  → Manage Products (Create/Edit/Delete)
  → Monitor Orders (View/Update Status)
  → Create AR Experiences
  → View Analytics (Scan Counts, Sales)
  → Bulk Generate Keychains
```

---

## Tech Implementation Details

### Frontend Architecture
- **Client-side rendering:** "use client" directives for interactive components
- **Dynamic routing:** `[code]` and `[id]` patterns for individual AR experiences and products
- **Interactive features:** Mouse tracking, camera permission handling, 3D scene rendering
- **Image optimization:** Cloudinary integration for responsive image serving
- **Styling system:** Utility-first with Tailwind CSS + custom theme colors (sc-purple, sc-pink, sc-yellow, sc-cyan)

### Backend Architecture
- **API Routes:** Next.js App Router API endpoints with request/response validation
- **Database:** PostgreSQL with Prisma ORM for type-safe queries
- **Authentication:** Simple session cookie model (admin_session token in env)
- **Data Validation:** Email, phone number, pincode validation on orders
- **Error Handling:** Structured error responses with HTTP status codes

### AR Technology Stack
- **Three.js:** 3D rendering engine for AR scenes
- **MindAR:** Image-based target tracking (loaded via CDN) for keychains and stickers. Includes compiler for on-device image compilation via useKeychainARDocument & useMindARDocument hooks
- **GSAP:** Animation library (loaded via CDN) for particle effects and smooth tweens
- **Camera Integration:** Browser camera access via Permissions-Policy headers
- **QR Scanning:** Server-side QR code ID lookup, client renders MindAR + Three.js scenes based on retrieved data

### Build & Deployment
- **Build Process:** `next build` with Prisma client generation
- **Development:** `next dev` for hot reload
- **Production:** `next start` for server deployment
- **Database:** Prisma migrations with PostgreSQL adapter
- **Source Maps:** Disabled in production for security

---

## API Patterns

### Order Creation (`POST /api/orders`)
**Validation Chain:**
1. Customer info validation (name, email, phone, address)
2. Indian-specific validation (10-digit phone, 6-digit pincode)
3. Product existence check
4. Stock availability check per item
5. Atomic order + order items creation
6. Sequentially generated order number

### Keychain Claim (`POST /api/keychain-claim`)
**Validation Chain:**
1. Check code exists
2. Verify not already claimed (409 Conflict if claimed)
3. Check experience is active
4. Update atomically: mark claimed, store image + message
5. Return experience data for client redirect

### Product Retrieval (`GET /api/products`)
**Features:**
- Optional type filter (keychain/sticker)
- Only returns active products
- Ordered by creation date
- Full product data including features array

---

## Environment & Configuration

### Required Environment Variables
- `ADMIN_PASSWORD` - Admin login password (verified at login endpoint)
- `ADMIN_SESSION_TOKEN` - Secure session token set in HTTP-only cookie after successful login
- `DATABASE_URL` - PostgreSQL connection string (Prisma)
- `NODE_ENV` - Set to "production" to enable secure cookies
- Cloudinary credentials (if using image upload) - configured via `next-cloudinary`
- Payment gateway keys (Razorpay/Stripe) - placeholder fields exist but integration not yet implemented

### Next.js Configuration
**Security Headers:**
- Camera permissions for AR experiences
- Microphone disabled
- COEP/COOP headers for AR module imports from CDN
- Cache-control headers for admin routes (no-store)

**Image Optimization:**
- Cloudinary domain whitelisting
- External image support for responsive delivery

---

## Strengths & Architecture Highlights

1. **Scalable Data Model** - Normalized schema with proper relationships and indexes
2. **Type Safety** - Prisma for database type safety, Node types configured
3. **API-First Design** - Clean separation between frontend and backend
4. **Security-Conscious** - Admin session protection via HTTP-only cookies, permission policies, CORS handling
5. **AR-Optimized** - Dedicated routes and headers for AR experiences with iframes to isolate MindAR/GSAP
6. **Internationalization** - Indian-specific validation (phone, pincode formats)
7. **CDN-Based AR** - Efficient use of CDN resources (MindAR, GSAP) without npm bloat
8. **Engagement Tracking** - Scan count metrics for AR experiences and analytics

---

## Potential Enhancement Areas

1. **Payment Processing** ⚠️ - Currently only COD (Cash-on-Delivery) is functional. Schema fields exist for Razorpay/Stripe but payment gateway integration is not yet implemented
2. **Email Notifications** ⚠️ - Customer emails are collected but no SMTP service (nodemailer, SendGrid, etc.) is configured. Customers see "we'll email you" UI text but no automated emails are sent
3. **Analytics Dashboard** - Real-time sales metrics and AR engagement stats (admin/analytics page exists but may need data visualization)
4. **Inventory Management** - Low stock alerts, stockout handling, reorder automation
5. **User Accounts** - Customer login to view order history, saved addresses, wishlist
6. **AR Templates** - Pre-built theme system instead of single "love" theme
7. **Mobile App** - Native AR scanning via React Native
8. **Advanced Search & Filtering** - Product search with categories, price filters, tags
9. **Reviews & Ratings** - Customer feedback and rating system
10. **Multi-language Support** - Internationalization (i18n) for different markets
11. **Order Status Notifications** - SMS or in-app notifications for order tracking
12. **Bulk Email Campaigns** - Email marketing for abandoned carts, re-engagement

---

## File Manifest

### Configuration
- `package.json` - Project metadata and dependencies
- `next.config.mjs` - Next.js configuration
- `prisma.config.ts` - Prisma setup
- `tsconfig.json` / `jsconfig.json` - Compiler options
- `tailwind.config.mjs` - Tailwind customization
- `eslint.config.mjs` - Linting rules
- `postcss.config.mjs` - CSS processing
- `components.json` - Component library config

### Pages (App Router)
- 13 page routes (landing, shop, checkout, admin, etc.)
- 2 admin auth routes (login, dashboard)
- Dynamic routes for keychains, stickers, and admin sections

### API Routes
- 11 route.js files providing REST endpoints
- Admin, product, order, experience, and tracking APIs

### Components
- 9 React components (AR scenes, UI, overlays)
- UI component system for consistency

### Database
- 5 Prisma models (ARExperience, StickerExperience, Product, Order, OrderItem)
- PostgreSQL with optimized indexes

### Utilities
- 2 hook files for AR document management
- Central utils file for validation and formatting
- Singleton Prisma client

---

## Summary

SCANOVA is a well-architected, feature-rich AR e-commerce platform built on modern Next.js fundamentals. It demonstrates solid separation of concerns, appropriate use of databases and ORMs, robust validation patterns, and security awareness. The system successfully bridges physical merchandise with digital AR experiences, creating a compelling user experience while maintaining flexibility for future enhancements and scaling.
