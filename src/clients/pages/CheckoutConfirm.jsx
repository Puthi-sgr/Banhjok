import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

export const CheckoutConfirm = () => {
  const { state, clearCart, getTotalPrice, getDeliveryFee, getTax } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const subtotal = getTotalPrice();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const total = subtotal + deliveryFee + tax;

  // Format cart items for API
  const formatOrderItems = () => {
    return state.items.map((item) => ({
      food_id: item.id,
      quantity: item.quantity,
    }));
  };

  const handleSubmitOrder = async () => {
    if (!token) {
      setError("Authentication required. Please login again.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const orderData = {
        items: formatOrderItems(),
        remarks: remarks.trim() || null,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/orders`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      if (response.status === 500) {
        throw new Error("Foods out of stock. Go find other foods.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to place order");
      }

      const result = await response.json();

      // Prepare order data for payment
      const paymentOrderData = {
        orderId: result.data?.orders || `NOM-${Date.now()}`,
        total: total,
        items: state.items,
        orderDetails: result.data,
      };

      // Navigate to payment page
      navigate("/payment", {
        state: { orderData: paymentOrderData },
      });
    } catch (err) {
      console.error("Order submission error:", err);
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToCart = () => {
    navigate("/cart");
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No items in cart
          </h2>
          <p className="text-gray-600 mb-6">
            Please add items to your cart before checkout.
          </p>
          <button
            onClick={() => navigate("/explore")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={handleBackToCart}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Confirm Order</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 ml-4">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{item.vendorName}</p>
                      <p className="text-orange-600 font-bold">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Remarks */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Order Remarks</h2>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add any special instructions, dietary preferences, or delivery notes..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                maxLength={500}
              />
              <p className="text-sm text-gray-500 mt-2">
                {remarks.length}/500 characters
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {deliveryFee > 0 && (
                <div className="mb-6 p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-800">
                    Add ${(25 - subtotal).toFixed(2)} more for free delivery!
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Proceed to Payment</span>
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <button
                  onClick={handleBackToCart}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
