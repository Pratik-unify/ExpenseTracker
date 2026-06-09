import { useNavigate } from "react-router-dom";
import useDashboard from "./useDashboard";
import DashboardHeader from "./DashboardHeader";
import StatsOverview from "./StatsOverview";
import ExpenseList from "./ExpenseList";
import ExpenseForm from "./ExpenseForm";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    expenses,
    loading,
    nameInputRef,
    handleDelete,
    handleAddSubmit,
    handleAddClick,
    stats
  } = useDashboard();

  return (
    <div className="space-y-6">
      <DashboardHeader onAddClick={handleAddClick} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <StatsOverview
            loading={loading}
            expenses={expenses}
            {...stats}
          />
          <ExpenseList
            loading={loading}
            expenses={expenses}
            onEdit={(id) => navigate(`/edit/${id}`)}
            onDelete={handleDelete}
          />
        </div>

        <div className="lg:col-span-1">
          <ExpenseForm
            nameInputRef={nameInputRef}
            onSave={handleAddSubmit}
          />
        </div>
      </div>
    </div>
  );
}
