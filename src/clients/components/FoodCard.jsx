import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Clock, Plus, Package } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import noProfile from "../../assets/images/no-profile.png";
import { getFoodStock } from "../utils/food";

export const FoodCard = ({ food, showVendor = true, viewMode = "grid" }) => {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const stockCount = getFoodStock(food);
  const isOutOfStock = stockCount === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/auth");
      return;
    }

    addItem(food);
  };

  const handleVendorClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/vendor/${food.vendor.id}`);
  };

  if (viewMode === "list") {
    return (
      <Link to={`/food/${food.id}`} className="group">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="flex">
            {/* Image */}
            <div className="relative w-48 h-[173px] flex-shrink-0">
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={handleAddToCart}
                className="absolute top-2 right-2 bg-white hover:bg-orange-50 text-orange-600 rounded-full p-2 shadow-md transition-colors opacity-0 group-hover:opacity-100"
              >
                <Plus className="w-4 h-4" />
              </button>
              {food.tags?.includes("premium") && (
                <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Premium
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
                    {food.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex items-center gap-2">
                    {food.description}
                  </p>
                </div>
                <span className="text-xl font-bold text-orange-600 ml-4">
                  ${food.price}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">
                      {food.rating}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({Math.floor(Math.random() * 500)})
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {food.ready_time} min
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Package
                      className={`w-4 h-4 ${
                        isOutOfStock ? "text-red-500" : "text-green-500"
                      }`}
                    />
                    <span className="text-sm text-gray-600">
                      {isOutOfStock ? "Out of stock" : `${stockCount} in stock`}
                    </span>
                  </div>
                </div>
              </div>

              {showVendor && (
                <div className="mt-2 pt-2 border-t flex items-center gap-3">
                  <img
                    src={food.vendor?.image || noProfile}
                    alt={food.vendor?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <button
                    onClick={handleVendorClick}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    {food.vendor?.name || "N/A"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view (default)
  return (
    <Link to={`/food/${food.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={handleAddToCart}
            className="absolute top-2 right-2 bg-white hover:bg-orange-50 text-orange-600 rounded-full p-2 shadow-md transition-colors opacity-0 group-hover:opacity-100"
          >
            <Plus className="w-4 h-4" />
          </button>
          {food.tags?.includes("premium") && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Premium
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg truncate font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
              {food.name}
            </h3>
            <span className="text-lg font-bold text-orange-600">
              ${food.price}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-1">
            {food.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700">
                  {food.rating}
                </span>
                <span className="text-xs text-gray-500">
                  ({Math.floor(Math.random() * 500)})
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {food.ready_time} min
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Package className={`w-4 h-4 ${isOutOfStock ? "text-red-500" : "text-green-500"}`} />
                <span className="text-sm text-gray-600">
                  {isOutOfStock ? "Out of stock" : `${stockCount} in stock`}
                </span>
              </div>
            </div>
          </div>
          {showVendor && (
            <div className="mt-2 pt-2 border-t flex items-center gap-3">
              <img
                src={food.vendor?.image || noProfile}
                alt={food.vendor?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <button
                onClick={handleVendorClick}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                {food.vendor?.name || "N/A"}
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
