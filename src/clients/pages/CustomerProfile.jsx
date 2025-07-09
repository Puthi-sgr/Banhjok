import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  Camera,
  AlertCircle,
  CheckCircle,
  Loader2,
  Globe,
  CreditCard,
  Package,
  Clock,
  Truck,
  XCircle,
  Eye,
  ShoppingBag,
} from "lucide-react";
import noProfile from "../../assets/images/no-profile.png";
import LocationPicker from "../components/LocationPicker";
import { SavedPaymentMethods } from "../components/SavedPaymentMethods";
import { SavePaymentMethod } from "../components/SavePaymentMethod";

const CustomerProfile = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationData, setLocationData] = useState({
    lat: null,
    lng: null,
    lat_lng: user?.lat_lng || "",
    location: user?.location || "",
  });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });

      // Parse lat_lng if it exists
      if (user.lat_lng) {
        const [lat, lng] = user.lat_lng.split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          setLocationData({
            lat,
            lng,
            lat_lng: user.lat_lng,
            location: user.location || "",
          });
        }
      }
    }
  }, [user]);

  // Fetch customer orders
  useEffect(() => {
    if (user && token) {
      fetchOrders();
    }
  }, [user, token]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/orders`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.orders) {
          setOrders(result.data.orders);
        }
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handlePayOrder = (order) => {
    // Prepare order data for payment
    const paymentOrderData = {
      orderId: order.id,
      total: parseInt(order.total_amount),
      items: order.food_detail.map((item) => ({
        id: item.food_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || "",
        vendorName: item.vendor?.name,
      })),
      orderDetails: order,
    };

    // Navigate to payment page
    navigate("/payment", {
      state: { orderData: paymentOrderData },
    });
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      Pending: Clock,
      Accepted: CheckCircle,
      Preparing: Package,
      "On the Way": Truck,
      "Ready for Pickup": Package,
      Delivered: CheckCircle,
      Cancelled: XCircle,
    };
    return statusIcons[status] || Clock;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Accepted: "bg-green-100 text-green-800 border-green-200",
      Preparing: "bg-blue-100 text-blue-800 border-blue-200",
      "On the Way": "bg-purple-100 text-purple-800 border-purple-200",
      "Ready for Pickup": "bg-orange-100 text-orange-800 border-orange-200",
      Delivered: "bg-green-100 text-green-800 border-green-200",
      Cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    // Combine form data with location data
    const updateData = {
      ...formData,
      lat_lng: locationData.lat_lng,
      location: locationData.location,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/profile`,
        {
          method: "PUT",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setMessage({
          type: "success",
          text: "Profile updated successfully!",
        });
        setIsEditing(false);
        // Update local user data
        if (result.data) {
          localStorage.setItem(
            "user",
            JSON.stringify({ ...user, ...result.data })
          );
          window.location.reload(); // Refresh to update the user context
        }
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.message || "Failed to update profile",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "Please select a valid image file",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Image size should be less than 5MB",
      });
      return;
    }

    setIsImageUploading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/profile/image`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        setMessage({
          type: "success",
          text: "Profile image updated successfully!",
        });
        // Update local user data
        if (result.data && result.data.image) {
          localStorage.setItem(
            "user",
            JSON.stringify({ ...user, image: result.data.image })
          );
          window.location.reload(); // Refresh to update the user context
        }
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.message || "Failed to upload image",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });

    // Reset location data
    if (user?.lat_lng) {
      const [lat, lng] = user.lat_lng.split(",").map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        setLocationData({
          lat,
          lng,
          lat_lng: user.lat_lng,
          location: user.location || "",
        });
      }
    }

    setIsEditing(false);
    setShowLocationPicker(false);
    setMessage({ type: "", text: "" });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your personal information and settings
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 mx-auto mb-4">
                    <img
                      src={user.image || noProfile}
                      alt={user.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-orange-100"
                    />
                  </div>
                  <label className="absolute bottom-2 right-2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full cursor-pointer transition-colors duration-200">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isImageUploading}
                    />
                  </label>
                </div>
                {isImageUploading && (
                  <div className="flex items-center justify-center space-x-2 text-orange-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Uploading...</span>
                  </div>
                )}
                <h2 className="text-xl font-semibold text-gray-900 mt-2">
                  {user.name}
                </h2>
                <p className="text-gray-600 text-sm">Customer</p>
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {isLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="inline h-4 w-4 mr-2" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">
                          {user.name || "Not provided"}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline h-4 w-4 mr-2" />
                        Email Address
                      </label>
                      <p className="text-gray-900 py-2">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline h-4 w-4 mr-2" />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">
                          {user.phone || "Not provided"}
                        </p>
                      )}
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline h-4 w-4 mr-2" />
                        Location
                      </label>
                      {isEditing ? (
                        <div className="space-y-2">
                          <p className="text-gray-900 py-2">
                            {locationData.location || "Not provided"}
                          </p>
                          {locationData.lat_lng && (
                            <p className="text-xs text-gray-500">
                              Coordinates: {locationData.lat_lng}
                            </p>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setShowLocationPicker(!showLocationPicker)
                            }
                            className="inline-flex items-center px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium rounded-lg transition-colors duration-200"
                          >
                            <Globe className="h-4 w-4 mr-2" />
                            {showLocationPicker ? "Hide Map" : "Select on Map"}
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-900 py-2">
                            {user.location || "Not provided"}
                          </p>
                          {user.lat_lng && (
                            <p className="text-xs text-gray-500">
                              Coordinates: {user.lat_lng}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline h-4 w-4 mr-2" />
                        Address
                      </label>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter your full address"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">
                          {user.address || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Location Picker */}
            {isEditing && showLocationPicker && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Select Your Location
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Click on the map to set your exact location
                  </p>
                </div>
                <div className="p-6">
                  <LocationPicker
                    onLocationSelect={(location) => {
                      setLocationData({
                        lat: location.lat,
                        lng: location.lng,
                        lat_lng:
                          location.lat_lng || `${location.lat},${location.lng}`,
                        location: location.address || locationData.location,
                      });
                    }}
                    initialLocation={
                      locationData.lat && locationData.lng
                        ? { lat: locationData.lat, lng: locationData.lng }
                        : null
                    }
                  />
                </div>
              </div>
            )}

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Methods
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your saved payment methods for faster checkout
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Saved Payment Methods */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">
                      Saved Cards
                    </h4>
                    <SavedPaymentMethods
                      onSelectPaymentMethod={() => {}}
                      selectedMethodId={null}
                    />
                  </div>

                  {/* Add New Payment Method */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">
                      Add New Card
                    </h4>
                    <SavePaymentMethod
                      onSuccess={(data) => {
                        // Refresh the saved payment methods
                        window.location.reload();
                      }}
                      onError={(error) => {
                        console.error("Error saving payment method:", error);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Account Details
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer ID
                    </label>
                    <p className="text-gray-900 py-2">{user.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <p className="text-gray-900 py-2">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  My Orders
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  View and manage your order history
                </p>
              </div>
              <div className="p-6">
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-500 mr-2" />
                    <span className="text-gray-600">Loading orders...</span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No orders found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Start ordering to see your order history here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const StatusIcon = getStatusIcon(
                        order.order_status.label
                      );
                      const statusColor = getStatusColor(
                        order.order_status.label
                      );
                      const isPending = order.order_status.label === "Pending";

                      return (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${statusColor}`}>
                                <StatusIcon className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  Order #{order.id}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {formatDate(order.created_at)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">
                                ${parseFloat(order.total_amount).toFixed(2)}
                              </div>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                              >
                                {order.order_status.label}
                              </span>
                            </div>
                          </div>

                          {/* Order Items Preview */}
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 mb-2">
                              {order.food_detail.length} item
                              {order.food_detail.length !== 1
                                ? "s"
                                : ""} from{" "}
                              {order.food_detail[0]?.vendor?.name || "Vendor"}
                            </p>
                            <div className="space-y-1">
                              {order.food_detail
                                .slice(0, 2)
                                .map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between text-sm"
                                  >
                                    <span className="text-gray-700">
                                      {item.quantity}x {item.name}
                                    </span>
                                    <span className="text-gray-600">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              {order.food_detail.length > 2 && (
                                <p className="text-xs text-gray-500">
                                  +{order.food_detail.length - 2} more items
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Order Remarks */}
                          {order.remarks && (
                            <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                              <span className="font-medium">Remarks:</span>{" "}
                              {order.remarks}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderDetail(true);
                              }}
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </button>

                            {isPending && (
                              <button
                                onClick={() => handlePayOrder(order)}
                                className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                <CreditCard className="h-4 w-4 mr-1" />
                                Pay Now
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Order Detail Modal */}
            {showOrderDetail && selectedOrder && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{selectedOrder.id} Details
                      </h3>
                      <button
                        onClick={() => {
                          setShowOrderDetail(false);
                          setSelectedOrder(null);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Order Status */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <div
                          className={`p-2 rounded-lg ${getStatusColor(
                            selectedOrder.order_status.label
                          )}`}
                        >
                          {React.createElement(
                            getStatusIcon(selectedOrder.order_status.label),
                            { className: "h-5 w-5" }
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {selectedOrder.order_status.label}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(selectedOrder.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {selectedOrder.food_detail.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                {item.name}
                              </h5>
                              <p className="text-sm text-gray-600">
                                {item.vendor?.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {item.quantity} × ${item.price}
                              </p>
                              <p className="text-sm text-gray-600">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-gray-900">
                          ${parseFloat(selectedOrder.total_amount).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center font-semibold text-lg">
                        <span>Total:</span>
                        <span className="text-orange-600">
                          ${parseFloat(selectedOrder.total_amount).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Remarks */}
                    {selectedOrder.remarks && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-1">
                          Remarks:
                        </h5>
                        <p className="text-sm text-gray-600">
                          {selectedOrder.remarks}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                      <button
                        onClick={() => {
                          setShowOrderDetail(false);
                          setSelectedOrder(null);
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                      >
                        Close
                      </button>

                      {selectedOrder.order_status.label === "Pending" && (
                        <button
                          onClick={() => {
                            setShowOrderDetail(false);
                            setSelectedOrder(null);
                            handlePayOrder(selectedOrder);
                          }}
                          className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                        >
                          <CreditCard className="h-4 w-4 mr-1" />
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
