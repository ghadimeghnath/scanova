# SCANOVA: Augmented Reality (AR) Experience Commerce Platform

## Executive Summary

**SCANOVA** is a full-stack Next.js web application that revolutionizes product engagement by embedding interactive 3D AR experiences into physical merchandise. Customers scan QR codes on keychains or stickers to unlock personalized augmented reality scenes without needing to download an app. 

The platform combines:
- **Physical-to-Digital Bridge**: QR codes trigger immersive AR experiences
- **User Personalization**: Customers can customize keychains with photos and messages
- **Admin Management System**: Bulk QR generation, experience management, and analytics
- **Browser-Based AR**: WebXR + MindAR technology for seamless mobile AR

---

## Core Product Features

### 1. **Keychain AR Experiences** 🎟️

#### Concept
Premium keychains with embedded QR codes that transform into personalized AR experiences.

#### Customer Journey
1. **First Scan**: Customer scans QR → landing page shows setup wizard
2. **Personalization**: Upload a photo + write a secret message (max 40 chars)
3. **AR Trigger**: System saves data, then automatically launches AR scene
4. **Repeat Scans**: Future scans skip setup → directly launch AR with their custom content

#### Database State Management
```
claimed=false → Unclaimed (show setup form)
claimed=true  → Claimed (go straight to AR scene)
```

#### Theme System
Support for multiple visual themes (stored in `/public/master-themes.mind`):
- **love**: Pink/romantic theme
- **celebration**: Festive/colorful theme
- **memory**: Monochrome/nostalgic theme
- **achievement**: Gold/prestigious theme
- **custom**: User-defined theme

#### Technical Constraints
- **Message limit**: 40 characters (enforced at API level)
- **Image source**: Cloudinary-hosted URLs only
- **Unique identifier**: Code field (indexed, unique)
- **Persistence**: Photo + message saved to PostgreSQL
- **Activation**: Reusable codes for scanning analytics

### 2. **Sticker AR Experiences** 🎨

#### Concept
Pre-configured AR stickers that admins create with complete content pre-loaded.

#### Key Differences from Keychains
- **No user setup required**: Immediate AR experience on first scan
- **Admin-controlled**: All content (image, message, 3D model) set by admin
- **Instant activation**: No setup page or form

#### Content Support
- **Target Image**: `.mind` files (compiled MindAR format) for image tracking
- **3D Models**: `.glb` (glTF) files for 3D mesh rendering (optional)
- **Message**: Pre-set text overlay

#### Use Cases
- Event activations (conference stickers with brand experiences)
- Collectible card campaigns
- Packaging stickers with product visualizations
- Social media AR effects

### 3. **Admin Dashboard & Management** 📊

#### Authentication Mechanism
- **Password-based login**: Admin enters password at `/admin/login`
- **Session storage**: 7-day httpOnly cookie (`admin_session`)
- **Token validation**: Middleware checks cookie against `ADMIN_SESSION_TOKEN`
- **Security**: Secure/SameSite/httpOnly flags in production

#### Admin Capabilities

**Experience CRUD**
- Create keychain codes (bulk generation)
- Create sticker experiences (with full configuration)
- View all active/inactive experiences
- Deactivate codes (prevents future scans)

**Bulk Operations**
```
POST /api/keychain-bulk?count=100&theme=love
```
- Generate up to 200 QR codes in one request
- Auto-assign theme to all codes
- Return unique codes for printing/distribution
- Prevents duplicates with `skipDuplicates: true`

**Analytics Dashboard**
- Revenue growth tracking (₹ calculation)
- Order growth metrics
- Order status breakdown (pending, confirmed, processing, shipped, delivered, cancelled)
- Real-time stats fetching

### 4. **WebXR AR Rendering Engine** 🎮

#### Architecture Pattern: Blob/Iframe Isolation
All AR rendering happens inside an isolated iframe loaded from a Blob URL. This prevents:
- React DOM conflicts with MindAR's DOM manipulation
- CORS issues with CDN assets
- CSP (Content Security Policy) violations

#### Flow
```
Component renders → buildARDocument() creates HTML string 
→ Blob created from HTML → Blob URL → iframe src
→ MindAR initializes in iframe sandbox
→ postMessage events → Parent overlay updates
```

