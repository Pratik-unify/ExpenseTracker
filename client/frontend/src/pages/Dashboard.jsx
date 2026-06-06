import { useState, useEffect } from "react";

export default function Dashboard({ navigateTo }) {
  const [expenses, setExpenses] = useState([]);

  // Fetch using native GET
  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://localhost:5000/expenses");
      if (!response.ok) throw new Error("Failed to fetch data");
      
      const data = await response.json(); // Manually parse the JSON
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Delete using native DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        const response = await fetch(`http://localhost:5000/expenses/${id}`, {
          method: "DELETE"
        });
        if (!response.ok) throw new Error("Failed to delete");
        
        fetchExpenses(); // Refresh list after delete
      } catch (e) {
        alert("Could not delete item.");
      }
    }
  };

  const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid black", paddingBottom: "10px" }}>
        <h1>Expense Tracker</h1>
        <button onClick={() => navigateTo("add")} style={{ padding: "10px" }}>+ Add Expense</button>
      </div>

      <div style={{ border: "1px solid gray", padding: "20px", marginTop: "20px" }}>
        <h3>Total Spent: ${totalSpent.toFixed(2)}</h3>
        <p>Across {expenses.length} expenses</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Expenses</h3>
        {expenses.length === 0 ? (
          <div style={{ border: "1px dashed gray", padding: "20px", textAlign: "center" }}>No expenses yet.</div>
        ) : (
          expenses.map((expense) => (
            <div key={expense._id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>{expense.name}</strong> 
                <span style={{ marginLeft: "10px", padding: "3px", background: "#eee" }}>{expense.type}</span>
                <div style={{ fontSize: "12px", color: "gray" }}>{expense.date.split("T")[0]}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>${Number(expense.amount).toFixed(2)}</div>
                <button onClick={() => navigateTo("edit", expense._id)}>Edit</button>
                <button onClick={() => handleDelete(expense._id)} style={{ marginLeft: "5px" }}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}