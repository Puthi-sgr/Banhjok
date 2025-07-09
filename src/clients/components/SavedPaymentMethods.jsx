import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { CreditCard, Trash2, CheckCircle, AlertCircle } from "lucide-react";

export const SavedPaymentMethods = ({
  onSelectPaymentMethod,
  selectedMethodId,
}) => {
  const { token } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPaymentMethods();
  }, [token]);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/payment-methods`,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payment methods");
      }

      const data = await response.json();
      if (data.success) {
        setPaymentMethods(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch payment methods");
      }
    } catch (err) {
      setError("Failed to load saved payment methods");
      console.error("Error fetching payment methods:", err);
    } finally {
      setLoading(false);
    }
  };

  const deletePaymentMethod = async (methodId) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/payment-methods/stripe/${methodId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete payment method");
      }

      const data = await response.json();
      if (data.success) {
        // Remove from local state
        setPaymentMethods((prev) => prev.filter((pm) => pm.id !== methodId));
        // If this was the selected method, clear selection
        if (selectedMethodId === methodId) {
          onSelectPaymentMethod(null);
        }
      } else {
        throw new Error(data.message || "Failed to delete payment method");
      }
    } catch (err) {
      setError("Failed to delete payment method");
      console.error("Error deleting payment method:", err);
    }
  };

  const getCardIcon = (brand) => {
    const brandLower = brand?.toLowerCase();
    switch (brandLower) {
      case "visa":
        return "💳";
      case "mastercard":
        return "💳";
      case "amex":
        return "💳";
      case "discover":
        return "💳";
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-center text-red-600 mb-4">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="p-4">
        <p className="text-gray-500 text-sm text-center">
          No saved payment methods found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">
        Saved Payment Methods
      </h3>
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedMethodId === method.id
              ? "border-orange-500 bg-orange-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onSelectPaymentMethod(method.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {selectedMethodId === method.id && (
                  <CheckCircle className="w-5 h-5 text-orange-500" />
                )}
                <span className="text-xl">
                  {getCardIcon(method.card_brand)}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {method.card_brand?.toUpperCase()} •••• {method.card_last4}
                </div>
                <div className="text-sm text-gray-500">
                  Expires {method.exp_month}/{method.exp_year}
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deletePaymentMethod(method.id);
              }}
              className="text-red-500 hover:text-red-700 p-1"
              title="Delete payment method"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
