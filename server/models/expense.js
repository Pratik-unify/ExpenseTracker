import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0.01, "Amount must be greater than 0"]
  },
  type: {
    type: String,
    required: [true, "Category/Type is required"],
    enum: ["Food", "Travel", "Bills", "Other"] 
  },
  date: {
    type: Date,
    required: [true, "Date is required"]
  }
}, {
  timestamps: true 
});

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;