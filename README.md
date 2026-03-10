# Bloomme - Sacred Flower Delivery Platform

> **Faith. Freshness. On Time.**
> Fresh puja flowers and essentials delivered to your doorstep every morning.

---

## Overview

Bloomme is a full-stack subscription-based platform that delivers fresh puja flowers and spiritual essentials to households in Faridabad, Haryana. Customers can choose from three subscription tiers, customize delivery schedules, and add optional puja items.

**Live Site:** [www.bloomme.co.in](https://www.bloomme.co.in)

---

## Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Frontend   | React 19, TypeScript, Vite 7      |
| Backend    | Express 5, TypeScript, Node.js    |
| Database   | PostgreSQL                        |
| Auth       | JWT (jsonwebtoken) + bcrypt       |
| Icons      | lucide-react                      |
| HTTP       | Axios                             |
| Hosting    | AWS EC2 (Amazon Linux 2023)       |
| Deployment | Vercel (frontend), EC2 (backend)  |

---

## Project Structure

```
PhoolPatte-master/
├── frontend/                 # React SPA
│   ├── public/images/        # Static images (hero, plans, festivals, logo)
│   ├── src/
│   │   ├── api/axios.ts      # Axios instance with JWT interceptor
│   │   ├── pages/            # All page components
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Login.tsx           # User login
│   │   │   ├── Signup.tsx          # User registration
│   │   │   ├── Plans.tsx           # Subscription plan selection
│   │   │   ├── DeliveryCustomization.tsx  # Schedule picker
│   │   │   ├── Address.tsx         # Delivery address form
│   │   │   ├── AddOns.tsx          # Optional puja essentials
│   │   │   ├── Payment.tsx         # Payment method & confirmation
│   │   │   ├── OrderSuccess.tsx    # Subscription confirmation
│   │   │   ├── Dashboard.tsx       # User subscription dashboard
│   │   │   ├── AdminPanel.tsx      # Admin statistics dashboard
│   │   │   └── Legal.tsx           # Terms, Privacy, About, Delivery & Contact
│   │   ├── styles/App.css    # Global styles + responsive breakpoints
│   │   ├── App.tsx           # Router + route definitions
│   │   └── main.tsx          # React entry point
│   ├── index.html            # HTML shell (viewport meta configured)
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json           # Vercel deployment config
│
├── backend/                  # Express API
│   ├── src/
│   │   ├── index.ts          # Server entry — port 5000
│   │   ├── db.ts             # PostgreSQL pool connection
│   │   ├── init-db.ts        # Database schema + seed data
│   │   ├── middleware/
│   │   │   └── auth.ts       # JWT auth + admin role middleware
│   │   └── routes/
│   │       ├── auth.ts       # POST /signup, /login
│   │       ├── subscriptions.ts  # Plans, subscribe, pause
│   │       └── user.ts       # Address, add-ons, admin dashboard
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                  # Environment variables (not committed)
│   └── .env.example          # Template for env setup
│
└── README.md                 # This file
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repo-url>
cd PhoolPatte-master
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env          # Edit with your database credentials
npm install
npm run init-db               # Creates tables + seeds add-on data
npm run dev                   # Starts on http://localhost:5000
```

**Environment Variables (`.env`):**

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/phool
JWT_SECRET=your_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env          # Set API URL
npm install
npm run dev                   # Starts on http://localhost:5173
```

**Environment Variables (`.env`):**

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Build for Production

```bash
# Frontend
cd frontend && npm run build    # Output: frontend/dist/

# Backend
cd backend && npm run build     # Output: backend/dist/
npm start                       # Runs compiled JS
```

---

## API Reference

**Base URL:** `http://localhost:5000/api`

### Authentication

| Method | Endpoint          | Auth | Description                         |
| ------ | ----------------- | ---- | ----------------------------------- |
| POST   | `/auth/signup`    | No   | Register new user                   |
| POST   | `/auth/login`     | No   | Login and receive JWT               |

**POST /auth/signup**
```json
// Request
{ "name": "string", "phone": "string (10 digits)", "email": "string", "password": "string (6+ chars)" }

// Response
{ "token": "jwt_string", "user": { "id", "name", "email", "phone", "role", "referral_code", "referral_points" } }
```

**POST /auth/login**
```json
// Request
{ "email": "string", "password": "string" }

// Response
{ "token": "jwt_string", "user": { ... } }
```

### Subscriptions

| Method | Endpoint               | Auth | Description                       |
| ------ | ---------------------- | ---- | --------------------------------- |
| GET    | `/subs/plans`          | No   | Get available subscription plans  |
| POST   | `/subs/subscribe`      | Yes  | Create a new subscription         |
| GET    | `/subs/my-subscription`| Yes  | Get user's active subscription    |
| POST   | `/subs/pause`          | Yes  | Pause active subscription         |

**POST /subs/subscribe**
```json
// Request (Bearer token required)
{
  "plan_type": "BASIC | PREMIUM | ELITE",
  "price": 1499,
  "delivery_days": "Daily Delivery | 3 Days Per Week | 5 Days Per Week | Weekends Only | Custom Days",
  "custom_schedule": ["Monday", "Wednesday", "Friday"],
  "add_on_ids": [1, 3, 5]
}
```

### User & Admin

| Method | Endpoint                  | Auth  | Description                     |
| ------ | ------------------------- | ----- | ------------------------------- |
| GET    | `/user/config/add-ons`    | No    | Get available add-on items      |
| POST   | `/user/address`           | Yes   | Save delivery address           |
| GET    | `/user/admin/dashboard`   | Admin | Get admin statistics            |

**POST /user/address**
```json
{
  "full_name": "string", "phone": "string",
  "house_number": "string", "street": "string",
  "area": "NIT 1 | NIT 2 | NIT 3 | NIT 5",
  "city": "Faridabad", "pin_code": "string",
  "instructions": "optional string"
}
```

### Health Check

| Method | Endpoint   | Description              |
| ------ | ---------- | ------------------------ |
| GET    | `/`        | Returns running message  |
| GET    | `/health`  | Returns `{ status: ok }` |

---

## Database Schema

### Tables

**users**
| Column          | Type         | Notes                              |
| --------------- | ------------ | ---------------------------------- |
| id              | SERIAL PK    | Auto-increment                     |
| name            | VARCHAR(100) | Required                           |
| phone           | VARCHAR(15)  | Required                           |
| email           | VARCHAR(100) | Unique, required                   |
| password        | TEXT         | Bcrypt hashed                      |
| role            | VARCHAR(20)  | Default: `'user'`                  |
| referral_code   | VARCHAR(20)  | Unique, auto-generated at signup   |
| referral_points | INT          | Default: 0                         |
| created_at      | TIMESTAMP    | Default: now()                     |

**subscriptions**
| Column          | Type         | Notes                              |
| --------------- | ------------ | ---------------------------------- |
| id              | SERIAL PK    |                                    |
| user_id         | INT FK       | References users(id)               |
| plan_type       | VARCHAR(20)  | BASIC / PREMIUM / ELITE            |
| price           | NUMERIC      | Monthly price after schedule calc   |
| status          | VARCHAR(20)  | Default: `'active'`                |
| delivery_days   | VARCHAR(50)  | Schedule type                      |
| custom_schedule | JSONB        | Array of day names                 |
| start_date      | DATE         | Default: today                     |
| created_at      | TIMESTAMP    |                                    |

**addresses**
| Column          | Type         | Notes                              |
| --------------- | ------------ | ---------------------------------- |
| id              | SERIAL PK    |                                    |
| user_id         | INT FK       | References users(id)               |
| full_name       | VARCHAR(100) |                                    |
| phone           | VARCHAR(15)  |                                    |
| house_number    | VARCHAR(50)  |                                    |
| street          | VARCHAR(100) |                                    |
| area            | VARCHAR(100) |                                    |
| city            | VARCHAR(50)  |                                    |
| pin_code        | VARCHAR(10)  |                                    |
| instructions    | TEXT         | Optional                           |

**add_ons** (seeded at init)
| Column | Type        | Notes           |
| ------ | ----------- | --------------- |
| id     | SERIAL PK   |                 |
| name   | VARCHAR(50) |                 |
| price  | NUMERIC     |                 |

Pre-seeded items: Flower Mala (30), Lotus (15), Extra Flowers (40), Agarbatti (70), Camphor (60), Cotton Batti (45)

**subscription_add_ons** (junction table)
| Column          | Type     | Notes                           |
| --------------- | -------- | ------------------------------- |
| id              | SERIAL   |                                 |
| subscription_id | INT FK   | References subscriptions(id)    |
| add_on_id       | INT FK   | References add_ons(id)          |
| one_off_date    | DATE     | For single-day add-on orders    |

**deliveries**
| Column          | Type        | Notes                          |
| --------------- | ----------- | ------------------------------ |
| id              | SERIAL PK   |                                |
| subscription_id | INT FK      | References subscriptions(id)   |
| delivery_date   | DATE        |                                |
| status          | VARCHAR(20) | Default: `'scheduled'`         |

---

## Subscription Plans

| Plan    | Price    | Contents                             | Packaging          |
| ------- | -------- | ------------------------------------ | ------------------- |
| BASIC   | ₹1499/mo | 60-100g Marigold, 3 varieties        | Eco Paper Bag       |
| PREMIUM | ₹2699/mo | 150g Rose & Jasmine Mix              | Signature Bloomme Box |
| ELITE   | ₹4499/mo | 200g Lotus & Exotic Seasonal Specials | Luxury Bloomme Box  |

### Delivery Schedule Pricing

| Schedule          | Price Multiplier |
| ----------------- | ---------------- |
| Daily Delivery    | 1.0x             |
| 5 Days Per Week   | 0.8x             |
| 3 Days Per Week   | 0.5x             |
| Weekends Only     | 0.4x             |
| Custom Days       | (days/7)x        |

---

## Frontend Pages & Routes

| Route         | Component              | Description                          |
| ------------- | ---------------------- | ------------------------------------ |
| `/`           | Home                   | Landing page with hero, plans, etc.  |
| `/login`      | Login                  | Email + password authentication      |
| `/signup`     | Signup                 | New user registration                |
| `/plans`      | Plans                  | Subscription tier selection          |
| `/delivery`   | DeliveryCustomization  | Schedule frequency picker            |
| `/address`    | Address                | Delivery address form                |
| `/addons`     | AddOns                 | Optional puja essentials             |
| `/payment`    | Payment                | Payment method + order confirmation  |
| `/success`    | OrderSuccess           | Subscription success page            |
| `/dashboard`  | Dashboard              | User's subscription management       |
| `/legal`      | Legal                  | Terms, Privacy, About, Delivery, Contact |
| `/admin`      | AdminPanel             | Admin-only statistics (protected)    |

---

## Legal & Policies Page

The `/legal` page contains all company policies in a tabbed interface sourced from the official Bloomme Terms & Conditions document:

| Tab               | Content                                            |
| ----------------- | -------------------------------------------------- |
| **About Us**      | Company overview, mission, vision                  |
| **Privacy Policy**| Data collection, usage, protection                 |
| **Terms & Refund**| Service terms, cancellation, refund conditions     |
| **Delivery Policy** | Delivery areas, timing, missed delivery policy   |
| **Contact Us**    | Website, email, phone contact details              |

---

## Responsive Design

The site is fully responsive with three breakpoints:

| Breakpoint    | Target          | Key Changes                                      |
| ------------- | --------------- | ------------------------------------------------ |
| `<= 1024px`  | Tablets         | Reduced padding, 2-col subscription details      |
| `<= 768px`   | Mobile          | Single-col grids, stacked dashboard sidebar, stacked footer |
| `<= 480px`   | Small phones    | Full-width buttons, smaller fonts, compact cards |

### Design System

- **Primary:** `#4F7942` (Sacred Green)
- **Accent:** `#D4AF37` (Light Gold)
- **Background:** `#FDFBF0` (Soft Beige)
- **Text:** `#2C3E50` (Dark)
- **Headings Font:** Outfit
- **Body Font:** Inter
- **Cards:** Glass morphism (backdrop-filter blur, rounded 24px)

---

## Service Area

Currently delivering in **Faridabad, Haryana**:
- NIT 1
- NIT 2
- NIT 3
- NIT 5

---

## User Flow

```
Home → Signup → Plans → Delivery Schedule → Address → Add-Ons → Payment → Success → Dashboard
```

1. User lands on Home page, clicks "Join Now"
2. Creates account (name, phone, email, password)
3. Selects a subscription plan (Basic / Premium / Elite)
4. Chooses delivery frequency (Daily, 3/week, 5/week, weekends, custom)
5. Enters delivery address (NIT areas in Faridabad)
6. Optionally selects add-ons (Mala, Lotus, Agarbatti, etc.)
7. Selects payment method and confirms subscription
8. Receives confirmation, redirected to Dashboard
9. Dashboard shows subscription status, calendar, referral code

---

## Admin Access

Admin users (role: `'admin'`) can access `/admin` which shows:
- Total customer count
- Active subscription breakdown by plan tier (Basic, Premium, Elite)
- Monday delivery dashboard with estimated flower requirements (kg)

---

## Contact

- **Website:** [www.bloomme.co.in](https://www.bloomme.co.in)
- **Email:** support@bloomme.co.in
- **Location:** Faridabad, Haryana, India
