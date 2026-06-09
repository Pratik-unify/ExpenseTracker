import DonutChart from "./DonutChart";

const formatRupees = (val) => {
  return "₹" + Number(val).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export default function StatsOverview({
  loading,
  expenses,
  totalSpent,
  thisMonthSpent,
  budget,
  percentUsed,
  foodSpent,
  billsSpent,
  travelSpent,
  otherSpent,
  foodPct,
  billsPct,
  travelPct,
  otherPct
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
        <div className="bg-brand-card border border-brand-border/60 rounded-[9px] p-5 flex flex-col justify-between min-h-[120px] shadow-xs">
          <div className="h-3.5 w-20 bg-brand-border/60 rounded" />
          <div className="h-8 w-32 bg-[#2f6f4f]/15 rounded mt-2 mb-1.5" />
          <div className="h-3 w-28 bg-brand-border/50 rounded" />
        </div>
        <div className="bg-brand-card border border-brand-border/60 rounded-[9px] p-5 flex flex-col justify-between min-h-[120px] shadow-xs">
          <div className="h-3.5 w-20 bg-brand-border/60 rounded" />
          <div className="h-8 w-32 bg-brand-border/60 rounded mt-2" />
          <div>
            <div className="w-full bg-brand-border/30 h-[7px] rounded-full mt-3" />
            <div className="h-3 w-28 bg-brand-border/50 rounded mt-2" />
          </div>
        </div>
        <div className="bg-brand-card border border-brand-border/60 rounded-[9px] p-5 flex flex-col justify-between min-h-[120px] shadow-xs">
          <div className="h-3.5 w-20 bg-brand-border/60 rounded mb-2" />
          <div className="flex items-center gap-4">
            <div className="w-[74px] h-[74px] rounded-full bg-brand-border/40 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-16 bg-brand-border/60 rounded" />
              <div className="h-3 w-20 bg-brand-border/60 rounded" />
              <div className="h-3 w-14 bg-brand-border/60 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Spent */}
      <div className="bg-brand-card border border-brand-border/60 rounded-[9px] p-5 flex flex-col justify-between min-h-[120px] shadow-xs">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.8px] text-brand-muted">Total Spent</span>
        <h2 className="font-sans text-[30px] font-bold text-[#2f6f4f] tracking-[-1px] leading-tight mt-1.5 mb-1">
          {formatRupees(totalSpent)}
        </h2>
        <span className="font-mono text-[11px] text-brand-muted">across {expenses.length} expenses</span>
      </div>

      {/* Monthly Budget */}
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

      {/* Category Breakdowns */}
      <div className="bg-brand-card border border-brand-border/60 rounded-[9px] p-5 flex flex-col justify-between min-h-[120px] shadow-xs">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.8px] text-brand-muted mb-2">By Category</span>
        <div className="flex items-center gap-4">
          <div className="relative w-[74px] h-[74px] shrink-0">
            <svg viewBox="0 0 38 38" className="w-[74px] h-[74px] p-2 rotate-[-90deg]">
              <DonutChart
                expenses={expenses}
                foodSpent={foodSpent}
                billsSpent={billsSpent}
                travelSpent={travelSpent}
                otherSpent={otherSpent}
                foodPct={foodPct}
                billsPct={billsPct}
                travelPct={travelPct}
                otherPct={otherPct}
              />
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
  );
}
