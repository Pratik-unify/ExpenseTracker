import { useContext } from "react";
import { DashboardContext } from "./useDashboard";

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useContext(DashboardContext);

  return (
    <div className="relative w-full md:w-80 mb-5">
      {/* inset is a shorthand for setting top, bottom, left, right all at once  , here it does top :0 px and bottom : 0 px */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {/* this svg renders a magnifying glass icon used in search bar  */}
        <svg className="h-4 w-4 text-[#7a766c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search expense or type..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-9 pr-4 py-2 border border-brand-border/60 rounded-[8px] text-[13px] text-brand-ink bg-white focus:outline-none focus:ring-2 focus:ring-[#2f6f4f]/30 focus:border-[#2f6f4f] transition-all font-medium placeholder-brand-muted/70"
      />
    </div>
  );
}