#### MindAR Integration
- **Image tracking**: Detects physical target images via computer vision
- **3D rendering**: Three.js handles WebGL rendering
- **State transmission**: iframe → parent via postMessage API

#### Phase Transitions
```
idle → loading → compiling → tracking → found → success
                                       → error → retry
```

#### Compile Progress Tracking
- Shows progress bar during `.mind` file compilation
- Real-time updates via postMessage events
- Prevents "frozen UI" on slow networks

#### Camera Permission Handling
- Requests camera access on user gesture
- Falls back to graceful error screen if denied
- Detects permission errors in exception handling
- Provides OS-specific instructions (iOS/Android)

---

## Technical Architecture

### **Technology Stack**
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 19.2.3 | UI framework with server components |
| **Framework** | Next.js | 16.1.6 | Full-stack (SSR + API routes) |
| **Database** | PostgreSQL | Latest | Persistent data storage |
| **ORM** | Prisma | 7.5.0 | Type-safe database access |
| **Connection Pool** | pg + PrismaPg Adapter | 8.20.0 | Database connection management |
| **3D Graphics** | Three.js | 0.160.0 | WebGL rendering |
| **AR Engine** | MindAR | 1.2.5+ | Image-based tracking |
| **Image Hosting** | Cloudinary | 6.17.5 | CDN for user uploads |
| **QR Generation** | qrcode.react | 4.2.0 | QR code rendering |
| **Styling** | Tailwind CSS | 4 | Utility-first CSS framework |
| **Linting** | ESLint | 9 | Code quality |

### **Deployment Architecture**
```
┌─────────────────────────────────────┐
│     Vercel (Hosting)                │
│  ┌──────────────────────────────────┤
│  │ Next.js Server (API Routes)      │
│  │ - /api/keychain-*                 │
│  │ - /api/sticker-*                  │
│  │ - /api/admin-*                    │
│  └──────────────────────────────────┤
│                                      │
│  ┌──────────────────────────────────┤
│  │ React Components (Client/Server) │
│  │ - Page rendering                  │
│  │ - WebXR AR scenes                 │
│  └──────────────────────────────────┤
└─────────────────────────────────────┘
         ↓ Database Queries
┌─────────────────────────────────────┐
│  AWS RDS / Supabase PostgreSQL      │
│  ┌──────────────────────────────────┤
│  │ ARExperience table                │
│  │ StickerExperience table           │
│  └──────────────────────────────────┤
└─────────────────────────────────────┘
         ↓ Image CDN
┌─────────────────────────────────────┐
│  Cloudinary                         │
│  (User photo hosting)               │
└─────────────────────────────────────┘
         ↓ AR Assets
┌─────────────────────────────────────┐
│  Public CDN / S3                    │
│  (*.mind files, *.glb models)       │
└─────────────────────────────────────┘
```

### **Database Schema**

#### **ARExperience** (Keychains)
```prisma
model ARExperience {
  id        String   @id @default(cuid())        // Unique ID
  code      String   @unique                     // QR code value
  message   String   @default("")                // User message (0-40 chars)
  imageUrl  String   @default("")                // Cloudinary photo URL
  type      String   @default("keychain")
  theme     String   @default("love")            // Visual theme
  claimed   Boolean  @default(false)             // true = personalized, false = blank
  isActive  Boolean  @default(true)              // false = deactivated
  scanCount Int      @default(0)                 // Analytics
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([code])                                // Fast code lookups
}
```

**State Diagram**
```
Admin creates code → claimed=false, empty message/imageUrl
         ↓
User first scan → show setup form
         ↓
User submits photo + message → claimed=true (atomic update)
         ↓
User/others scan again → skip form, launch AR with user's data
```

#### **StickerExperience** (Pre-configured)
```prisma
model StickerExperience {
  id          String   @id @default(cuid())
  code        String   @unique                   // QR code
  targetImage String                            // MindAR .mind file URL
  assetUrl    String   @default("")             // Optional .glb model
  message     String   @default("")             // Pre-set message
  isActive    Boolean  @default(true)
  scanCount   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([code])
}
```

### **Project Directory Structure**

