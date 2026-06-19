# 3D Print Studio — E-Commerce Platform

A mobile-first e-commerce platform for a Malaysian 3D printing business, built as a full-stack website. Customers configure a product part-by-part, submit an order, and are redirected to WhatsApp with a pre-filled order summary — no payment gateway required (out-of-band DuitNow/TNG flow).

---

## Live Demo

> _Deploy links go here once Railway + Vercel are live._

---

## Features

- **Product configurator** — per-part colour selection (Body, Head, Switch) with live price calculation
- **WhatsApp order flow** — pre-filled `wa.me` message generated from cart; no Stripe/payment gateway needed
- **Order management** — password-protected admin panel; status progression: `PENDING → CONFIRMED → PRINTING → DONE`
- **Flexible catalogue schema** — `Product → OptionGroup → OptionValue` pattern; add new product types (fidget toys, bags) with zero schema migration
- **Denormalised order snapshots** — `selectedOptions` stored as JSON at order time; historical accuracy preserved if catalogue labels change

---

## Tech Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Backend    | Node.js, Express, TypeScript                    |
| ORM        | Prisma                                          |
| Database   | PostgreSQL (Railway)                            |
| Validation | Zod                                             |
| Frontend   | React, TypeScript, Vite, Tailwind CSS           |
| State      | Zustand                                         |
| Hosting    | Railway (API) + Vercel (client)                 |

---

## Architecture

```
3d-print-studio/
├── server/
│   ├── prisma/           # schema, migrations, seed
│   └── src/
│       ├── routes/       # Express route definitions
│       ├── controllers/  # request/response handling
│       ├── services/     # business logic
│       ├── repositories/ # all Prisma calls isolated here
│       ├── middleware/   # errorHandler, adminAuth
│       ├── validators/   # Zod schemas
│       └── utils/        # WhatsApp message builder, AppError
├── client/
│   └── src/
│       ├── pages/        # Home, Product, Admin
│       ├── components/   # PartConfigurator, VariantSelector, CartDrawer
│       ├── store/        # Zustand cart store
│       └── api/          # Axios instances + typed request fns
└── shared/
    └── types/            # Single source of truth — imported by both sides
```

**Why repositories?** All Prisma calls are isolated in the repository layer. Swapping ORM or database later only touches that layer — controllers and services stay unchanged.

**Why shared/types?** `OrderPayload` and related types are defined once and imported by both the frontend (building the request) and backend (Zod schema validation). Prevents silent drift between client payload shape and server expectations.

---

## Data Model

```
Product
  └── OptionGroup (e.g. "Body Colour", order=0)
        └── OptionValue (label, hex, priceModifier)

Order
  └── OrderItem
        ├── productId (live FK)
        ├── productName (denormalised snapshot)
        └── selectedOptions: Json  ← snapshot at purchase time
```

Each of the 8 country variants is a separate `Product` row — not variants of one parent. This allows per-country pricing, descriptions, and images without a polymorphic hack.

---

## Order Flow

```
Customer configures product
        ↓
Submits order form (name + phone)
        ↓
POST /api/orders → saved to DB (status: PENDING)
        ↓
Redirected to wa.me with pre-filled message:
  "Hi! I'd like to place an order:
   1. FIFA Trophy Clicker - Brazil
      Body: Green, Head: Gold, Switch: Black
      Qty: 2
   Total: RM XX
   Name: ...
   Contact: ..."
        ↓
Friend manually sends DuitNow/TNG details via WhatsApp
        ↓
Customer pays, sends screenshot — WhatsApp chat is the receipt
        ↓
Admin updates order status in panel
```

---

## API

### Public

| Method | Endpoint               | Description            |
| ------ | ---------------------- | ---------------------- |
| GET    | `/api/products`        | List all active products |
| GET    | `/api/products/:slug`  | Product detail + options |
| POST   | `/api/orders`          | Submit order           |

### Admin (password-protected via `x-admin-token` header)

| Method | Endpoint                         | Description         |
| ------ | -------------------------------- | ------------------- |
| GET    | `/api/admin/orders`              | List all orders     |
| PATCH  | `/api/admin/orders/:id/status`   | Update order status |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (local or Railway)
- pnpm (recommended) or npm

### Setup

```bash
# Clone
git clone https://github.com/jeremytey/3d-print-studio.git
cd 3d-print-studio

# Install dependencies
cd server && pnpm install
cd ../client && pnpm install

# Environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env
# Fill in DATABASE_URL, ADMIN_TOKEN, VITE_API_URL

# DB setup
cd server
pnpm prisma migrate dev --name init
pnpm prisma db seed

# Run dev servers
cd server && pnpm dev       # http://localhost:3001
cd client && pnpm dev       # http://localhost:5173
```

---

## Environment Variables

### server/.env

```
DATABASE_URL=postgresql://user:password@localhost:5432/printdb
ADMIN_TOKEN=your-secret-token-here
PORT=3001
CLIENT_URL=http://localhost:5173
```

### client/.env

```
VITE_API_URL=http://localhost:3001
```

---

## Deployment

**Backend → Railway**
1. Connect GitHub repo to Railway
2. Set root directory to `/server`
3. Add environment variables in Railway dashboard
4. Railway auto-detects Node.js and runs `pnpm build && pnpm start`

**Frontend → Vercel**
1. Connect GitHub repo to Vercel
2. Set root directory to `/client`
3. Add `VITE_API_URL` pointing to Railway URL
4. Vercel auto-detects Vite

---

## Author

**Jeremy Tey Jie Ming**  
Computer Science, Sunway University  
[github.com/jeremytey](https://github.com/jeremytey) · jeremy8598@gmail.com
