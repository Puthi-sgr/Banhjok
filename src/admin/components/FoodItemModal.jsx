import { useState, useEffect } from "react";
import { X } from "lucide-react";

const FoodItemModal = ({ isOpen, onClose, onSave, mode, item = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item && mode === "edit") {
      setFormData({
        name: item.name,
        price: item.price.toString(),
        category: item.category,
      });
    }
  }, [item, mode]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.price) newErrors.price = "Price is required";
    else if (isNaN(formData.price) || parseFloat(formData.price) <= 0)
      newErrors.price = "Price must be a positive number";
    if (!formData.category.trim()) newErrors.category = "Category is required";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
    });

    onClose();
    setFormData({ name: "", price: "", category: "" });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {mode === "add" ? "Add Food Item" : "Edit Food Item"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.name
                  ? "border-red-300"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter item name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price *
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.price
                  ? "border-red-300"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.category
                  ? "border-red-300"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="e.g., Pizza, Burger, Sushi"
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
            >
              {mode === "add" ? "Add Item" : "Update Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodItemModal;