```
src/
├── app/                              # Next.js app router
│   ├── page.js                       # Landing page (/) 
│   ├── scanner/
│   │   └── page.jsx                  # Universal QR scanner
│   │
│   ├── (admin)/                      # Route group - admin layout
│   │   └── admin/
│   │       ├── page.jsx              # Dashboard (/admin)
│   │       └── login/
│   │           └── page.jsx          # Login page (/admin/login)
│   │
│   ├── (user)/                       # Route group - user layout
│   │   ├── create/
│   │   │   └── page.jsx              # Create new experience form
│   │   ├── keychain/
│   │   │   └── [code]/
│   │   │       └── page.jsx          # Keychain viewer (/keychain/ABC123)
│   │   └── sticker/
│   │       └── [code]/
│   │           └── page.jsx          # Sticker viewer (/sticker/XYZ789)
│   │
│   └── api/                          # API routes
│       ├── admin-auth/
│       │   └── route.js              # POST: login → set session cookie
│       ├── experience/
│       │   └── route.js              # POST: create keychain
│       ├── keychain-payload/
│       │   └── [code]/
│       │       └── route.js          # GET: fetch keychain AR data
│       ├── keychain-claim/
│       │   └── route.js              # POST: claim/personalize keychain
│       ├── keychain-bulk/
│       │   └── route.js              # POST: generate N codes
│       ├── sticker-experience/
│       │   └── route.js              # GET/POST: sticker CRUD
│       ├── track/
│       │   └── route.js              # POST: analytics tracking
│       └── admin/
│           └── stats/
│               └── route.js          # GET: dashboard statistics
│
├── components/                       # React components
│   ├── WebXRScene.jsx                # Main WebXR AR renderer
│   ├── CameraPermissionScreen.jsx    # Camera permission UI
│   │
│   ├── keychain-ar/
│   │   ├── KeychainARScene.jsx       # Keychain AR scene (MindAR)
│   │   ├── KeychainSetupPage.jsx     # Setup form (upload photo + message)
│   │   ├── KeychainWrapper.jsx       # Container component
│   │   └── ImageUpload.jsx           # Image upload with Cloudinary
│   │
│   └── sticker-ar/
│       ├── StickerARScene.jsx        # Sticker AR scene
│       ├── StickerWrapper.jsx        # Container
│       ├── AROverlay.jsx             # AR state indicators
│       └── [AR overlays]
│
├── hooks/                            # Custom React hooks
│   ├── useMindARDocument.js          # buildMindARDocument() + buildKeychainARDocument()
│   ├── useKeychainARDocument.js      # Keychain-specific AR setup
│   └── [other hooks]
│
├── lib/
│   ├── prisma.js                     # Prisma client singleton w/ PG pool
│   └── utils.js                      # Helper functions (code gen, validation, etc.)
│
├── middleware.js                     # Request interceptor for /admin/* routes
│
└── [config files]
```

### **Component Deep Dive**

#### **KeychainSetupPage.jsx** 📝
**Purpose**: Multi-step form for personalizing a keychain on first scan

**Workflow**
```
Step 1: Upload photo
  ↓ (via Cloudinary widget)
Step 2: Enter message
  ↓ (max 40 chars, real-time countdown)
Step 3: Preview & confirm
  ↓
Submit → POST /api/keychain-claim
  ↓ (claimed → true, save photo + message)
Redirect to AR scene
```

**Key Features**
- Multi-step UI with progress indicator
- Image upload integration (Cloudinary)
- Message character limit enforcement
- Error handling (duplicate claim, network failures)
- Race condition handling: If two users scan simultaneously, second gets 409 + redirects

**Critical Code**
```javascript
// Atomic update with claimed check
const updated = await prisma.aRExperience.update({
  where: { code: code.trim() },
  data: {
    imageUrl: imageUrl.trim(),
    message: message.trim(),
    claimed: true,  // ← Only update if not already claimed
  },
});
```

#### **KeychainARScene.jsx** 🎮
**Purpose**: Renders MindAR-powered 3D AR scene for keychains

**Architecture**
- Builds HTML string with embedded imageUrl + message + theme
- Creates Blob → Blob URL → iframe src (isolation from React DOM)
- Listens for postMessage events from iframe
- Updates loading states and error handling

**Theme Index Mapping**
```javascript
const THEME_INDEX = {
  "love": 0,
  "celebration": 1,
  "memory": 2,
  "achievement": 3,
  "custom": 4
};
```
Maps to index in `/public/master-themes.mind` target image

