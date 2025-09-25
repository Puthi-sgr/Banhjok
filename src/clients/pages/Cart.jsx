import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Package } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { getFoodStock } from "../utils/food";

export const Cart = () => {
  const {
    state,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getDeliveryFee,
    getTax,
  } = useCart();

  const navigate = useNavigate();

  const subtotal = getTotalPrice();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    navigate("/checkout/confirm");
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add some delicious items to get started!
            </p>
            <Link
              to="/explore"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {state.items.map((item) => {
                const stockCount = getFoodStock(item);
                const outOfStock = stockCount === 0;
                const canDecrease = item.quantity > 1;
                const canIncrease = !outOfStock && item.quantity < stockCount;

                return (
                  <div
                    key={item.id}
                    className="flex items-center p-6 border-b last:border-b-0"
                  >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.vendorName}</p>
                    <p className="text-orange-600 font-bold">${item.price}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <Package
                        className={`w-4 h-4 ${outOfStock ? "text-red-500" : "text-green-500"}`}
                      />
                      <span>{outOfStock ? "Out of stock" : `${stockCount} in stock`}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={!canDecrease}
                      aria-disabled={!canDecrease}
                      className={`bg-gray-200 text-gray-700 p-1 rounded-full transition-colors ${
                        canDecrease ? "hover:bg-gray-300" : "cursor-not-allowed opacity-60"
                      }`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={!canIncrease}
                      aria-disabled={!canIncrease}
                      className={`bg-gray-200 text-gray-700 p-1 rounded-full transition-colors ${
                        canIncrease ? "hover:bg-gray-300" : "cursor-not-allowed opacity-60"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-4 text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  </div>
                );
              })}
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

              <button
                onClick={handleCheckout}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Proceed to Checkout</span>
              </button>

              <div className="mt-4 text-center">
                <Link
                  to="/explore"
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
