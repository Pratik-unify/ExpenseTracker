import { useState } from "react";

export default function AddExpense({ navigateTo }) {
  const [formData, setFormData] = useState({ name: "", amount: "", type: "Food", date: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div style={{ border: "1px solid black", padding: "20px", marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Add Expense</h2>
        <button onClick={() => navigateTo("dashboard")}>Cancel</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Name</label>
          <input type="text" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Amount</label>
          <input type="number" step="0.01" required onChange={(e) => setFormData({...formData, amount: e.target.value})} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Type</label>
          <select onChange={(e) => setFormData({...formData, type: e.target.value})}>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Date</label>
          <input type="date" required onChange={(e) => setFormData({...formData, date: e.target.value})} />
        </div>

        <button type="submit" style={{ padding: "10px", marginTop: "10px" }}>Save Expense</button>
      </form>
    </div>
  );
}