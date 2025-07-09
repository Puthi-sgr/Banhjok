import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  ArrowLeft,
  Grid,
  List,
  Search,
  MapPinIcon,
} from "lucide-react";
import { FoodCard } from "../components/FoodCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useVendor } from "../contexts/VendorContext";

export const VendorDetail = () => {
  const { vendorId } = useParams();
  const { vendor, loading, error, getVendorById } = useVendor();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (vendorId) {
      getVendorById(vendorId);
    }
  }, [vendorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Vendor not found
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

  const categories = ["all", ...new Set(vendor?.vendor?.food_types)];
  const filteredFoods = vendor?.foods?.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || food.food_type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <span>Back to Explore</span>
          </Link>
        </div>
      </div>

      {/* Vendor Banner */}
      <div className="relative h-80 bg-gray-900">
        <img
          src={vendor.vendor.image}
          alt={vendor.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Vendor Profile Card - Overlapping Banner */}
      <div className="relative -mt-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Vendor Image */}
              <div className="flex-shrink-0">
                <img
                  src={vendor.vendor.image}
                  alt={vendor.name}
                  className="w-32 h-32 rounded-2xl shadow-lg object-cover"
                />
              </div>

              {/* Vendor Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {vendor.vendor.name}
                    </h1>
                    <p className="text-lg text-gray-600 mb-4 flex items-center gap-2">
                      <MapPinIcon className="w-5 h-5" />
                      {vendor.vendor.address}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-medium">
                      {true ? "Open Now" : "Closed"}
                    </span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-bold text-lg">
                        {vendor.vendor.rating}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {vendor.vendor.reviews} reviews
                    </p>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <span className="font-bold text-lg">
                        {vendor.vendor.delivery_time || "25"}
                        min
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Delivery time</p>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <span className="font-bold text-lg">
                        ${vendor.vendor.delivery_fee || "2.50"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Delivery fee</p>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start space-x-2 mb-1">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <span className="font-bold text-lg">
                        ${vendor.vendor.minimum_order || "3.00"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Minimum order</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {vendor?.vendor?.food_types?.map((type, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full font-medium"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 font-medium">View:</span>
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 transition-colors ${
                    viewMode === "grid"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 transition-colors ${
                    viewMode === "list"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category === "all" ? "All Items" : category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredFoods.length} items
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Menu Items */}
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }`}
        >
          {filteredFoods.map((food) => (
            <div key={food.id} className={viewMode === "list" ? "w-full" : ""}>
              <FoodCard food={food} showVendor={false} viewMode={viewMode} />
            </div>
          ))}
        </div>

        {filteredFoods.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
