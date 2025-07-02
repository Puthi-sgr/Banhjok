import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Edit,
  Plus,
  Trash2,
} from "lucide-react";
import FoodItemModal from "../components/FoodItemModal";
import { useData } from "../../contexts/DataContext";
import Alert from "../components/Alert";
import noProfile from "../../assets/images/no-profile.png";

const VendorDetails = () => {
  const { id } = useParams();
  const { addFoodItem, updateFoodItem, deleteFoodItem, getVendorById } =
    useData();
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeletingItem, setIsDeletingItem] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  const showAlertMessage = (message, variant = "success") => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
  };

  const fetchVendorDetails = async () => {
    setLoading(true);
    const res = await getVendorById(parseInt(id));
    if (res.success) {
      setVendor(res.data.vendor);
      setFoodItems(res.data.foods || []);
    } else {
      setVendor(null);
      setFoodItems([]);
      showAlertMessage(res.error || "Failed to fetch vendor details", "error");
    }
    setLoading(false);
  };
  useEffect(() => {
    if (id) {
      fetchVendorDetails();
    }
  }, [id, getVendorById]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          Loading vendor details...
        </p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Vendor not found
        </h2>
        <Link
          to="/vendors"
          className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          ← Back to Vendors
        </Link>
      </div>
    );
  }

  const handleDeleteItem = async (item) => {
    setIsDeletingItem(true);
    const res = await deleteFoodItem(item.id);
    if (res.success) {
      fetchVendorDetails();
      setDeletingItem(null);
      showAlertMessage("Food item deleted successfully", "success");
    } else {
      showAlertMessage(res.error || "Failed to delete food item", "error");
    }
    setIsDeletingItem(false);
  };

  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  };

  // Default status for vendors (since the API doesn't provide status)
  const vendorStatus = "active";

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/vendors"
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {vendor.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Vendor Details & Management
            </p>
          </div>
        </div>

        {/* Vendor Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="relative">
            <img
              src={vendor.image || noProfile}
              alt={vendor.name}
              className="w-full h-64 object-cover rounded-t-lg"
            />
            <div className="absolute top-4 right-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[vendorStatus]}`}
              >
                {vendorStatus.charAt(0).toUpperCase() + vendorStatus.slice(1)}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900 dark:text-white">
                      {vendor.email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900 dark:text-white">
                      {vendor.phone}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <span className="text-gray-900 dark:text-white">
                      {vendor.address}
                    </span>
                  </div>
                  {vendor.food_types && vendor.food_types.length > 0 && (
                    <div className="flex items-start">
                      <span className="text-gray-900 dark:text-white font-medium mr-2">
                        Food Types:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {vendor.food_types.map((type, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900 dark:text-blue-300"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Performance Metrics
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-2xl font-bold text-gray-900 dark:text-white ml-2">
                        {vendor.rating}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Rating
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.floor(Math.random() * 100) + 10}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total Orders
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center col-span-2">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${(Math.random() * 5000 + 1000).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total Revenue
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Food Items Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Food Items
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Manage menu items for this vendor
                </p>
              </div>
              <button
                onClick={() => setShowAddItemModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Item
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Loading food items...
              </div>
            ) : foodItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <Plus className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No food items yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start by adding some menu items for this vendor
                </p>
                <button
                  onClick={() => setShowAddItemModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add First Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {foodItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="">
                      <div className="">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      </div>
                      <div className="mt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.category}
                            </p>
                            {item.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeletingItem(item)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            ${parseFloat(item.price).toFixed(2)}
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {parseFloat(item.rating).toFixed(1)}
                            </span>
                          </div>
                        </div>
                        {item.qty_available !== undefined && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Available: {item.qty_available}
                          </div>
                        )}
                        {item.ready_time && (
                          <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Ready in: {item.ready_time} min
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Food Item Modal */}
      {showAddItemModal && (
        <FoodItemModal
          isOpen={showAddItemModal}
          onClose={() => setShowAddItemModal(false)}
          onSave={async (item) => {
            const res = await addFoodItem(vendor.id, item);
            if (res.success) {
              fetchVendorDetails();
              setShowAddItemModal(false);
              showAlertMessage("Food item added successfully", "success");
            } else {
              showAlertMessage(res.error || "Failed to add food item", "error");
            }
          }}
          mode="add"
        />
      )}

      {/* Edit Food Item Modal */}
      {editingItem && (
        <FoodItemModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={async (updates) => {
            const res = await updateFoodItem(
              vendor.id,
              editingItem.id,
              updates
            );
            if (res.success) {
              fetchVendorDetails();
              setEditingItem(null);
              showAlertMessage("Food item updated successfully", "success");
            } else {
              showAlertMessage(
                res.error || "Failed to update food item",
                "error"
              );
            }
          }}
          mode="edit"
          item={editingItem}
        />
      )}

      {/* Delete Confirmation */}
      {deletingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Delete Food Item
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{deletingItem.name}"? This action
              cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setDeletingItem(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteItem(deletingItem)}
                className="flex-1 px-4 py-2 flex justify-center items-center text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
              >
                {isDeletingItem ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAlert && (
        <Alert
          message={alertMessage}
          variant={alertVariant}
          onClose={() => setShowAlert(false)}
        />
      )}
    </>
  );
};

export default VendorDetails;
