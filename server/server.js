import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import Expense from "./models/expense.js";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// monogdb connnection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected successfully! 🎉"))
  .catch((err) => console.error("DB connection error ❌:", err));


// Routes

// POST /expenses - Create a new expense

app.post("/expenses", async (req, res) => {
  try {
    const { name, amount, type, date } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    const inputDate = new Date(date);
    const today = new Date();
    if (inputDate > today) {
      return res.status(400).json({ error: "Date cannot be in the future" });
    }

    const newExpense = new Expense({ name, amount, type, date });
    await newExpense.save();

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//  Fetch all expenses - GET
app.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 , createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching expenses" });
  }
});

//  Fetch a single expense by ID - GET
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


//  Update an existing expense - PUT
app.put("/expenses/:id", async (req, res) => {
  try {
    const { name, amount, type, date } = req.body;

    if (amount && Number(amount) <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }
    if (date && new Date(date) > new Date()) {
      return res.status(400).json({ error: "Date cannot be in the future" });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { name, amount, type, date },
      { new: true, runValidators: true } 
    );

    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// delete
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
