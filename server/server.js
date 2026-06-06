import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config"; 
import Expense from "./models/expense.js"; 


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB using the variable from your .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected successfully! 🎉"))
  .catch((err) => console.error("DB connection error ❌:", err));

// Routes
// ==========================================
// 1. POST /expenses - Create a new expense
// ==========================================
app.post("/expenses", async (req, res) => {
  try {
    const { name, amount, type, date } = req.body;

    // Server-side validation rules mandated by your spec:
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }
    
    // Check if the date is in the future
    const inputDate = new Date(date);
    const today = new Date();
    if (inputDate > today) {
      return res.status(400).json({ error: "Date cannot be in the future" });
    }

    const newExpense = new Expense({ name, amount, type, date });
    await newExpense.save();
    
    res.status(201).json(newExpense); // 201 Created
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==========================================
// 2. GET /expenses - Fetch all expenses
// ==========================================
app.get("/expenses", async (req, res) => {
  try {
    // Fetch all expenses, sorting by newest date first as preferred by UX spec
    const expenses = await Expense.find().sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching expenses" });
  }
});

// ==========================================
// 3. GET /expenses/:id - Fetch a single expense by ID
// ==========================================
app.get("/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// ==========================================
// 4. PUT /expenses/:id - Update an existing expense
// ==========================================
app.put("/expenses/:id", async (req, res) => {
  try {
    const { name, amount, type, date } = req.body;

    // Run the same server validations for updates
    if (amount && Number(amount) <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }
    if (date && new Date(date) > new Date()) {
      return res.status(400).json({ error: "Date cannot be in the future" });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { name, amount, type, date },
      { new: true, runValidators: true } // new: true returns the modified document rather than the old one
    );

    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==========================================
// 5. DELETE /expenses/:id - Delete an expense
// ==========================================
app.delete("/expenses/:id", async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server up on port ${PORT} 🚀`));
