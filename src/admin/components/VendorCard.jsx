import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Phone, Mail, Edit, Trash2, Eye } from "lucide-react";
import { useData } from "../../contexts/DataContext";
import VendorModal from "./VendorModal";
import noProfile from "../../assets/images/no-profile.png";

const VendorCard = ({ vendor, onVendorUpdate, onAlert }) => {
  const { deleteVendor } = useData();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    const result = await deleteVendor(vendor.id);
    if (result.success) {
      if (onAlert) {
        onAlert("Vendor deleted successfully!", "success");
      }
    } else {
      if (onAlert) {
        onAlert(result.error || "Failed to delete vendor", "error");
      }
    }
    setShowDeleteConfirm(false);
  };

  const handleVendorSave = (result) => {
    if (result.success) {
      setShowEditModal(false);
      // Call parent callback if provided
      if (onVendorUpdate) {
        onVendorUpdate(result);
      }
    } else {
      // Handle error - could show alert here if needed
      console.error("Failed to update vendor:", result.error);
    }
  };

  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
        <div className="relative">
          <img
            src={vendor.image || noProfile}
            alt={vendor.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-4 right-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                statusColors[vendor.status]
              }`}
            >
              {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {vendor.name}
              </h3>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                  {vendor.rating}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="truncate">{vendor.address}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Phone className="h-4 w-4 mr-2" />
              <span>{vendor.phone}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Mail className="h-4 w-4 mr-2" />
              <span className="truncate">{vendor.email}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {vendor.orders}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Orders
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                ${vendor.revenue.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Revenue
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Link
              to={`/dashboard/vendors/${vendor.id}`}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
            <button
              onClick={() => setShowEditModal(true)}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <VendorModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          mode="edit"
          vendor={vendor}
          onSave={handleVendorSave}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Delete Vendor
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete {vendor.name}? This action cannot
              be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VendorCard;
