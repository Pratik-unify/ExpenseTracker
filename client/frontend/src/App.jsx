import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddExpense from "./pages/AddExpense/AddExpense";
import EditExpense from "./pages/EditExpense/EditExpense";


export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-brand-bg text-brand-ink font-sans selection:bg-brand-accent/20">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddExpense />} />
            <Route path="/edit/:id" element={<EditExpense />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}