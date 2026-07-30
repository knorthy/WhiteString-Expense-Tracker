# WhiteString Expense Tracker — Claro

Claro is a personal finance tracker built as an internship project for Goodstring Inc. It lets users track income and expenses across multiple wallets, visualize spending patterns, and manage categories.

---

## Project Structure

```
WhiteString-Expense-Tracker/
├── backend/                          # Laravel 13 REST API
└── frontend/                         # React 19 Single Page Application
```

---

## Backend — Laravel API

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── Controller.php
│   │   │   ├── PasswordResetController.php
│   │   │   ├── TransactionController.php
│   │   │   └── WalletController.php
│   │   ├── Middleware/
│   │   │   └── HandleInertiaRequests.php
│   │   └── Requests/
│   │       ├── LoginRequest.php
│   │       ├── RegisterRequest.php
│   │       ├── TransactionRequest.php
│   │       └── WalletRequest.php
│   ├── Mail/
│   │   └── PasswordResetCodeMail.php
│   ├── Models/
│   │   ├── Transaction.php
│   │   ├── User.php
│   │   ├── UserActivityLog.php
│   │   └── Wallet.php
│   ├── Repositories/
│   │   └── TransactionRepository.php
│   └── Services/
│       └── TransactionService.php
├── database/
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 0001_01_01_000001_create_cache_table.php
│   │   ├── 0001_01_01_000002_create_jobs_table.php
│   │   ├── 2025_07_28_000000_create_transactions_table.php
│   │   ├── 2025_07_28_000001_add_user_id_to_transactions_table.php
│   │   ├── 2025_07_28_000002_create_wallets_table.php
│   │   ├── 2025_07_28_000003_add_wallet_id_to_transactions_table.php
│   │   ├── 2025_07_29_000000_create_password_reset_codes_table.php
│   │   ├── 2026_07_28_094157_create_personal_access_tokens_table.php
│   │   └── 2026_07_29_000000_create_user_activity_logs_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       └── TransactionSeeder.php
└── routes/
    └── api.php
