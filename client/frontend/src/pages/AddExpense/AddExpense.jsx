import { useNavigate } from "react-router-dom";
import useAddExpense from "./useAddExpense";

export default function AddExpense() {
  const navigate = useNavigate();
  const { formData, setFormData, error, handleSubmit, handleAmountChange } = useAddExpense();

  return (
    <div className="bg-brand-card border border-brand-border rounded-lg p-5">
      <div className="flex justify-between items-center border-b border-brand-border pb-3 mb-4">
        <h2 className="text-lg font-bold text-brand-ink">Add Expense</h2>
        <button 
          onClick={() => navigate("/")}
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
            type="text" 
            inputMode="decimal"
            required 
            placeholder="0.00"
            className="w-full border border-brand-border rounded-md px-3 py-1.5 bg-brand-card text-brand-ink text-sm font-medium focus:outline-hidden focus:ring-1 focus:ring-brand-accent focus:border-brand-accent"
            onChange={handleAmountChange} 
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
