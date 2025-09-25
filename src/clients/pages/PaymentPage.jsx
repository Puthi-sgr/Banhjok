import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  ArrowLeft,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { SavedPaymentMethods } from "../components/SavedPaymentMethods";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

// Payment form component for new cards
function PaymentForm({
  orderData,
  onSuccess,
  onError,
  setupIntentClientSecret,
  totalAmount,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const payableAmount = Number.isFinite(totalAmount) ? totalAmount : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage("");

    // Confirm the setup intent first
    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/success`,
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
      // Setup intent succeeded, now save the payment method first, then process payment
      try {
        // First, save the payment method
        const saveResponse = await fetch(
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

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to save payment method");
        }

        const saveData = await saveResponse.json();
        const savedPaymentMethodId = saveData.data?.payment_method_id;

        // Now process the payment with the saved payment method
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/orders/${
            orderData.orderId
          }/stripe-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              paymentMethodId: savedPaymentMethodId,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to process payment");
        }

        const data = await response.json();

        if (data.success) {
          if (data.data.status === "succeeded") {
            setMessage("Payment successful!");
            onSuccess(data.data);
          } else if (data.data.requires_action) {
            setMessage("Payment requires additional authentication");
            onError("Payment requires additional authentication");
          } else if (data.data.status === "processing") {
            setMessage("Payment is being processed");
            onError("Payment is being processed. Please wait...");
          }
        } else {
          throw new Error(data.message || "Payment failed");
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
            message.includes("successful")
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center">
            {message.includes("successful") ? (
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
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Pay ${payableAmount.toFixed(2)}</span>
          </>
        )}
      </button>
    </form>
  );
}

// Main payment page component
export const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [setupIntentClientSecret, setSetupIntentClientSecret] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [paymentMode, setPaymentMode] = useState("saved"); // 'saved' or 'new'

  const totalAmount = useMemo(() => {
    const parseAmount = (amount) => {
      if (amount === null || amount === undefined) {
        return null;
      }

      const numericAmount =
        typeof amount === "number" ? amount : parseFloat(amount);

      return Number.isNaN(numericAmount) ? null : numericAmount;
    };

    return (
      parseAmount(orderData?.total) ??
      parseAmount(orderData?.total_amount) ??
      0
    );
  }, [orderData]);

  const displayTotalAmount = Number.isFinite(totalAmount) ? totalAmount : 0;

  useEffect(() => {
    // Get order data from location state
    if (location.state?.orderData) {
      setOrderData(location.state.orderData);
    } else {
      // If no order data, redirect back to checkout
      navigate("/checkout/confirm");
      return;
    }
    setLoading(false);
  }, [location.state, navigate]);

  // Create setup intent for new cards
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

  // Process payment with saved payment method
  const processPaymentWithSavedMethod = async () => {
    if (!selectedPaymentMethodId) {
      setError("Please select a payment method");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/orders/${
          orderData.orderId
        }/stripe-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentMethodId: selectedPaymentMethodId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to process payment");
      }

      const data = await response.json();

      if (data.success) {
        if (data.data.status === "succeeded") {
          // Payment completed immediately
          handlePaymentSuccess(data.data);
        } else if (data.data.requires_action) {
          // Payment requires additional authentication (3D Secure, etc.)
          setError(
            "Payment requires additional authentication. Please try again."
          );
        } else if (data.data.status === "processing") {
          // Payment is being processed
          setError("Payment is being processed. Please wait...");
        }
      } else {
        throw new Error(data.message || "Payment failed");
      }
    } catch (err) {
      setError("Failed to process payment. Please try again.");
      console.error("Payment processing error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    // Navigate to success page with payment details
    navigate("/order/success", {
      state: {
        orderTotal: displayTotalAmount,
        items: orderData.items,
        orderNumber: orderData.orderId,
        paymentIntent: paymentIntent,
      },
    });
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleBackToCheckout = () => {
    navigate("/checkout/confirm", { state: { orderData } });
  };

  // Handle payment mode change
  const handlePaymentModeChange = (mode) => {
    setPaymentMode(mode);
    setSelectedPaymentMethodId(null);
    setSetupIntentClientSecret("");
    setError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Payment Error
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-x-4">
                <button
                  onClick={handleBackToCheckout}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Back to Checkout
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={handleBackToCheckout}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Checkout
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Complete Your Payment
            </h2>
            <p className="text-gray-600">Secure payment powered by Stripe</p>
          </div>

          {/* Payment Mode Selection */}
          <div className="mb-6">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => handlePaymentModeChange("saved")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  paymentMode === "saved"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Use Saved Card
              </button>
              <button
                onClick={() => handlePaymentModeChange("new")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  paymentMode === "new"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                New Card
              </button>
            </div>

            {paymentMode === "saved" && (
              <div className="mb-6">
                <SavedPaymentMethods
                  onSelectPaymentMethod={setSelectedPaymentMethodId}
                  selectedMethodId={selectedPaymentMethodId}
                />
                {selectedPaymentMethodId && (
                  <button
                    onClick={processPaymentWithSavedMethod}
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 mt-4"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        <span>Pay ${displayTotalAmount.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {paymentMode === "new" && (
              <div>
                {setupIntentClientSecret ? (
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
                    <PaymentForm
                      orderData={orderData}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      setupIntentClientSecret={setupIntentClientSecret}
                      totalAmount={displayTotalAmount}
                    />
                  </Elements>
                ) : (
                  <button
                    onClick={createSetupIntent}
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Initializing Payment Form...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        <span>Enter Card Details</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              <span>
                Your payment information is secure and encrypted. We never store
                your card details.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
