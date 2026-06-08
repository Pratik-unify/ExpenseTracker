import { useState, useEffect, useRef } from "react";

export default function Dashboard({ navigateTo }) {
  const [expenses, setExpenses] = useState([]);
  
  // Embedded Form States
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Food");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const nameInputRef = useRef(null);

  // Fetch using native GET
  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://localhost:5000/expenses");
      if (!response.ok) throw new Error("Failed to fetch data");
      
      const data = await response.json();
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

  // Add Expense from embedded form
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !amount || !date) {
      alert("Please fill in all fields.");
      return;
    }

    // Validate future date
    const selectedDate = new Date(date);
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
        body: JSON.stringify({ name, amount: Number(amount), type, date })
      });
      if (!response.ok) throw new Error("Failed to save");
      
      // Clear form
      setName("");
      setAmount("");
      setType("Food");
      setDate("");
      setError("");
      
      // Refresh list
      fetchExpenses();
    } catch (error) {
      console.error(error);
      alert("Failed to save expense.");
    }
  };

  const handleClearForm = () => {
    setName("");
    setAmount("");
    setType("Food");
    setDate("");
    setError("");
  };

  const handleAddClick = () => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculations
  const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  // Current Month calculations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthExpenses = expenses.filter(item => {
    const d = new Date(item.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const thisMonthSpent = thisMonthExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  
  const budget = 15000;
  const percentUsed = Math.min(100, Math.round((thisMonthSpent / budget) * 100));

  // Category totals
  const foodSpent = expenses.filter(e => e.type === "Food").reduce((sum, e) => sum + Number(e.amount), 0);
  const billsSpent = expenses.filter(e => e.type === "Bills").reduce((sum, e) => sum + Number(e.amount), 0);
  const travelSpent = expenses.filter(e => e.type === "Travel").reduce((sum, e) => sum + Number(e.amount), 0);
  const otherSpent = expenses.filter(e => e.type !== "Food" && e.type !== "Bills" && e.type !== "Travel").reduce((sum, e) => sum + Number(e.amount), 0);

  const totalCategory = foodSpent + billsSpent + travelSpent + otherSpent || 1;
  const foodPct = (foodSpent / totalCategory) * 100;
  const billsPct = (billsSpent / totalCategory) * 100;
  const travelPct = (travelSpent / totalCategory) * 100;
  const otherPct = (otherSpent / totalCategory) * 100;

  // Donut SVG Slices
  const renderDonutSlices = () => {
    if (expenses.length === 0) {
      return (
        <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#efece4" strokeWidth="5" />
      );
    }

    let accumulatedPct = 0;
    const slices = [];

    if (foodSpent > 0) {
      slices.push({ color: "#2f6f4f", pct: foodPct, offset: 25 - accumulatedPct });
      accumulatedPct += foodPct;
    }
    if (billsSpent > 0) {
      slices.push({ color: "#5fa37e", pct: billsPct, offset: 25 - accumulatedPct });
      accumulatedPct += billsPct;
    }
    if (travelSpent > 0) {
      slices.push({ color: "#9bc7b0", pct: travelPct, offset: 25 - accumulatedPct });
      accumulatedPct += travelPct;
    }
    if (otherSpent > 0) {
      slices.push({ color: "#7a766c", pct: otherPct, offset: 25 - accumulatedPct });
      accumulatedPct += otherPct;
    }

    return slices.map((slice, index) => (
      <circle
        key={index}
        cx="18"
        cy="18"
        r="15.91549430918954"
        fill="transparent"
        stroke={slice.color}
        strokeWidth="5"
        strokeDasharray={`${slice.pct} ${100 - slice.pct}`}
        strokeDashoffset={slice.offset}
      />
    ));
  };

  const formatRupees = (val) => {
    return "₹" + Number(val).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const getChipStyle = (type) => {
    if (type === "Food") return "bg-[#2f6f4f]/10 text-[#2f6f4f]";
    if (type === "Travel") return "bg-[#3457d5]/10 text-[#3457d5]";
    if (type === "Bills") return "bg-[#a4751f]/10 text-[#a4751f]";
    return "bg-[#7a766c]/10 text-[#7a766c]";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-brand-border pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-[7px] bg-[#2f6f4f] flex items-center justify-center text-white font-sans font-bold text-[14px] leading-none select-none">
            ₹
          </div>
          <span className="font-sans text-[20px] font-bold text-[#1a1c22]">Expense Tracker</span>
        </div>
        <button 
          onClick={handleAddClick} 
          className="font-mono text-[13px] font-semibold text-white bg-[#2f6f4f] hover:bg-opacity-95 px-[17px] py-[11px] rounded-[7px] cursor-pointer transition-all active:scale-[0.98]"
        >
          + Add expense
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-brand-card border border-brand-border/60 rounded-[9px] p-5 flex flex-col justify-between min-h-[120px] shadow-xs">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.8px] text-brand-muted">Total Spent</span>
              <h2 className="font-sans text-[30px] font-bold text-[#2f6f4f] tracking-[-1px] leading-tight mt-1.5 mb-1">
                {formatRupees(totalSpent)}
              </h2>
              <span className="font-mono text-[11px] text-brand-muted">across {expenses.length} expenses</span>
            </div>

            <div className="bg-brand-card border border-brand-border/60 rounded-[9px] p-5 flex flex-col justify-between min-h-[120px] shadow-xs">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.8px] text-brand-muted">This Month</span>
              <h2 className="font-sans text-[30px] font-bold text-[#1a1c22] tracking-[-1px] leading-tight mt-1.5">
                {formatRupees(thisMonthSpent)}
              </h2>
              <div>
                <div className="w-full bg-[#efece4] h-[7px] rounded-full overflow-hidden mt-3">
                  <div 
                    className="bg-[#2f6f4f] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${percentUsed}%` }}
                  />
                </div>
                <div className="font-mono text-[11px] text-brand-muted mt-2">
                  budget {formatRupees(budget)} • {percentUsed}% used
                </div>
              </div>
            </div>

            <div className="bg-brand-card border border-brand-border/60 rounded-[9px] p-5 flex flex-col justify-between min-h-[120px] shadow-xs">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.8px] text-brand-muted mb-2">By Category</span>
              <div className="flex items-center gap-4">
                <div className="relative w-[74px] h-[74px] shrink-0">
                  <svg viewBox="0 0 36 36" className="w-[74px] h-[74px] rotate-[-90deg]">
                    {renderDonutSlices()}
                  </svg>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center text-[12px] leading-tight">
                    <span className="w-[9px] h-[9px] rounded-sm bg-[#2f6f4f] mr-1.5 shrink-0" />
                    <span className="font-sans text-brand-ink">Food</span>
                    <span className="font-mono text-brand-muted ml-auto font-semibold">{formatRupees(foodSpent)}</span>
                  </div>
                  <div className="flex items-center text-[12px] leading-tight">
                    <span className="w-[9px] h-[9px] rounded-sm bg-[#5fa37e] mr-1.5 shrink-0" />
                    <span className="font-sans text-brand-ink">Bills</span>
                    <span className="font-mono text-brand-muted ml-auto font-semibold">{formatRupees(billsSpent)}</span>
                  </div>
                  <div className="flex items-center text-[12px] leading-tight">
                    <span className="w-[9px] h-[9px] rounded-sm bg-[#9bc7b0] mr-1.5 shrink-0" />
                    <span className="font-sans text-brand-ink">Travel</span>
                    <span className="font-mono text-brand-muted ml-auto font-semibold">{formatRupees(travelSpent)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-sans text-[15px] font-bold text-brand-ink">Expenses</h3>
              <span className="font-mono text-[11px] text-brand-muted">{expenses.length} expenses</span>
            </div>

            {expenses.length === 0 ? (
              <div className="border border-dashed border-brand-border bg-brand-card rounded-[9px] p-8 text-center font-mono text-[13px] text-brand-muted">
                No expenses yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {expenses.map((expense) => (
                  <div 
                    key={expense._id} 
                    className="bg-white border border-brand-border/85 rounded-[9px] p-[13px] sm:p-[14px] flex items-center justify-between shadow-xs transition-colors hover:border-[#2f6f4f]/30"
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-sans text-[14px] font-semibold text-brand-ink leading-none">
                          {expense.name}
                        </span> 
                        <span className={`font-mono text-[9.5px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-[4px] leading-none ${getChipStyle(expense.type)}`}>
                          {expense.type}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-brand-muted">
                        {formatDate(expense.date)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-5">
                      <div className="font-mono text-[15px] font-semibold text-brand-ink">
                        {formatRupees(expense.amount)}
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => navigateTo("edit", expense._id)} 
                          className="font-mono text-[11px] border border-brand-border px-[9px] py-[5px] rounded-[6px] text-brand-muted hover:text-brand-ink hover:border-brand-border transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(expense._id)} 
                          className="font-mono text-[11px] border border-brand-border px-[9px] py-[5px] rounded-[6px] text-brand-muted hover:text-[#b4452f] hover:border-[#b4452f]/30 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-brand-card border border-brand-border/60 rounded-[9px] p-5 shadow-xs">
            <h3 className="font-sans text-[15px] font-bold text-brand-ink mb-4">Add expense</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
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
                    type="number" 
                    step="0.01" 
                    value={amount}
                    required 
                    placeholder="0.00"
                    className="w-full border border-brand-border rounded-[7px] px-[11px] py-[9px] text-[13px] text-brand-ink bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all font-medium"
                    onChange={(e) => setAmount(e.target.value)} 
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
                  onClick={handleClearForm}
                  className="font-mono text-[13px] font-semibold text-brand-ink bg-white hover:bg-brand-bg border border-brand-ink px-[17px] py-[11px] rounded-[7px] cursor-pointer text-center w-full transition-all active:scale-[0.99]"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}