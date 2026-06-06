import { useState, useEffect } from "react";

export default function EditExpense({ navigateTo, id }) {
  const [formData, setFormData] = useState({ name: "", amount: "", type: "Food", date: "" });
  const [loading, setLoading] = useState(true);

  // 1. Fetch the existing data to pre-fill the form
  useEffect(() => {
    const fetchSingleExpense = async () => {
      try {
        const response = await fetch(`http://localhost:5000/expenses/${id}`);
        if (!response.ok) throw new Error("Failed to fetch specific item");
        
        const data = await response.json();
        
        const formattedDate = data.date.split("T")[0]; 
        
        setFormData({
          name: data.name,
          amount: data.amount,
          type: data.type,
          date: formattedDate
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching expense", error);
      }
    };
    fetchSingleExpense();
  }, [id]);

  // 2. PUT the updated data back to the server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to update");
      
      navigateTo("dashboard");
    } catch (error) {
      alert("Failed to update.");
    }
  };

  if (loading) return <div>Loading form...</div>;

  return (
    <div style={{ border: "1px solid black", padding: "20px", marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Edit Expense</h2>
        <button onClick={() => navigateTo("dashboard")}>Cancel</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Name</label>
          <input type="text" value={formData.name} required onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Amount</label>
          <input type="number" step="0.01" value={formData.amount} required onChange={(e) => setFormData({...formData, amount: e.target.value})} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Type</label>
          <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Date</label>
          <input type="date" value={formData.date} required onChange={(e) => setFormData({...formData, date: e.target.value})} />
        </div>

        <button type="submit" style={{ padding: "10px", marginTop: "10px" }}>Update Expense</button>
      </form>
    </div>
  );
}