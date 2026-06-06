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
  const containerStyle = { maxWidth: "800px", margin: "0 auto", padding: "20px" };

  return (
    <div style={containerStyle}>
      {page === "dashboard" && <Dashboard navigateTo={navigateTo} />}
      {page === "add" && <AddExpense navigateTo={navigateTo} />}
      {page === "edit" && <EditExpense navigateTo={navigateTo} id={id} />}
    </div>
  );
}