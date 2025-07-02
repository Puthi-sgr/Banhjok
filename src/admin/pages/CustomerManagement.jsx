import { useEffect, useState } from "react";
import { Grid, List, Loader2, Plus, Search } from "lucide-react";
import CustomerTable from "../components/CustomerTable";
import CustomerCard from "../components/CustomerCard";
import Alert from "../components/Alert";
import { useData } from "../../contexts/DataContext";
import CustomerModal from "../components/CustomerModal";

const CustomerManagement = () => {
  const { customers, getCustomers, deleteCustomer, setCustomers } = useData();
  const [viewMode, setViewMode] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [loading, setLoading] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  const showAlertMessage = (message, variant = "success") => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = async (id) => {
    setDeletingCustomer(id);
  };

  const confirmDelete = async () => {
    if (!deletingCustomer) return;
    setIsDeleting(true);
    const result = await deleteCustomer(deletingCustomer);
    if (result.success) {
      showAlertMessage("Customer deleted successfully", "success");
    } else {
      showAlertMessage("Failed to delete customer", "error");
    }
    setIsDeleting(false);
    setDeletingCustomer(null);
  };

  const handleGetCustomers = async () => {
    try {
      setLoading(true);
      await getCustomers();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setCustomerId(id);
    setShowCustomerModal(true);
  };

  // Find the customer to edit
  const customerToEdit = customerId
    ? customers.find((c) => c.id === customerId)
    : null;

  useEffect(() => {
    handleGetCustomers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Customer Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your customers
          </p>
        </div>
        <button
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          onClick={() => setShowCustomerModal(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              View:
            </span>
            <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                } transition-colors duration-200`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
                } transition-colors duration-200`}
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredCustomers.length} of {customers.length} customers
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <span className="text-gray-600 dark:text-gray-400 text-lg">
              Loading customers data...
            </span>
          </div>
        </div>
      ) : viewMode === "list" ? (
        <CustomerTable
          customers={filteredCustomers}
          onDelete={handleDelete}
          onEdit={handleEdit}
          deletingCustomerId={deletingCustomer}
          isDeleting={isDeleting}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No customers found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria
          </p>
        </div>
      )}

      {/* Alert */}
      <Alert
        message={alertMessage}
        variant={alertVariant}
        open={showAlert}
        onClose={() => setShowAlert(false)}
      />

      <CustomerModal
        isOpen={showCustomerModal}
        onClose={() => {
          setShowCustomerModal(false);
          setCustomerId(null);
        }}
        mode={customerId ? "edit" : "add"}
        customer={customerToEdit}
        onSave={async (result) => {
          if (result.success) {
            const message =
              result.mode === "add"
                ? "Customer added successfully"
                : "Customer updated successfully";
            showAlertMessage(message, "success");
            setShowCustomerModal(false);
            setCustomerId(null);
            await getCustomers();
          } else if (result.error) {
            showAlertMessage(result.error, "error");
          }
        }}
      />

      {/* Delete Confirmation Dialog */}
      {deletingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Delete Customer
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this customer? This action cannot
              be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setDeletingCustomer(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 flex items-center justify-center py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
