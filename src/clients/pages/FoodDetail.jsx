import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  Minus,
  Plus,
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  Package,
} from "lucide-react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCart } from "../contexts/CartContext";
import { useFood } from "../contexts/FoodContext";
import { FoodCard } from "../components/FoodCard";
import { useVendor } from "../contexts/VendorContext";
import { useAuth } from "../../contexts/AuthContext";
import { getFoodStock } from "../utils/food";

export const FoodDetail = () => {
  const { foodId } = useParams();
  const { vendor, loading: vendorLoading, getVendorById } = useVendor();
  const { food, loading, error, getFoodById } = useFood();
  const [quantity, setQuantity] = useState(1);
  const { addItem, state } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const stockCount = getFoodStock(food);
  const isOutOfStock = stockCount === 0;

  useEffect(() => {
    if (foodId) {
      getFoodById(foodId);
    }
  }, [foodId]);

  useEffect(() => {
    if (food?.vendor?.id) {
      getVendorById(food.vendor.id);
    }
  }, [food]);

  useEffect(() => {
    if (!food?.id) {
      return;
    }

    const cartItem = state.items.find(
      (item) => item.id === food.id && item.userId === user?.id
    );

    const remaining = Math.max(stockCount - (cartItem?.quantity ?? 0), 0);

    setQuantity((prevQuantity) => {
      if (stockCount <= 0) {
        return 0;
      }

      if (remaining <= 0) {
        return 0;
      }

      const safeQuantity = prevQuantity === 0 ? 1 : prevQuantity;
      return Math.min(safeQuantity, remaining);
    });
  }, [stockCount, state.items, food?.id, user?.id]);

  if (loading || vendorLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Food item not found
          </h2>
          <Link
            to="/explore"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const handleDecreaseQuantity = () => {
    if (isOutOfStock) {
      return;
    }

    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    if (isOutOfStock) {
      return;
    }

    const cartItem = state.items.find(
      (item) => item.id === food.id && item.userId === user?.id
    );

    const remaining = Math.max(stockCount - (cartItem?.quantity ?? 0), 0);

    if (remaining <= 0) {
      return;
    }

    setQuantity((prev) => Math.min(remaining, prev + 1));
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (isOutOfStock) {
      return;
    }

    const cartItem = state.items.find(
      (item) => item.id === food.id && item.userId === user?.id
    );
    const existingQuantity = cartItem?.quantity ?? 0;
    const availableToAdd = Math.max(stockCount - existingQuantity, 0);

    if (availableToAdd <= 0) {
      return;
    }

    const quantityToAdd = Math.min(quantity, availableToAdd);

    for (let i = 0; i < quantityToAdd; i += 1) {
      addItem(food);
    }

    const remainingStock = Math.max(
      stockCount - (existingQuantity + quantityToAdd),
      0
    );

    setQuantity((currentQuantity) => {
      if (remainingStock <= 0) {
        return 0;
      }

      if (currentQuantity === 0) {
        return Math.min(remainingStock, stockCount);
      }

      return Math.min(currentQuantity, remainingStock);
    });
  };

  const isInCart = state.items.some(
    (item) => item.id === food.id && item.userId === user?.id
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/explore"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Food Image */}
          <div className="relative">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <button className="bg-white hover:bg-gray-100 text-gray-600 p-2 rounded-full shadow-md">
                <Heart className="w-5 h-5" />
              </button>
              <button className="bg-white hover:bg-gray-100 text-gray-600 p-2 rounded-full shadow-md">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            {food.tags?.includes("premium") && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Premium
              </div>
            )}
          </div>

          {/* Food Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {food.name}
              </h1>
              <p className="text-gray-600 text-lg">{food.description}</p>
              <div className="flex item-center my-4">
                <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full font-medium">
                  {food.category}
                </span>
              </div>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold">{food.rating}</span>
                <span className="text-gray-600">({205} reviews)</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">{food.ready_time} min</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package
                  className={`w-5 h-5 ${isOutOfStock ? "text-red-500" : "text-green-500"}`}
                />
                <span className="text-gray-700">
                  Stock: <span className="font-semibold">{stockCount}</span>
                  {isOutOfStock && " (Out of stock)"}
                </span>
              </div>
            </div>

            {/* Vendor */}
            <div className="mb-6">
              <Link
                to={`/vendor/${food.vendor.id}`}
                className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2"
              >
                <img
                  src={food.vendor.image}
                  alt={food.vendor.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {food.vendor.name}
              </Link>
            </div>

            {/* Price and Add to Cart */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-orange-600">
                  ${food.price}
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleDecreaseQuantity}
                    disabled={isOutOfStock || quantity <= 1}
                    aria-disabled={isOutOfStock || quantity <= 1}
                    className={`bg-gray-200 text-gray-700 p-2 rounded-full transition-colors ${
                      isOutOfStock || quantity <= 1
                        ? "cursor-not-allowed opacity-60"
                        : "hover:bg-gray-300"
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-lg w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncreaseQuantity}
                    disabled={
                      isOutOfStock || quantity >= stockCount || stockCount <= 0
                    }
                    aria-disabled={
                      isOutOfStock || quantity >= stockCount || stockCount <= 0
                    }
                    className={`bg-gray-200 text-gray-700 p-2 rounded-full transition-colors ${
                      isOutOfStock || quantity >= stockCount || stockCount <= 0
                        ? "cursor-not-allowed opacity-60"
                        : "hover:bg-gray-300"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || quantity === 0}
                aria-disabled={isOutOfStock || quantity === 0}
                className={`w-full text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isOutOfStock || quantity === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                <ShoppingCart className="w-4 h-4 font-bold" />
                {isOutOfStock || quantity === 0
                  ? "Out of Stock"
                  : `Add to Cart - $${(food.price * quantity).toFixed(2)}`}
              </button>
              {isInCart && (
                <p className="text-green-600 text-sm mt-2 text-center">
                  This item is already in your cart
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Foods in this Restaurant
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendor ? (
            vendor?.foods?.map((food) => (
              <FoodCard key={food.id} food={food} showVendor={false} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              <p>No food in this vendor</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
