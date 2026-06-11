import { useNavigate } from "react-router-dom";
import useDashboard from "./useDashboard";
import DashboardHeader from "./DashboardHeader";
import StatsOverview from "./StatsOverview";
import ExpenseList from "./ExpenseList";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    expenses,
    filteredExpenses,
    loading,
    handleDelete,
    stats,
    searchTerm,
    setSearchTerm
  } = useDashboard();

  return (
    <div className="space-y-6">
      <DashboardHeader onAddClick={() => navigate("/add")} />

      <div className="space-y-8">
        <StatsOverview
          loading={loading}
          expenses={expenses}
          {...stats}
        />
        <ExpenseList
          loading={loading}
          expenses={filteredExpenses}
          onEdit={(id) => navigate(`/edit/${id}`)}
          onDelete={handleDelete}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
    </div>
  );
}
