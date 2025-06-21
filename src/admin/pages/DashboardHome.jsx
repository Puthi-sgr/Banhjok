import {
  Users,
  Store,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useData } from "../../contexts/DataContext";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";

const DashboardHome = () => {
  const { stats, orders, vendors } = useData();

  const statsCards = [
    {
      title: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      icon: Users,
      change: "+12%",
      changeType: "increase",
      color: "blue",
    },
    {
      title: "Total Vendors",
      value: stats.totalVendors.toString(),
      icon: Store,
      change: "+8%",
      changeType: "increase",
      color: "green",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      change: "+15%",
      changeType: "increase",
      color: "purple",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      change: "+23%",
      changeType: "increase",
      color: "orange",
    },
  ];

  const recentOrdersColumns = [
    { key: "id", label: "Order ID" },
    { key: "customerName", label: "Customer" },
    { key: "vendorName", label: "Vendor" },
    {
      key: "amount",
      label: "Amount",
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "delivered"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : value === "preparing"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
              : value === "out-for-delivery"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
          }`}
        >
          {value.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const topVendorsColumns = [
    { key: "name", label: "Name" },
    { key: "orders", label: "Orders" },
    {
      key: "revenue",
      label: "Revenue",
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: "rating",
      label: "Rating",
      render: (value) => (
        <div className="flex items-center">
          <span className="text-yellow-500">★</span>
          <span className="ml-1">{value}</span>
        </div>
      ),
    },
  ];

  const topVendors = vendors.sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const recentOrders = orders
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here's what's happening with your delivery platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Latest orders from your platform
            </p>
          </div>
          <DataTable
            columns={recentOrdersColumns}
            data={recentOrders}
            className="border-0"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Top Vendors
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Best performing vendors by revenue
            </p>
          </div>
          <DataTable
            columns={topVendorsColumns}
            data={topVendors}
            className="border-0"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-left">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                <Store className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Add New Vendor
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Register a new restaurant
                </p>
              </div>
            </div>
          </button>

          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-left">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  View All Orders
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage order statuses
                </p>
              </div>
            </div>
          </button>

          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-left">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  View Analytics
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Check performance metrics
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
