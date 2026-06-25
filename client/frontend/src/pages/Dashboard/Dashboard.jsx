import { useNavigate } from "react-router-dom";
import useDashboard, { DashboardContext } from "./useDashboard";
import DashboardHeader from "./DashboardHeader";
import StatsOverview from "./StatsOverview";
import ExpenseList from "./ExpenseList";

export default function Dashboard() {
  const navigate = useNavigate();
  const dashboardValues = useDashboard();

  return (
    <DashboardContext.Provider value={dashboardValues}>
      <div className="space-y-6">
        <DashboardHeader onAddClick={() => navigate("/add")} />

        <div className="space-y-8">
          <StatsOverview />
          <ExpenseList />
        </div>
      </div>
    </DashboardContext.Provider>
  );
}

