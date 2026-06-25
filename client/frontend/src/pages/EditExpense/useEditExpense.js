import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getSingleExpense = async (id) => {
  const response = await fetch(`${API_URL}/expenses/${id}`);
  if (!response.ok) throw new Error("Failed to fetch specific item");
  return response.json();
};

const updateExpense = async ({ id, payload }) => {
  const response = await fetch(`${API_URL}/expenses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to update");
  return response.json();
};

const formatDateForInput = (isoString) => {
  if (!isoString) return "";
  return isoString.split("T")[0];
};

export default function useEditExpense() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: "", amount: "", type: "Food", date: "" });
  const [error, setError] = useState("");

  const { data: expense, isLoading: loading } = useQuery({
    queryKey: ["expense", id],
    queryFn: () => getSingleExpense(id),
    enabled: !!id
  });

  const editMutation = useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      // also reload that specific expense which has changed 
      queryClient.invalidateQueries({ queryKey: ["expense", id] });
      navigate("/");
    },
    onError: () => {
      alert("Failed to update.");
    }
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        name: expense.name,
        amount: String(expense.amount),
        type: expense.type,
        date: formatDateForInput(expense.date)
      });
    }
  }, [expense]);

  const handleAmountChange = (e) => {
    const val = e.target.value;
    const regex = /^\d*\.?\d*$/;
    if (!regex.test(val)) {
      setError("Only positive numbers are allowed");
      return;
    }
    setError("");
    setFormData({ ...formData, amount: val });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    editMutation.mutate({
      id,
      payload: {
        ...formData,
        amount: Number(formData.amount)
      }
    });
  };

  return {
    formData,
    setFormData,
    loading,
    error,
    handleSubmit,
    handleAmountChange
  };
}