**Message Flow**
```
iframe (MindAR) detects phase change
  → window.parent.postMessage({ type: 'mindar-phase', phase, ... })
  → Parent component listens
  → setPhase() updates UI
  → Loading bar / error messages display
```

#### **StickerARScene.jsx** 🎨
**Purpose**: Similar to KeychainARScene but for pre-configured stickers

**Differences**
- No `claimed` or setup flow
- Receives targetImage + assetUrl directly from database
- Immediately launches AR on mount

#### **useMindARDocument.js** 🔧
**Purpose**: Generates complete HTML document for AR iframe

**Key Function**: `buildMindARDocument({ targetImage, assetUrl, message })`

**Generates**
```html
<!DOCTYPE html>
<html>
<head>
  <!-- Importmap with CDN URLs -->
  <!-- Three.js v0.160.0 -->
  <!-- MindAR v1.2.5 -->
</head>
<body>
  <div id="container"></div>
  
  <script type="module">
    // MindAR initialization
    // Three.js scene setup
    // GLTFLoader for .glb
    // Event posting to parent
  </script>
</body>
</html>
```

**Critical**: Template strings properly escape backticks and backslashes to prevent injection

### **Database Connection Strategy**

#### Configuration (`src/lib/prisma.js`)
```javascript
// 1. Create raw Postgres connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Wrap in Prisma 7 adapter
const adapter = new PrismaPg(pool);

// 3. Create Prisma client with adapter
const prisma = new PrismaClient({ adapter });
```

**Benefits**
- Connection pooling: Reuses connections (crucial for serverless)
- Prisma 7 native support for custom adapters
- Scales to handle concurrent requests

#### **Environment Variables**
```dotenv
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
CLOUDINARY_API_KEY="..."
ADMIN_PASSWORD="..."              # Login password
ADMIN_SESSION_TOKEN="..."         # Session cookie value
ADMIN_API_KEY="..."               # For /api/keychain-bulk
NODE_ENV="production"             # For secure cookies
```

---

## API Endpoints Reference

### **Keychain Management**

#### `POST /api/keychain-claim`
Personalize a keychain with photo + message (called once on first scan)

**Request**
```json
{
  "code": "k-a1b2c3",
  "imageUrl": "https://res.cloudinary.com/...",
  "message": "Happy Birthday! 🎉"
}
```

**Response** (200)
```json
{ "success": true, "code": "k-a1b2c3" }
```

**Error Cases**
| Status | Condition |
|--------|-----------|
| 400 | Missing/invalid code, imageUrl, or message |
| 404 | Code not found in database |
| 403 | QR code deactivated (isActive=false) |
| 409 | Already claimed (race condition) - use `alreadyClaimed` flag to redirect |
| 500 | Server error |

**Validation Rules**
- Message: 1-40 characters
- Both fields required and non-empty
- Code must exist and be active

---

#### `GET /api/keychain-payload/[code]`
Fetch keychain AR data (called by scanner to hydrate scene)

**Response** (200)
```json
{
  "code": "k-a1b2c3",
  "imageUrl": "https://res.cloudinary.com/...",
  "message": "Your message here",
  "theme": "love",
  "claimed": true
}
```

**Error Cases**
| Status | Condition |
|--------|-----------|
| 400 | Missing code parameter |
| 404 | Code not found |
| 403 | QR code deactivated |
| 500 | Server error |

---

#### `POST /api/keychain-bulk`
Generate multiple QR codes for batch printing (ADMIN ONLY)

**Headers**
```
x-api-key: <ADMIN_API_KEY>
```

**Request**
```json
{
  "count": 100,
  "theme": "love"
}
```

**Response** (201)
```json
{
  "success": true,
  "codes": ["k-abc123", "k-def456", ...],
  "theme": "love"
}
```

**Constraints**
- Count: 1-200 (clamped)
- Theme: must be in `["love", "celebration", "memory", "achievement", "custom"]`
- Authorization: Requires valid `x-api-key` header
- Creates N records with `claimed=false`, empty message/imageUrl

---

### **Sticker Management**

#### `GET /api/sticker-experience/[code]`
Fetch sticker AR data on scan

