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
  const handleSubmit = async () => {
    // e.preventDefault();
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

  if (loading) {
    return <div className="text-sm font-semibold text-brand-muted py-8 text-center">Loading details...</div>;
  }

  return (
    <div className="bg-brand-card border border-brand-border rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-brand-border pb-3 mb-4">
        <h2 className="text-lg font-bold text-brand-ink">Edit Expense</h2>
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
            value={formData.name} 
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
            value={formData.amount} 
            required 
            placeholder="0.00"
            className="w-full border border-brand-border rounded-md px-3 py-1.5 bg-brand-card text-brand-ink text-sm font-medium focus:outline-hidden focus:ring-1 focus:ring-brand-accent focus:border-brand-accent"
            onChange={(e) => setFormData({...formData, amount: e.target.value})} 
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-bold text-brand-ink mb-1">Type</label>
          <select 
            value={formData.type} 
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
            value={formData.date} 
            required 
            className="w-full border border-brand-border rounded-md px-3 py-1.5 bg-brand-card text-brand-ink text-sm font-medium focus:outline-hidden focus:ring-1 focus:ring-brand-accent focus:border-brand-accent cursor-pointer"
            onChange={(e) => setFormData({...formData, date: e.target.value})} 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-brand-accent hover:bg-opacity-90 text-brand-card font-bold rounded-md py-2.5 text-sm cursor-pointer mt-2"
        >
          Update Expense
        </button>
      </form>
    </div>
  );
}