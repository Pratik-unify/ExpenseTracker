import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
  const [formData, setFormData] = useState({ name: "", amount: "", type: "Food", date: "" });
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isFutureDate(formData.date)) {
      setError("Cannot add a future date");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }
      
      navigate("/");
    } catch (error) {
      alert("Failed to save.");
    }
  };

  return {
    formData,
    setFormData,
    error,
    handleSubmit,
    handleAmountChange
  };
}