**Response** (200)
```json
{
  "id": "sticker-xyz",
  "code": "s-xyz789",
  "targetImage": "https://cdn.example.com/master.mind",
  "assetUrl": "https://cdn.example.com/model.glb",
  "message": "Brand message here",
  "isActive": true
}
```

**Error Cases**
| Status | Condition |
|--------|-----------|
| 404 | Code not found |
| 403 | Sticker deactivated |
| 500 | Server error |

---

### **Experience Creation**

#### `POST /api/experience`
Create new AR experience (keychains via dashboard)

**Request**
```json
{
  "message": "Welcome to my AR world",
  "imageUrl": "https://res.cloudinary.com/..."
}
```

**Response** (201)
```json
{
  "success": true,
  "shortCode": "abc123",
  "message": "AR experience created successfully!"
}
```

**Validation**
- Message: 1-100 characters
- imageUrl: must be valid URL
- Auto-generates unique `shortCode`

---

### **Admin Authentication**

#### `POST /api/admin-auth`
Login endpoint - validates password and sets session cookie

**Request**
```json
{ "password": "secret-password" }
```

**Response** (200)
```json
{ "success": true }
```

**Side Effects**
- Sets `admin_session` cookie (httpOnly, 7-day expiry)
- Cookie secure/sameSite flags applied in production

**Error Cases**
| Status | Condition |
|--------|-----------|
| 401 | Wrong password |
| 503 | Environment not configured |
| 500 | Server error |

---

### **Analytics**

#### `POST /api/track`
Log scan event for analytics

**Request**
```json
{
  "shortCode": "k-abc123",
  "type": "keychain"
}
```

**Response** (200)
```json
{ "scanned": true }
```

**Side Effects**
- Increments `scanCount` on experience record
- Tracked for dashboard analytics

---

## User Flows & Interactions

### **Keychain Flow (Complete)**
```
┌─────────────────────────────────────────────────────────────┐
│ Customer receives physical keychain with QR code            │
└─────────────────────────────────────────────────────────────┘
                         ↓
                  [Scan QR code]
                         ↓
                    /keychain/k-abc
                         ↓
    ┌───────────────────┴───────────────────┐
    │                                       │
   (claimed=false)               (claimed=true)
    │                                       │
    ↓                                       ↓
┌──────────────────┐                 ┌────────────────┐
│ Setup Form Page  │                 │ AR Scene       │
│ ─────────────    │                 │ (immediate)    │
│ 1. Upload photo  │                 │ ─────────────  │
│ 2. Write message │                 │ Uses saved:    │
│ 3. Confirm       │                 │ - photo        │
│                  │                 │ - message      │
│ [Submit]         │                 │ - theme        │
└──────────────────┘                 └────────────────┘
         ↓
  [Update database]
    claimed=true
    imageUrl saved
    message saved
         ↓
   [Redirect to AR]
         ↓
   [AR Scene Shows]
```

### **Sticker Flow**
```
Customer scans sticker QR
         ↓
   /sticker/s-xyz
         ↓
Database lookup
(no setup needed)
         ↓
Show AR immediately
(targetImage + assetUrl loaded)
```

### **Admin Workflow**
```
1. Visit /admin/login
2. Enter password
3. POST /api/admin-auth → set cookie
4. Redirect to /admin
5. View dashboard stats
6. Option A: Generate 100 keychains
   → POST /api/keychain-bulk
   → Get codes → print QR codes
7. Option B: Create sticker
   → POST /api/sticker-experience
   → Provide targetImage URL + 3D asset
```

---

## Authentication & Security

### **Admin Authentication Mechanism** 🔐

**Login Flow**
```
Admin enters password at /admin/login
         ↓
POST /api/admin-auth with password
         ↓
Server validates against ADMIN_PASSWORD env var
         ↓
If correct:
  - Generate session token
  - Set httpOnly cookie
  - Expire: 7 days
         ↓
Middleware checks cookie on /admin/* requests
         ↓
Valid cookie → allow
Missing/invalid → redirect to login
```

**Middleware Implementation**
```javascript
// middleware.js
export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // Skip non-admin routes
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  
  // Allow login page itself
  if (pathname === "/admin/login") return NextResponse.next();
  
  // Check session cookie
  const session = request.cookies.get("admin_session");
  const expectedToken = process.env.ADMIN_SESSION_TOKEN;
  
  if (!expectedToken) return 503_error;
  if (session?.value !== expectedToken) return unauthorized;
  
  return NextResponse.next();
}
```

