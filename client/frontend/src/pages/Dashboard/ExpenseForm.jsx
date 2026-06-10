import { useState } from "react";

const isFutureDate = (dateString) => {
  if (!dateString) return false;
  const selectedDate = new Date(dateString);
  selectedDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate > today;
};

export default function ExpenseForm({ nameInputRef, onSave }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Food");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const handleAmountChange = (e) => {
    const val = e.target.value;
    const regex = /^\d*\.?\d*$/;
    if (!regex.test(val)) {
      setError("Only positive numbers are allowed");
      return;
    }
    setError("");
    setAmount(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !amount || !date) {
      alert("Please fill in all fields.");
      return;
    }

    if (isFutureDate(date)) {
      setError("Cannot add a future date");
      return;
    }

    const success = await onSave({ name, amount: Number(amount), type, date });
    if (success) {
      setName("");
      setAmount("");
      setType("Food");
      setDate("");
      setError("");
    }
  };

  const handleClear = () => {
    setName("");
    setAmount("");
    setType("Food");
    setDate("");
    setError("");
  };

  return (
    <div className="bg-brand-card border border-brand-border/60 rounded-[9px] p-5 shadow-xs">
      <h3 className="font-sans text-[15px] font-bold text-brand-ink mb-4">Add expense</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="font-mono text-[9.5px] font-semibold tracking-[0.6px] uppercase text-brand-muted mb-1.5">Name</label>
          <input
            ref={nameInputRef}
            type="text"
            value={name}
            required
            placeholder="What was it for?"
            className="w-full border border-brand-border rounded-[7px] px-[11px] py-[9px] text-[13px] text-brand-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all font-medium"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-mono text-[9.5px] font-semibold tracking-[0.6px] uppercase text-brand-muted mb-1.5">Amount</label>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              required
              placeholder="0.00"
              className="w-full border border-brand-border rounded-[7px] px-[11px] py-[9px] text-[13px] text-brand-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all font-medium"
              onChange={handleAmountChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-mono text-[9.5px] font-semibold tracking-[0.6px] uppercase text-brand-muted mb-1.5">Type</label>
            <select
              value={type}
              className="w-full border border-brand-border rounded-[7px] px-[11px] py-[9px] text-[13px] text-brand-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all font-medium cursor-pointer"
              onChange={(e) => setType(e.target.value)}
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
            value={date}
            required
            className="w-full border border-brand-border rounded-[7px] px-[11px] py-[9px] text-[13px] text-brand-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all font-mono cursor-pointer"
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {error && (
          <div className="text-xs font-bold text-[#b4452f] text-center mt-1">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2">
          <button
            type="submit"
            className="font-mono text-[13px] font-semibold text-white bg-[#2f6f4f] hover:bg-opacity-95 px-[17px] py-[11px] rounded-[7px] cursor-pointer text-center w-full transition-all active:scale-[0.99]"
          >
            Save expense
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="font-mono text-[13px] font-semibold text-brand-ink bg-white hover:bg-brand-bg border border-brand-ink px-[17px] py-[11px] rounded-[7px] cursor-pointer text-center w-full transition-all active:scale-[0.99]"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
