# Angkor Social Media Marketing (SMM) Panel System

A premium, localized, full-stack Social Media Marketing (SMM) Panel built with **React.js (Vite)**, **Express.js**, and a persistent JSON database. This application features JWT authentication, multi-language support (English/Khmer), real-time simulated bank webhooks (Bakong KHQR), manual admin approvals, and a smart **AI SMM Campaign Copilot powered by Google Gemini**.

---

## 🚀 Key Features

### 👤 User Services
* **Sign Up & Sign In**: Secure registration with password hashing via `bcryptjs` and session authorization with signed JWT tokens.
* **Wallet Deposit (Bakong KHQR)**: Dynamic display of unified EMVCo payment codes for scanning from ABA Bank, Bakong, or any Cambodian mobile banking app.
* **Instant Payment Webhook**: An interactive button allows users to simulate live bank callback notifications, updating wallet balances instantly.
* **SMM Orders Creator**: Create follower packages, likes, or video views with dynamic category filters, price estimation per 1,000, and automatic validation against account balances.
* **Interactive AI Copilot**: Engage with an elite AI strategist powered by Gemini (using the `@google/genai` SDK) to tailor social media boosts and generate optimal campaign packages directly from the services catalog.

### 🛡️ Administrative Portal
* **Financial Auditing**: View, approve, or reject user-submitted manual payment receipts with automatic ledger entries.
* **Service Catalog Editor**: Add, modify, or remove social media services from the catalog with customizable minimum/maximum constraints.
* **User Management Grid**: Track all registered metrics, credit or debit user balances, and update account states.
* **Order Delivery Dispatcher**: Manage active systems, change order statuses (Pending, Processing, Completed, Cancelled), and issue automatic ledger refunds upon cancellation.

---

## 🛠️ Tech Stack & Structure

```text
├── server.ts                 # Express entry-point (Vite middleware in dev, static serves in prod)
├── server/
│   └── db.ts                 # File-based JSON Database ORM with seeding and ledger rules
├── src/
│   ├── App.tsx               # Primary React interface
│   ├── types.ts              # Universal TypeScript models
│   ├── index.css             # Tailwind styling and custom Google Web Fonts
│   ├── components/
│   │   ├── AICopilot.tsx     # Animated slide-out chat widget with Gemini API proxy
│   │   └── KHQRGenerator.tsx # Canvas/matrix generator rendering unified Cambodian bank QRs
│   └── lib/
│       └── translations.ts   # Localization dictionary (English & Khmer)
```

---

## 📦 Setting Up Locally

### Prerequisites
* **Node.js** (v18 or higher)
* **npm**

### Quickstart Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Populating `GEMINI_API_KEY` (Optional but highly recommended):
   Duplicate `.env.example` as `.env` and assign your Gemini API token:
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   ```

3. Launching in Development mode:
   ```bash
   npm run dev
   ```
   *Your server will boot on http://localhost:3000.*

4. Building & Running in Production mode:
   ```bash
   npm run build
   npm start
   ```

---

## 🐳 Running with Docker (Consistent Environment)

For easy local deployment, use the configured Docker setup:

1. Build and boot containers:
   ```bash
   docker-compose up --build -d
   ```
2. The application will be mapped to `http://localhost:3000`.
3. Stop containers:
   ```bash
   docker-compose down
   ```

---

## 🔓 Test Accounts (Pre-loaded / Dev Seeding)

To eliminate the need for manual registrations during review, the database is pre-seeded with two fully prepared accounts:

### 🛡️ System Administrator
* **Username**: `admin`
* **Password**: `admin123`
* *Provides access to: Service editor, user balances, manual deposit claim updates, and overall system charts.*

### 👤 Standard Customer
* **Username**: `user`
* **Password**: `user123`
* *Pre-loaded with a `$50.00 USD` wallet balance, active orders history, and transaction ledgers to quickly test the SMM flow.*