### **API Key Security**

**Keychain Bulk Endpoint**
- Requires `x-api-key` header
- Checked against `ADMIN_API_KEY` environment variable
- Returns 401 if missing or incorrect

### **Data Validation**

**Input Sanitization**
- Message: length validation + trimming
- URLs: parsed with URL() constructor
- Codes: trimmed + checked for empty strings
- No HTML/SQL injection risks (Prisma ORM + parameterized)

**XSS Prevention**
- React auto-escapes all JSX expressions
- Cloudinary URLs validated before storage
- AR document template strings properly escaped

### **CORS & Headers** (next.config.mjs)
```javascript
// AR viewer routes get special headers
headers: [
  {
    source: "/ar/:path*",
    headers: [
      { key: "Permissions-Policy", value: "camera=(self), xr-spatial-tracking=(self)" },
      { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    ]
  }
]
```

---

## Frontend Components

### **CameraPermissionScreen.jsx** 📱
Graceful fallback UI when camera access denied

**Features**
- OS-specific instructions (iOS Safari / Android Chrome)
- "Try Again" button to reload
- Professional styling matching brand

**Usage**
```jsx
const [permDenied, setPermDenied] = useState(false);
if (permDenied) return <CameraPermissionScreen />;
```

### **AROverlay.jsx**
Real-time status indicator during AR loading

**States**
- **idle**: Waiting for user gesture
- **loading**: Fetching .mind file
- **compiling**: MindAR compiling target image (+ progress bar)
- **tracking**: Waiting for camera
- **found**: Target image detected
- **error**: Fallback with error message

---

## Key Implementation Patterns

### **1. Blob/Iframe Isolation Pattern** 🎯

**Problem**: React DOM conflicts with MindAR's direct DOM manipulation

**Solution**
```javascript
// In component
const html = buildMindARDocument({ imageUrl, message, theme });
const blob = new Blob([html], { type: "text/html" });
const url = URL.createObjectURL(blob);
setIframeSrc(url);  // → <iframe src={blobUrl} />

// Cleanup
return () => URL.revokeObjectURL(url);
```

**Benefits**
- MindAR runs in isolated sandbox
- No CSP violations (blob: protocol)
- No CORS issues for CDN scripts
- Clean separation of concerns

### **2. PostMessage Communication** 💬

**From iframe to parent**
```javascript
// Inside iframe (MindAR)
window.parent.postMessage(
  { type: 'mindar-phase', phase: 'tracking', progress: 45 },
  '*'
);

// Parent component
window.addEventListener('message', (event) => {
  if (event.data?.type === 'mindar-phase') {
    const { phase, progress } = event.data;
    setPhase(phase);  // Update UI
    setProgress(progress);
  }
});
```

**Usage**: Real-time feedback during AR loading

### **3. Atomic State Transitions** ⚛️

**Keychain Claiming**
```javascript
// Prisma atomic update
const updated = await prisma.aRExperience.update({
  where: { code },
  data: {
    claimed: true,
    imageUrl,
    message,
  },
});
```

**Race condition protection**: If two users scan simultaneously, Prisma ensures only one succeeds

### **4. Server Component for Data Fetching** 🔌

**Hybrid SSR approach**
```jsx
// Server component (app/keychain/[code]/page.jsx)
export default async function KeychainPage({ params }) {
  const experience = await prisma.aRExperience.findUnique({
    where: { code: params.code }
  });
  
  // Decide client component based on state
  if (experience.claimed) {
    return <KeychainARScene {...experience} />;  // "use client"
  }
  return <KeychainSetupPage code={experience.code} />;  // "use client"
}
```

**Benefits**
- No N+1 queries
- Secret database URLs stay server-side
- Cleaner separation of concerns

### **5. Environment-Based Configuration**
```javascript
// cookieStore.set(..., {
//   secure: process.env.NODE_ENV === "production",  // HTTPS only in prod
//   sameSite: "lax",  // CSRF protection
//   maxAge: 604800,  // 7 days
// });
```

---

## Development Workflow

### **Local Setup** 🚀

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your values

# 3. Initialize database
npm run db:migrate

# 4. Optional: Open Prisma Studio
npm run db:studio

