# Claro — Expense & Income Tracker

Claro is a full-stack personal finance tracker that helps users record, organize, and understand their income and expenses. It was built as a two-week OJT technical assessment for WhiteStrings/GoodStrings Inc., demonstrating a decoupled SPA + REST API architecture using Laravel and React.

> *"Claro. Because your finances should be too."*

**Live app:** [inextracker-119a.onrender.com](https://inextracker-119a.onrender.com)

---

## What is Claro?

Claro was built for people tired of guessing where their money went. Instead of complicated spreadsheets or cluttered banking apps, Claro gives users a clean, visual way to log transactions, organize them by wallet and category, and instantly see a breakdown of their financial habits — all in a fast, single-page interface.

---

## Features

### Authentication
- User registration and login (token-based, via Laravel Sanctum)
- Forgot password flow with a 6-digit OTP sent by email
- OTP verification and secure password reset
- Protected routes on the frontend that redirect unauthenticated users

### Transactions (Income & Expenses)
- Add, view, edit, and delete income or expense entries
- Each entry supports category, amount, description, date, and an associated wallet
- Full CRUD via a RESTful API (`/api/transactions`)
- Filter/query transactions by category and date range

### Wallets
- Create and manage multiple wallets (e.g. Cash, Bank, GCash)
- Each transaction can be tied to a specific wallet
- Wallet balances tracked independently

### Categories
- Custom categories for organizing income and expenses
- Dedicated category management page

### Dashboard & Visual Insights
- Summary of total income, total expenses, and net total (income − expenses)
- Income vs. expense breakdown chart
- Category-based breakdown chart
- Data aggregated server-side (grouped and summed by type/category) for accurate, fast reporting

### UI/UX
- Single-page scrolling landing page with alternating section backgrounds
- Animated, interactive UI elements (card stack transitions, terminal-style visual effects)
- Toast notifications for user feedback (success/error states)
- Modal-based forms for adding/editing transactions, wallets, and categories
- Fully responsive layout (mobile, tablet, desktop)

### Activity Logging
- User activity logs tracked on the backend for auditability

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Laravel 13** (PHP 8.3) | Core backend framework, MVC architecture |
| **Laravel Sanctum** | Token-based API authentication |
| **Eloquent ORM** | Database modeling and relationships |
| **MySQL / SQLite** | Relational database (SQLite used in production deployment) |
| **Repository Pattern** | Separates database/query logic from controllers for cleaner, testable code |
| **Pest / PHPUnit** | Backend testing |
| **Laravel Pint** | Code style enforcement (PSR standards) |
| **Larastan (PHPStan)** | Static analysis |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | Frontend UI library |
| **React Router** | Client-side routing / SPA navigation |
| **Zustand** | Lightweight global state management |
| **Axios** | HTTP client for communicating with the Laravel API |
| **Chart.js** | Income/expense and category breakdown visualizations |
| **GSAP** | Animations (hero section, card stack transitions) |
| **OGL** | Lightweight WebGL library for visual effects |
| **Vite** | Frontend build tool and dev server |
| **ESLint** | Code linting |

### Architecture
- **Decoupled SPA + REST API** — the frontend (`frontend/`) and backend (`backend/`) are fully separate projects within a single repository, communicating over a JSON REST API rather than server-rendered views.
- **Repository Pattern** on the backend: Controller → Repository → Model, keeping business logic out of controllers.
- **RESTful routing** (`apiResource`) for transactions and wallets, with dedicated endpoints for auth, password reset, and dashboard summary data.

### Deployment
| Service | Purpose |
|---|---|
| **Render** | Hosting for both backend (PHP web service) and frontend (static site) |
| SQLite | Production database |

---

## Project Structure

```
WhiteString-Expense-Tracker/
├── backend/                  # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/ # AuthController, TransactionController, WalletController, PasswordResetController
│   │   ├── Models/           # User, Transaction, Wallet, UserActivityLog
│   │   ├── Repositories/     # Data access layer
│   │   ├── Services/         # Business logic layer
│   │   └── Mail/             # Password reset email
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
│
├── frontend/                 # React SPA
│   └── src/
│       ├── views/            # LandingPage, DashboardPage, TransactionsPage, WalletsPage, CategoriesPage, Auth pages
│       ├── components/       # Navbar, Sidebar, Modal, TransactionForm, WalletForm, CategoryForm, Charts, etc.
│       ├── store/             # Zustand stores
│       ├── api/              # Axios API layer
│       └── utils/
│
└── render.yaml                # Deployment configuration
```

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Log in and receive an auth token |
| POST | `/api/logout` | Log out (requires auth) |
| GET | `/api/user` | Get current authenticated user |
| POST | `/api/forgot-password` | Request a password reset OTP |
| POST | `/api/verify-reset-code` | Verify the OTP |
| POST | `/api/reset-password` | Reset password using verified OTP |
| GET / POST / PUT / DELETE | `/api/transactions` | Full CRUD for transactions |
| GET | `/api/transactions/summary` | Aggregated income/expense totals and category breakdown |
| GET | `/api/categories` | List of transaction categories |
| GET / POST / PUT / DELETE | `/api/wallets` | Full CRUD for wallets |

All protected routes require a valid Sanctum bearer token.

---

## Getting Started (Local Development)

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` in the frontend `.env` to point to your local backend (e.g. `http://127.0.0.1:8000/api`).

---

## Author

Built by Tiffany "North" — OJT Intern, GoodStrings Inc. (WhiteStrings)
GitHub: [github.com/knorthy](https://github.com/knorthy)
