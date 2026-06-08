import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";


export default function App() {
  const [page , setPage] = useState("dashboard");
  const [id , setId] = useState(null);
  
  const navigateTo = (page , id = null) => {
    setPage(page);
    setId(id);
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink font-sans selection:bg-brand-accent/20">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {page === "dashboard" && <Dashboard navigateTo={navigateTo} />}
        {page === "add" && <AddExpense navigateTo={navigateTo} />}
        {page === "edit" && <EditExpense navigateTo={navigateTo} id={id} />}
      </div>
    </div>
  );
}