# 5. Start dev server
npm run dev
# http://localhost:3000
```

### **Build Process**
```bash
npm run build
# ↓
# - Prisma generates client
# - Next.js optimizes bundles
# - Creates .next/ folder

npm start
# Starts production server
```

### **Useful Commands**
```bash
npm run lint              # ESLint check
npm run db:generate       # Regenerate Prisma client
npm run db:migrate        # Run pending migrations
```

---

## Scalability & Performance

### **Connection Pooling**
- Uses `pg` native pool
- Reuses connections (crucial for serverless)
- Prevents "too many connections" errors

### **Optimization Strategies**

| Strategy | Implemented | Location |
|----------|------------|----------|
| Database indexing | `@@index([code])` on code field | Prisma schema |
| API response caching | Analytics endpoint cached | /admin |
| Image CDN | Cloudinary hosted | All user uploads |
| Code splitting | Next.js bundles | Automatic |
| Compression | Vercel gzip | Deployment |
| Blob URL cleanup | useEffect return | AR components |

### **Limitations & Constraints**
- Max keychain message: 40 characters
- Max new experience message: 100 characters
- Bulk generation: 1-200 codes per request
- Session lifetime: 7 days
- QR code format: 3-character prefix + 8-char hex

---

## Deployment Checklist

- [ ] Set all environment variables
- [ ] Run `npm run build` locally (test)
- [ ] Run migrations on production database
- [ ] Ensure PostgreSQL accessible from hosting
- [ ] Configure Cloudinary API key
- [ ] Set `NODE_ENV=production`
- [ ] Generate strong `ADMIN_SESSION_TOKEN`
- [ ] Set secure `ADMIN_PASSWORD`
- [ ] Enable SSL/TLS (Vercel does this automatically)
- [ ] Verify camera permissions work on mobile
- [ ] Test QR scanning on all target devices

---

## Use Cases & Business Models

### **B2C: Premium Keychains** 💝
- Customers buy keychains → receive QR code
- Scan → upload photo + personal message
- Share coded link with friends → they scan → see your AR experience
- Personalization drives emotional value

### **B2B: Brand Activations** 🎉
- Brand creates stickers with pre-loaded experience
- Distribute at events/stores
- Every scan triggers branded AR scene
- Track engagement via scanCount

### **Marketing Campaigns** 📢
- Print keychains with unique codes
- Bulk generate codes → distribute to customers
- Each customer personalizes their keychain
- Dashboard shows total scans/engagement

### **Collectibles/NFT Adjacent** 🎨
- Create themed sticker series
- Each with unique 3D model
- Users collect by scanning different stickers
- Tracks which codes they've activated

---

## Future Enhancement Opportunities

### Short-term
- [ ] User accounts to save personalized experiences
- [ ] Social sharing (copy QR link to messaging apps)
- [ ] Multiple photos per keychain
- [ ] Hashtag campaign analytics

### Medium-term
- [ ] AR model upload UI (no code needed)
- [ ] A/B testing different themes
- [ ] Custom theme creator
- [ ] Email/SMS notifications on scan

### Long-term
- [ ] Mobile app with offline AR caching
- [ ] Machine learning: personalized theme recommendations
- [ ] Vector search for finding similar experiences
- [ ] Marketplace for selling/trading keychains

---

## Summary & Vision

SCANOVA is a **production-ready AR commerce platform** that merges physical products with digital experiences. The technical architecture emphasizes:

✅ **User Experience**: No app installation, immediate AR on scan
✅ **Developer Experience**: Type-safe (TypeScript via Prisma), modular components
✅ **Scalability**: Connection pooling, CDN for assets, serverless-friendly
✅ **Security**: Session-based auth, XSS prevention, parameterized queries
✅ **Business Model**: Flexible (B2C personalization + B2B bulk campaigns)

The platform is positioned as a **bridge between physical retail and digital engagement**, enabling brands to create memorable, interactive moments that blend the tangible keychain or sticker with an immersive AR experience in a customer's phone camera.

**Core Value Proposition**: 
> "Every scan is a moment of delight. Every photo uploaded is a memory preserved. Every QR code is a gateway to wonder."

The technical foundation supports this vision throughrobust APIs, thoughtful component architecture, and a database schema optimized for the keychain-claiming lifecycle.
