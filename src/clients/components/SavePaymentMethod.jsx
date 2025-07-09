import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Copy,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

// Setup form component
const SetupForm = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage("");

    // Confirm the setup intent
    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
      onError(error.message);
      setIsProcessing(false);
      return;
    }

    if (setupIntent && setupIntent.status === "succeeded") {
      // Setup intent succeeded, now save the payment method
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/payment-methods/stripe/save`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              payment_method_id: setupIntent.payment_method,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to save payment method");
        }

        const data = await response.json();

        if (data.success) {
          setMessage("Payment method saved successfully!");
          onSuccess(data.data);
        } else {
          throw new Error(data.message || "Failed to save payment method");
        }
      } catch (err) {
        setMessage(err.message);
        onError(err.message);
      }
    } else {
      setMessage("An unexpected error occurred.");
      onError("An unexpected error occurred.");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes("successfully")
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center">
            {message.includes("successfully") ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            <span>{message}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Saving Payment Method...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Save Payment Method</span>
          </>
        )}
      </button>
    </form>
  );
};

// Main component
export const SavePaymentMethod = ({ onSuccess, onError }) => {
  const { token } = useAuth();
  const [setupIntentClientSecret, setSetupIntentClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Create setup intent
  const createSetupIntent = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/payment-methods/stripe/setup-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create setup intent");
      }

      const data = await response.json();
      if (data.success && data.data.client_secret) {
        setSetupIntentClientSecret(data.data.client_secret);
        setShowForm(true);
      } else {
        throw new Error("No client secret returned from backend");
      }
    } catch (err) {
      setError("Failed to initialize payment form. Please try again.");
      console.error("Setup intent creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (data) => {
    setShowForm(false);
    setSetupIntentClientSecret("");
    setError("");
    if (onSuccess) {
      onSuccess(data);
    }
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    if (onError) {
      onError(errorMessage);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSetupIntentClientSecret("");
    setError("");
  };

  if (showForm && setupIntentClientSecret) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Add New Payment Method</h3>
          <p className="text-gray-600">
            Enter your card details to save for future payments
          </p>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: setupIntentClientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#f97316", // Orange color to match theme
              },
            },
          }}
        >
          <SetupForm onSuccess={handleSuccess} onError={handleError} />
        </Elements>

        <div className="mt-4 text-center">
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-center">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="w-6 h-6 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Add Payment Method</h3>
        <p className="text-gray-600 mb-6">
          Save a payment method for faster checkout
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-700">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        <button
          onClick={createSetupIntent}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Initializing...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Add New Card</span>
            </>
          )}
        </button>

        {/* Test Cards Info */}
        {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Test Cards
          </h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span>Success:</span>
              <div className="flex items-center space-x-2">
                <code className="bg-white px-2 py-1 rounded">
                  4242424242424242
                </code>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText("4242424242424242")
                  }
                  className="text-orange-600 hover:text-orange-700"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Declined:</span>
              <div className="flex items-center space-x-2">
                <code className="bg-white px-2 py-1 rounded">
                  4000000000000002
                </code>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText("4000000000000002")
                  }
                  className="text-orange-600 hover:text-orange-700"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>3D Secure:</span>
              <div className="flex items-center space-x-2">
                <code className="bg-white px-2 py-1 rounded">
                  4000002500003155
                </code>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText("4000002500003155")
                  }
                  className="text-orange-600 hover:text-orange-700"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
