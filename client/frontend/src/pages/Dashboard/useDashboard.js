import { useState, useCallback, useMemo, createContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// zustand can be used as an alternative to createContext -> helps with easier syntax as there is no boiler plate code 
// zustand can help to prevent unnecessaary re renders of child components 
export const DashboardContext = createContext();

const getExpenses = async () => {
  const response = await fetch(`${API_URL}/expenses`);
  if (!response.ok) throw new Error("Failed to fetch data");
  return response.json();
};

const deleteExpense = async (id) => {
  const response = await fetch(`${API_URL}/expenses/${id}`, {
    method: "DELETE"
  });
  if (!response.ok) throw new Error("Failed to delete");
  return response.json();
};

export default function useDashboard() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: expenses = [], isLoading: loading } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses
  });

  const { mutate } = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: () => {
      alert("Could not delete item.");
    }
  });

  const handleDelete = useCallback((id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      mutate(id);
    }
  }, []);
  // usee memo has been used here because we do not want to calculate eveything for every re render 
  // caching the values and then rendering only when the expense list changes saves computation 
  const filteredExpenses = useMemo(() => {
    if (!searchTerm.trim()) return expenses;
    const lowerSearch = searchTerm.toLowerCase();
    return expenses.filter(item =>
      item.name.toLowerCase().includes(lowerSearch) ||
      item.type.toLowerCase().includes(lowerSearch)
    );
  }, [expenses, searchTerm]);

  const stats = useMemo(() => {
    const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthExpenses = expenses.filter(item => {
      const d = new Date(item.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    const thisMonthSpent = thisMonthExpenses.reduce((sum, item) => sum + Number(item.amount), 0);

    const budget = 15000;
    const percentUsed = Math.min(100, Math.round((thisMonthSpent / budget) * 100));

    const foodSpent = expenses.filter(e => e.type === "Food").reduce((sum, e) => sum + Number(e.amount), 0);
    const billsSpent = expenses.filter(e => e.type === "Bills").reduce((sum, e) => sum + Number(e.amount), 0);
    const travelSpent = expenses.filter(e => e.type === "Travel").reduce((sum, e) => sum + Number(e.amount), 0);
    const otherSpent = expenses.filter(e => e.type !== "Food" && e.type !== "Bills" && e.type !== "Travel").reduce((sum, e) => sum + Number(e.amount), 0);

    const totalCategory = foodSpent + billsSpent + travelSpent + otherSpent || 1;
    const foodPct = (foodSpent / totalCategory) * 100;
    const billsPct = (billsSpent / totalCategory) * 100;
    const travelPct = (travelSpent / totalCategory) * 100;
    const otherPct = (otherSpent / totalCategory) * 100;

    return {
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
    };
  }, [expenses]);

  return {
    expenses,
    filteredExpenses,
    loading,
    handleDelete,
    stats,
    searchTerm,
    setSearchTerm
  };
}
