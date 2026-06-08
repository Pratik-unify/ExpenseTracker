import { useState } from "react";

export default function AddExpense({ navigateTo }) {
  const [formData, setFormData] = useState({ name: "", amount: "", type: "Food", date: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate future date
    const selectedDate = new Date(formData.date);
    selectedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      setError("Cannot add a future date");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to save");
      
      navigateTo("dashboard"); // Go back on success
    } catch (error) {
      alert("Failed to save.");
    }
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-brand-border pb-3 mb-4">
        <h2 className="text-lg font-bold text-brand-ink">Add Expense</h2>
        <button 
          onClick={() => navigateTo("dashboard")}
          className="text-brand-muted hover:text-brand-ink text-xs font-bold cursor-pointer"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-xs font-bold text-brand-ink mb-1">Name</label>
          <input 
            type="text" 
            required 
            placeholder="e.g. Groceries"
            className="w-full border border-brand-border rounded-md px-3 py-1.5 bg-brand-card text-brand-ink text-sm font-medium focus:outline-hidden focus:ring-1 focus:ring-brand-accent focus:border-brand-accent"
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-bold text-brand-ink mb-1">Amount</label>
          <input 
            type="number" 
            step="0.01" 
            required 
            placeholder="0.00"
            className="w-full border border-brand-border rounded-md px-3 py-1.5 bg-brand-card text-brand-ink text-sm font-medium focus:outline-hidden focus:ring-1 focus:ring-brand-accent focus:border-brand-accent"
            onChange={(e) => setFormData({...formData, amount: e.target.value})} 
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-bold text-brand-ink mb-1">Type</label>
          <select 
            className="w-full border border-brand-border rounded-md px-3 py-1.5 bg-brand-card text-brand-ink text-sm font-medium focus:outline-hidden focus:ring-1 focus:ring-brand-accent focus:border-brand-accent cursor-pointer"
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          >
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-bold text-brand-ink mb-1">Date</label>
          <input 
            type="date" 
            required 
            className="w-full border border-brand-border rounded-md px-3 py-1.5 bg-brand-card text-brand-ink text-sm font-medium focus:outline-hidden focus:ring-1 focus:ring-brand-accent focus:border-brand-accent cursor-pointer"
            onChange={(e) => setFormData({...formData, date: e.target.value})} 
          />
        </div>

        {error && (
          <div className="text-xs font-bold text-[#b4452f] text-center mt-1">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="w-full bg-brand-accent hover:bg-opacity-90 text-brand-card font-bold rounded-md py-2.5 text-sm cursor-pointer mt-2"
        >
          Save Expense
        </button>
      </form>
    </div>
  );
}