```

### Controllers

| File | Description |
|------|-------------|
| `AuthController.php` | Handles register, login, logout, and returning the current authenticated user. On register and login it creates a Sanctum bearer token returned to the frontend. Logs every auth action into the user_activity_logs table. |
| `Controller.php` | Base controller that all other controllers extend. Empty by default. |
| `PasswordResetController.php` | Three-step password reset flow. Generates a 6-digit OTP and stores it in password_reset_codes, sends it via email through Mailtrap, verifies the code, and updates the password in the users table. |
| `TransactionController.php` | Full CRUD for transactions. Index supports filtering by type, category, and date range. Store and update delegate to TransactionService to keep wallet balances in sync. Also handles the summary endpoint that returns income and expense totals grouped by category. |
| `WalletController.php` | Full CRUD for wallets scoped to the authenticated user. The balance column is updated by TransactionService, not directly here. |

### Requests

| File | Description |
|------|-------------|
| `LoginRequest.php` | Validates that email and password are present before the login method runs. |
| `RegisterRequest.php` | Validates name format, email uniqueness against the users table, and that password confirmation matches. |
| `TransactionRequest.php` | Validates type is income or expense, amount is positive, date is not in the future, and wallet_id exists in the wallets table. |
| `WalletRequest.php` | Validates wallet_key, name, type, and that balance is a non-negative number. |

### Mail

| File | Description |
|------|-------------|
| `PasswordResetCodeMail.php` | Laravel Mailable class that accepts the 6-digit code and renders the HTML email template at resources/views/emails/password-reset-code.blade.php. Sent via Mailtrap SMTP in development. |
| `resources/views/emails/password-reset-code.blade.php` | HTML email template that displays the 6-digit OTP code in a styled green box. The $code variable is passed from PasswordResetCodeMail. This is the actual email the user receives in their inbox. Expires after 15 minutes. |

### Models

| File | Description |
|------|-------------|
| `User.php` | Maps to the users table. Has hasMany relationships to transactions and wallets. Uses Laravel Sanctum for API token authentication. Password is automatically hashed via casts. |
| `Transaction.php` | Maps to the transactions table. Has query scopes for filtering by type, category, and date range. Belongs to User and Wallet. |
| `Wallet.php` | Maps to the wallets table. Stores wallet_key, name, type, and balance. Balance is updated by TransactionService on every transaction. Belongs to User. |
| `UserActivityLog.php` | Maps to the user_activity_logs table. Records action, IP address, and user agent on every login, logout, and register. No timestamps auto-managed. |

### Repositories

| File | Description |
|------|-------------|
| `TransactionRepository.php` | Data access layer for transactions. Contains reusable query methods including getAll with filters, findById, create, update, delete, getSummary for aggregated totals, and getCategories for distinct values. Prepared for use but queries are currently handled directly in the controller. |

### Services

| File | Description |
|------|-------------|
| `TransactionService.php` | Business logic for creating, updating, and deleting transactions. Wraps all operations in a database transaction so the transactions table and wallets table stay consistent. Checks wallet balance before allowing an expense. The private adjustWalletBalance method increments or decrements the wallet balance column depending on the transaction type and whether it is being applied or reversed. |

### Migrations

| File | Description |
|------|-------------|
| `create_users_table.php` | Creates users table with name, email, password, and timestamps. |
| `create_cache_table.php` | Creates cache table used by Laravel's database cache driver. |
| `create_jobs_table.php` | Creates jobs table used by Laravel's database queue driver. |
| `create_transactions_table.php` | Creates transactions table with type, category, amount, description, and date. |
| `add_user_id_to_transactions_table.php` | Adds user_id foreign key to transactions table. |
| `create_wallets_table.php` | Creates wallets table with wallet_key, name, type, and balance columns. |
| `add_wallet_id_to_transactions_table.php` | Adds wallet_id foreign key to transactions table. |
| `create_password_reset_codes_table.php` | Creates password_reset_codes table that stores the OTP, email, and expiry timestamp. |
| `create_personal_access_tokens_table.php` | Creates personal_access_tokens table used by Laravel Sanctum for API authentication. |
| `create_user_activity_logs_table.php` | Creates user_activity_logs table for recording auth actions. |

### Routes

| File | Description |
|------|-------------|
| `api.php` | Defines all API routes. Public routes cover register, login, and password reset flow. Protected routes are wrapped in auth:sanctum middleware and cover logout, current user, full CRUD for transactions and wallets, transaction summary, and categories. |

---

## Frontend — React SPA

```
frontend/
└── src/
    ├── api/
    │   ├── auth.js
    │   ├── client.js
    │   ├── transactions.js
    │   └── wallets.js
    ├── components/
    │   ├── BreakdownChart.jsx
    │   ├── CardSwap.jsx
    │   ├── CategoryForm.jsx
    │   ├── FaultyTerminal.jsx
    │   ├── IncomeExpenseChart.jsx
    │   ├── Modal.jsx
    │   ├── Navbar.jsx
    │   ├── ProtectedRoute.jsx
    │   ├── SettingsModal.jsx
    │   ├── Sidebar.jsx
    │   ├── ToastContainer.jsx
    │   ├── TransactionForm.jsx
    │   └── WalletForm.jsx
    ├── constants/
    │   └── wallets.js
    ├── store/
    │   ├── authStore.js
    │   ├── currencyStore.js
    │   ├── toastStore.js
    │   └── walletStore.js
    ├── utils/
    │   └── currency.js
    ├── views/
    │   ├── CategoriesPage.jsx
    │   ├── DashboardPage.jsx
    │   ├── LandingPage.jsx
    │   ├── LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   ├── ResetPasswordPage.jsx
    │   ├── TransactionsPage.jsx
    │   └── WalletsPage.jsx
    ├── App.jsx
    └── main.jsx
