export default function DashboardHeader({ onAddClick }) {
  return (
    <div className="flex justify-between items-center border-b border-brand-border pb-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-[7px] bg-[#2f6f4f] flex items-center justify-center text-white font-sans font-bold text-[14px] leading-none select-none">
          ₹
        </div>
        <span className="font-sans text-[20px] font-bold text-[#1a1c22]">Expense Tracker</span>
      </div>
      <button
        onClick={onAddClick}
        className="font-mono text-[13px] font-semibold text-white bg-[#2f6f4f] hover:bg-opacity-0.2 px-[17px] py-[11px] rounded-[7px] cursor-pointer transition-all "
      >
        + Add expense
      </button>
    </div>
  );
}
