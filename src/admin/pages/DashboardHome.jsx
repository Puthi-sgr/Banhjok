import {
  Users,
  Store,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { useData } from "../../contexts/DataContext";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import OrderTable from "../components/OrderTable";
import { Link } from "react-router-dom";

const DashboardHome = () => {
  const { stats, orders, vendors, loading } = useData();

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

  const topVendorsColumns = [
    {
      key: "name",
      label: "Name",
      render: (value, vendor) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-white">
            {value}
          </span>
          {vendor.email && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {vendor.email}
            </span>
          )}
        </div>
      ),
    },
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
    {
      key: "foodTypes",
      label: "Food Types",
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value && value.length > 0 ? (
            value.slice(0, 2).map((type, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs rounded-full"
              >
                {type}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-xs">No types</span>
          )}
          {value && value.length > 2 && (
            <span className="text-gray-500 text-xs">
              +{value.length - 2} more
            </span>
          )}
        </div>
      ),
    },
  ];

  const topVendors =
    vendors && vendors.length > 0
      ? vendors.sort((a, b) => b.revenue - a.revenue).slice(0, 6)
      : [];

  const recentOrders =
    orders && orders.length > 0
      ? orders
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 6)
      : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <span className="text-gray-600 dark:text-gray-400 text-lg">
            Loading dashboard data...
          </span>
        </div>
      </div>
    );
  }

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
          <OrderTable
            orders={recentOrders}
            loading={loading}
            showActions={false}
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
            loading={loading}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/vendors"
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-left"
          >
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
          </Link>

          <Link
            to="/dashboard/orders"
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-left"
          >
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
          </Link>

          <Link
            to="/dashboard/customers"
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Manage Customers
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View and manage customer accounts
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
