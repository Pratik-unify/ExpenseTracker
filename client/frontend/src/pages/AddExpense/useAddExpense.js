import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// useMutation is used for this 
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

// to check if the date is in future , expense cant be added 
const isFutureDate = (dateString) => {
  if (!dateString) return false;
  const selectedDate = new Date(dateString);
  selectedDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate > today;
};

export default function useAddExpense() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: "", amount: "", type: "Food", date: "" });
  const [error, setError] = useState("");
  // we can fetch the newly added data directly into the expense array using queryClient.setQueryData()
  const addMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      // refetchQueries triggers a network call to the server immediately , even if the user is on a different page and cannot see the data 
      // invalidateQueries  waits until the user actually opens the page that needs the data before making the network request

      // invalidate queries makes extra request to the server which is not efficient if data is already available in the client, in that case we should use queryClient.setQueryData()
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      navigate("/");
    },
    onError: () => {
      alert("Failed to save.");
    }
  });

  // We did not wrap this in useCallback because it is passed to a native <input> element
  // Native tags do not trigger React rendering cycles, so caching the reference yields no performance gain
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
    e.preventDefault();
    setError("");

    if (isFutureDate(formData.date)) {
      setError("Cannot add a future date");
      return;
    }

    addMutation.mutate({
      ...formData,
      amount: Number(formData.amount)
    });
  };

  return {
    formData,
    setFormData,
    error,
    handleSubmit,
    handleAmountChange
  };
}

