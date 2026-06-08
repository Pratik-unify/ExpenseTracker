# Expense Tracker (₹)

A modern, simple, and clean personal expense tracking application built using the MERN stack (MongoDB, Express, React, Node) with Tailwind CSS v4.

---

## 🚀 Features

* **Visual Analytics**: Interactive native SVG donut chart summarizing expense distribution by category (Food, Bills, Travel, etc.).
* **Budget Tracking**: Live progress bar tracking monthly expenditures against a target budget of ₹15,000.
* **Modern Interface**: Designed using custom brand typography (IBM Plex) and a warm color scheme.
* **Inline Form Submission**: Add new expenses instantly from the dashboard or navigate to a dedicated form.
* **Validation**: Restricts entry of future transaction dates with clear UI warning messages.

---

## 🛠️ Tech Stack

### Frontend (`/client/frontend`)
* **React 19** & **Vite 8**
* **Tailwind CSS v4** (CSS-first config with `@theme` variables)
* **IBM Plex** typography

### Backend (`/server`)
* **Node.js** & **Express**
* **MongoDB** (Mongoose ODM)
* **CORS** middleware enabling secure API connections

---

## 📁 Project Structure

```text
ExpenseTracker/
├── client/
│   └── frontend/          # Vite + React Frontend
│       ├── src/
│       │   ├── pages/     # Dashboard, Add, and Edit forms
│       │   ├── App.jsx    # State-based view router
│       │   └── index.css  # Tailwind v4 import & custom theme variables
│       └── index.html
├── server/                # Node.js + Express Backend
│   ├── models/            # MongoDB schemas
│   ├── server.js          # API Server entry point
│   └── .env               # Database connection keys
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
