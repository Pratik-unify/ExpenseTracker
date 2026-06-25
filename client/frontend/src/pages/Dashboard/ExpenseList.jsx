import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../Dashboard/SearchBar";
import { DashboardContext } from "./useDashboard";

// this function formats the number to Indian Rupees format with commas and two decimal places
const formatRupees = (val) => {
  return "₹" + Number(val).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// this function formats the date to a more readable format like "Jan 01, 2023"

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  // padStart is used to ensure that the day is always two digits 
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

export default function ExpenseList() {
  const navigate = useNavigate();
  const { loading, filteredExpenses: expenses, handleDelete: onDelete, searchTerm } = useContext(DashboardContext);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Reset to first page when search changes , as we want to show only the searched items so they come on the first page 
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // pagination has been applied only on the client side , taken all the expenses and just sliced the expense array to display required items 
  const totalPages = Math.max(1, Math.ceil(expenses.length / ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);

  // display current page items
  const displayedExpenses = expenses.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-sans text-[15px] font-bold text-brand-ink">Expenses</h3>
        {loading ? (
          <div className="h-3 w-16 bg-brand-border/60 rounded animate-pulse" />
        ) : (
          <span className="font-mono text-[11px] text-brand-muted">{expenses.length} expenses</span>
        )}
      </div>
      {/* different ui for loading state  */}
      <SearchBar />
      {loading ? (
        <div className="space-y-2.5 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-brand-border/85 rounded-[9px] p-[13px] sm:p-[14px] flex items-center justify-between shadow-xs"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-4 w-32 bg-brand-border/60 rounded" />
                  <div className="h-3.5 w-12 bg-brand-border/60 rounded" />
                </div>
                <div className="h-3 w-20 bg-brand-border/40 rounded" />
              </div>

              <div className="flex items-center gap-5">
                <div className="h-5 w-16 bg-brand-border/60 rounded" />
                <div className="flex items-center gap-2">
                  <div className="h-7 w-10 bg-brand-border/40 rounded animate-none" />
                  <div className="h-7 w-12 bg-brand-border/40 rounded animate-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <div className="border border-dashed border-brand-border bg-brand-card rounded-[9px] p-8 text-center font-mono text-[13px] text-brand-muted">
          No expenses yet
        </div>
      ) : (
        <div className="space-y-2.5">
          {displayedExpenses.map((expense) => (
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
                    onClick={() => navigate(`/edit/${expense._id}`)}
                    className="font-mono text-[11px] border border-brand-border px-[9px] py-[5px] rounded-[6px] text-brand-muted hover:text-brand-ink hover:border-brand-border transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(expense._id)}
                    className="font-mono text-[11px] border border-brand-border px-[9px] py-[5px] rounded-[6px] text-brand-muted hover:text-[#b4452f] hover:border-[#b4452f]/30 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {/* next and prev buttons only come when there are multiple pages */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-brand-border">
              <button
                // if we are on the first page , we cannot go to previous page so disable the button
                disabled={activePage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="font-mono text-xs border border-brand-border px-3 py-1 rounded-md text-brand-muted hover:text-brand-ink hover:border-brand-border transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <span className="font-mono text-xs text-brand-muted">
                Page {activePage} of {totalPages}
              </span>
              <button
                // if we are on the last page , we cannot go to next page so disable the button
                disabled={activePage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="font-mono text-xs border border-brand-border px-3 py-1 rounded-md text-brand-muted hover:text-brand-ink hover:border-brand-border transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
