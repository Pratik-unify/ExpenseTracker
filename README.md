# Expense Tracker (₹)

A modern, simple, and clean personal expense tracking application built using the MERN stack (MongoDB, Express, React, Node) with Tailwind CSS v4.

---

## 🚀 Features

* **Visual Analytics**: Interactive native SVG donut chart summarizing expense distribution by category (Food, Bills, Travel, etc.).
* **Budget Tracking**: Live progress bar tracking monthly expenditures against a target budget of ₹15,000.
* **Modern Interface**: Designed using custom brand typography (IBM Plex) and a warm color scheme.
* **Single Responsibility Components**: Monolithic pages are broken down into small, loosely coupled UI elements (Form, List, Header, Stats).
* **Stateful Custom Hooks**: Decouples presentation markup from state and calculations using custom hooks (`useDashboard`, `useAddExpense`, `useEditExpense`).
* **Client-Side Routing**: Handled cleanly with React Router (v7) supporting dynamic routes (`/edit/:id` and `/add`).
* **Strict Numeric Validation**: Custom regex pattern validation (`/^\d*\.?\d*$/`) prevents the entry of negative signs, mathematical symbols, or letters inside the amount fields, with instant warnings.

---

## 🛠️ Tech Stack

### Frontend (`/client/frontend`)
* **React 19** & **Vite 8**
* **React Router v7** (`react-router-dom`)
* **Tailwind CSS v4** (CSS-first config with `@theme` variables)
* **Custom React Hooks** (`useCallback`, `useMemo`, and custom state hook containers)

### Backend (`/server`)
* **Node.js** & **Express**
* **MongoDB** (Mongoose ODM)
* **CORS** middleware enabling secure API connections

---

## 📁 Project Structure

All page-level logic, states, and operations are kept self-contained within their respective subdirectory under `pages/`, eliminating separate utility folders for loose coupling.

```text
ExpenseTracker/
├── client/
│   └── frontend/
│       ├── src/
│       │   ├── pages/               # Self-contained page folders
│       │   │   ├── Dashboard/       # Dashboard Module
│       │   │   │   ├── Dashboard.jsx        # Layout Coordinator (44 lines)
│       │   │   │   ├── useDashboard.js      # Stateful Hook (API fetches, ref, stats)
│       │   │   │   ├── DashboardHeader.jsx  # Page banner
│       │   │   │   ├── StatsOverview.jsx    # Metric indicators grid
│       │   │   │   ├── DonutChart.jsx       # SVG chart calculations
│       │   │   │   ├── ExpenseList.jsx      # List rows & loader skeletons
│       │   │   │   └── ExpenseForm.jsx      # Add form (encapsulated typing state)
│       │   │   │
│       │   │   ├── AddExpense/      # Standalone Add Page
│       │   │   │   ├── AddExpense.jsx       # Form presentation
│       │   │   │   └── useAddExpense.js     # Form hook (validation & save)
│       │   │   │
│       │   │   └── EditExpense/     # Standalone Edit Page
│       │   │       ├── EditExpense.jsx      # Form presentation
│       │   │       └── useEditExpense.js    # Form hook (params load & update)
│       │   │
│       │   ├── App.jsx              # React Router Navigation Router
│       │   └── index.css            # Tailwind CSS v4 and typography setup
│       └── index.html
├── server/                          # Node.js + Express Backend
└── README.md
```

---

## 🏃 Setup and Run Instructions

Make sure you have [Node.js](https://nodejs.org/) installed. The server is configured to connect to MongoDB Atlas via the URI in `server/.env`.

### Option A: The One-Command Way (Recommended)
You can install dependencies and run both servers from the root workspace directory:

1. **Install all dependencies** (for both server and client):
   ```bash
   npm run install:all
   ```
2. **Start both servers concurrently**:
   ```bash
   npm run dev
   ```
   *This starts the Express server (port `5000`) and Vite development server (port `5173`) in parallel.*

---

### Option B: The Manual Way (Separate Terminals)

If you prefer running the servers in separate terminal sessions:

#### 1. Run the Backend Server
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Launch the server:
   ```bash
   npm start
   ```
   *The server runs at `http://localhost:5000`.*

#### 2. Run the Frontend Client
1. In a new terminal window, navigate to the frontend directory:
   ```bash
   cd client/frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *The client opens in your browser at `http://localhost:5173`.*

---

## 📝 License
This project is for personal learning and development.
