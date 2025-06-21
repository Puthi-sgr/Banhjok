import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import {
  Store,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  User,
  LogOut,
  Plus,
  Edit,
  Eye,
  Clock,
  CheckCircle,
} from "lucide-react";

const VendorDashboard = () => {
  const { user, logout } = useAuth();
  const { vendors, orders } = useData();

  // Get vendor data (in real app, this would be fetched based on user.vendorId)
  const vendorData = vendors.find((v) => v.id === user?.vendorId) || vendors[0];
  const vendorOrders = orders.filter(
    (order) => order.vendorId === vendorData?.id
  );

  const stats = {
    totalOrders: vendorOrders.length,
    pendingOrders: vendorOrders.filter((o) => o.status === "pending").length,
    completedOrders: vendorOrders.filter((o) => o.status === "delivered")
      .length,
    totalRevenue: vendorOrders.reduce((sum, order) => sum + order.amount, 0),
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "out-for-delivery":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Store className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                Vendor Dashboard
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {vendorData?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your restaurant and track your orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Orders
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.pendingOrders}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.completedOrders}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Restaurant Information
              </h2>
              <button className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200">
                <Edit className="h-5 w-5 mr-2" />
                Edit Info
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-start space-x-6">
              <img
                src={vendorData?.image}
                alt={vendorData?.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {vendorData?.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p>
                      <strong>Email:</strong> {vendorData?.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {vendorData?.phone}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Rating:</strong> ⭐ {vendorData?.rating}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          vendorData?.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {vendorData?.status?.charAt(0).toUpperCase() +
                          vendorData?.status?.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
                <p className="mt-2">
                  <strong>Address:</strong> {vendorData?.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Orders
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendorOrders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.items.join(", ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${order.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status
                          .replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {vendorOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600">
                Orders will appear here once customers start ordering
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;
