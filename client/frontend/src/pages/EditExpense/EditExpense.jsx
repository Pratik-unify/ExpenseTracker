import { useNavigate } from "react-router-dom";
import useEditExpense from "./useEditExpense";
// could have been made more reausable by passing prop from dashboard into add expense itself abuout whether we want to add or edit expense 
export default function EditExpense() {
  const navigate = useNavigate();
  const { formData, setFormData, loading, error, handleSubmit, handleAmountChange } = useEditExpense();

  if (loading) {
    return <div className="text-sm font-semibold text-brand-muted py-8 text-center">Loading details...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-brand-card border border-brand-border/60 rounded-[9px] p-6 shadow-xs">
      <div className="flex justify-between items-center border-b border-brand-border pb-3.5 mb-5">
        <h2 className="font-sans text-[16px] font-bold text-brand-ink">Edit expense</h2>
        <button
          onClick={() => navigate("/")}
          className="font-mono text-[11px] border border-brand-border px-[9px] py-[5px] rounded-[6px] text-brand-muted hover:text-brand-ink hover:border-brand-border transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="font-mono text-[9.5px] font-semibold tracking-[0.6px] uppercase text-brand-muted mb-1.5">Name</label>
          <input
            type="text"
            required
            value={formData.name}
            autoComplete="off"
            data-1p-ignore
            data-lpignore="true"
            placeholder="What was it for?"
            className="w-full border border-brand-border rounded-[7px] px-[11px] py-[9px] text-[13px] text-brand-ink bg-white focus:outline-none focus:ring-2 focus:ring-[#2f6f4f]/30 focus:border-[#2f6f4f] transition-all font-medium"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-mono text-[9.5px] font-semibold tracking-[0.6px] uppercase text-brand-muted mb-1.5">Amount</label>
            <input
              type="text"
              inputMode="decimal"
              required
              value={formData.amount}
              placeholder="0.00"
              className="w-full border border-brand-border rounded-[7px] px-[11px] py-[9px] text-[13px] text-brand-ink bg-white focus:outline-none focus:ring-2 focus:ring-[#2f6f4f]/30 focus:border-[#2f6f4f] transition-all font-medium"
              onChange={handleAmountChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-mono text-[9.5px] font-semibold tracking-[0.6px] uppercase text-brand-muted mb-1.5">Type</label>
            <select
              value={formData.type}
              className="w-full border border-brand-border rounded-[7px] px-[11px] py-[9px] text-[13px] text-brand-ink bg-white focus:outline-none focus:ring-2 focus:ring-[#2f6f4f]/30 focus:border-[#2f6f4f] transition-all font-medium cursor-pointer"
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Bills">Bills</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="font-mono text-[9.5px] font-semibold tracking-[0.6px] uppercase text-brand-muted mb-1.5">Date</label>
          <input
            type="date"
            required
            value={formData.date}
            className="w-full border border-brand-border rounded-[7px] px-[11px] py-[9px] text-[13px] text-brand-ink bg-white focus:outline-none focus:ring-2 focus:ring-[#2f6f4f]/30 focus:border-[#2f6f4f] transition-all font-mono cursor-pointer"
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        {error && (
          <div className="text-xs font-bold text-[#b4452f] text-center mt-1">
            {error}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            className="font-mono text-[13px] font-semibold text-white bg-[#2f6f4f] hover:bg-opacity-95 px-[17px] py-[11px] rounded-[7px] cursor-pointer text-center w-full transition-all active:scale-[0.99]"
          >
            Update Expense
          </button>
        </div>
      </form>
    </div>
  );
}
