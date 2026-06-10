import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

const createExpense = async (payload) => {
  const response = await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to save");
  return response.json();
};

export default function useDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const nameInputRef = useRef(null);

  const fetchExpenses = useCallback(async (showSkeleton = false) => {
    if (showSkeleton) {
      setLoading(true);
    }
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses(true);
  }, [fetchExpenses]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        await deleteExpense(id);
        fetchExpenses();
      } catch (e) {
        alert("Could not delete item.");
      }
    }
  }, [fetchExpenses]);

  const handleAddSubmit = useCallback(async (payload) => {
    try {
      await createExpense(payload);
      fetchExpenses();
      return true;
    } catch (error) {
      console.error(error);
      alert("Failed to save expense.");
      return false;
    }
  }, [fetchExpenses]);

  const handleAddClick = useCallback(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

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
    loading,
    nameInputRef,
    handleDelete,
    handleAddSubmit,
    handleAddClick,
    stats
  };
}
