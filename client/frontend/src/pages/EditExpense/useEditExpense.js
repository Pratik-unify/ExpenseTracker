import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Local helper to format ISO dates for input fields (No separate utils folder/files)
const formatDateForInput = (isoString) => {
  if (!isoString) return "";
  return isoString.split("T")[0];
};

export default function useEditExpense() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ name: "", amount: "", type: "Food", date: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSingleExpense = async () => {
      try {
        const response = await fetch(`${API_URL}/expenses/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch specific item");
        }
        
        const data = await response.json();
        const formattedDate = formatDateForInput(data.date); 
        
        setFormData({
          name: data.name,
          amount: data.amount,
          type: data.type,
          date: formattedDate
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching expense", error);
      }
    };
    fetchSingleExpense();
  }, [id]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }
      
      navigate("/");
    } catch (error) {
      alert("Failed to update.");
    }
  };

  return {
    formData,
    setFormData,
    loading,
    handleSubmit
  };
}