```

### API Layer

| File | Description |
|------|-------------|
| `client.js` | Shared axios instance used by all API files. Reads the backend URL from VITE_API_URL environment variable. Attaches the Sanctum bearer token from localStorage on every request. Redirects to login on 401 responses. |
| `auth.js` | Functions for register, login, logout, getMe, forgotPassword, verifyResetCode, and resetPassword. Each maps to a public or protected route in api.php. |
| `transactions.js` | Functions for getTransactions, getTransaction, createTransaction, updateTransaction, deleteTransaction, getSummary, and getCategories. All call protected routes in api.php. |
| `wallets.js` | Functions for getWallets, createWallet, updateWalletBalance, and deleteWallet. All call protected routes in api.php. |

### Components

| File | Description |
|------|-------------|
| `BreakdownChart.jsx` | Pie chart built with Chart.js showing transaction totals grouped by category. Toggles between income and expense views. Used in DashboardPage. |
| `CardSwap.jsx` | Animated card stack component using GSAP. Cycles through cards with a drop-and-return animation. Used on LandingPage to showcase app screenshots. |
| `CategoryForm.jsx` | Form for creating and editing a category with name, type, and color fields. Used inside Modal in CategoriesPage. |
| `FaultyTerminal.jsx` | WebGL background animation using OGL that renders an animated terminal grid with configurable scanlines, glitch, flicker, and mouse interaction. Used on LandingPage and all auth pages. |
| `IncomeExpenseChart.jsx` | Bar chart built with Chart.js showing monthly income and expense totals for the last 6 months. Used in DashboardPage. |
| `Modal.jsx` | Reusable modal wrapper. Closes on Escape key or backdrop click and locks body scroll while open. Used in TransactionsPage, WalletsPage, and CategoriesPage. |
| `Navbar.jsx` | Top navigation bar shown on LandingPage only. Logo links to home, nav links scroll to page sections. |
| `ProtectedRoute.jsx` | Route wrapper that redirects to login if no user or token is found. Wraps all authenticated routes in App.jsx. |
| `SettingsModal.jsx` | Multi-section settings panel with General, Account Security, and Privacy tabs. Handles avatar upload, display name, currency selection, CSV export of transactions, and account deletion placeholder. |
| `Sidebar.jsx` | Left sidebar shown on all authenticated pages. Contains navigation links, user popup with logout and settings, and a total balance display summed from walletStore. Refreshes wallet balances on every route change. |
| `ToastContainer.jsx` | Renders active toast notifications from toastStore. Mounted once in App.jsx and visible across all pages. |
| `TransactionForm.jsx` | Form for creating and editing a transaction. Validates type, category, amount, date, and wallet. Checks wallet balance for expense transactions before allowing submit. Used in TransactionsPage. |
| `WalletForm.jsx` | Form for adding a wallet with a searchable dropdown of bank and e-wallet options and a balance field. Used in WalletsPage. |

### Constants

| File | Description |
|------|-------------|
| `wallets.js` | Static list of supported banks and e-wallets with their id, name, type, and logo image path. Used to populate the wallet dropdown and to attach logos to wallet data from the API. |

### Stores

| File | Description |
|------|-------------|
| `authStore.js` | Zustand store persisted to localStorage. Holds the current user object. Handles setUser, setAvatar, clearUser, and getFirstName. Avatar is stored separately in localStorage keyed by email so it survives logout. |
| `currencyStore.js` | Zustand store persisted to localStorage. Holds the selected currency code. Provides convert and format functions that convert PHP amounts to the selected currency and return a formatted string with the currency symbol. |
| `toastStore.js` | Zustand store not persisted. Manages a list of active toast notifications. Provides addToast and removeToast. Exports toast.success, toast.error, and toast.info helpers callable from any file. |
| `walletStore.js` | Zustand store persisted to localStorage. Holds the list of user wallets. Provides setWallets, addWallet, updateBalance, and removeWallet. |

### Utils

| File | Description |
|------|-------------|
| `currency.js` | Standalone formatPHP function that formats a number as a Philippine Peso string. Used in chart tooltips and form balance hints where the currency store is not accessible. |

### Entry Points

| File | Description |
|------|-------------|
| `main.jsx` | React app entry point. Mounts the App component into the root div in index.html. Nothing runs without this file. |
| `App.jsx` | Defines all client-side routes using React Router. Maps every URL path to its view component. Wraps authenticated routes with ProtectedRoute. Mounts ToastContainer globally so notifications work across all pages. |

### Views

| File | Description |
|------|-------------|
| `LandingPage.jsx` | Public landing page with three sections. Hero section with FaultyTerminal background. Features section with animated CardSwap component showing app screenshots. Feedback and footer section with a contact form, social links, and a large watermark. |
| `LoginPage.jsx` | Login form with email and password fields. Includes a forgot password modal with a two-step OTP flow for resetting the password. Redirects to dashboard if already authenticated. |
| `RegisterPage.jsx` | Registration form with name, email, password, and confirmation fields. Redirects to dashboard if already authenticated. |
| `ResetPasswordPage.jsx` | Standalone page for resetting a password via a link with a token and email in the URL. Used as an alternative to the modal OTP flow. |
| `DashboardPage.jsx` | Main dashboard showing current balance, total income, total expenses, a bar chart of monthly activity, and a pie chart of spending by category. Supports date range filtering. |
| `TransactionsPage.jsx` | Full list of transactions with search, type filter, and category filter. Supports create, edit, and delete via a modal form. Refreshes wallet balances after every change. |
| `WalletsPage.jsx` | Grid of wallet cards showing name, type, and balance. Supports add, adjust balance, and delete. Shows the last 5 transactions in a sidebar panel. |
| `CategoriesPage.jsx` | Table of income and expense categories with tab filtering. Supports add, edit, and delete. Default categories are seeded locally and cannot be deleted. |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Laravel 13, PHP 8.3, Laravel Sanctum, MySQL |
| Frontend | React 19, Vite, Zustand, Axios, Chart.js, GSAP, OGL |
| Email | Mailtrap (development SMTP) |
| Auth | Token-based via Laravel Sanctum |

---

## Local Setup

**Backend**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

