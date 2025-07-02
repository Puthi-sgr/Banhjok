import { useState } from "react";
import { Package, Clock, Truck, CheckCircle, XCircle, Eye } from "lucide-react";
import { useData } from "../../contexts/DataContext";
import DataTable from "./DataTable";
import { Link } from "react-router-dom";

export const getOptionValue = (value) => {
  if (value === "Ready for Pickup") return "ready";
  if (value === "On the Way") return "on_the_way";
  if (value === "Delivered") return "delivered";
  if (value === "Cancelled") return "cancelled";
  if (value === "Pending") return "pending";
  if (value === "Accepted") return "accepted";
  if (value === "Preparing") return "preparing";
  return value;
};

export const getOptionLabel = (value) => {
  if (value === "ready") return "Ready for Pickup";
  if (value === "on_the_way") return "On the Way";
  if (value === "delivered") return "Delivered";
  if (value === "cancelled") return "Cancelled";
  if (value === "pending") return "Pending";
  if (value === "accepted") return "Accepted";
  if (value === "preparing") return "Preparing";
  return value;
};

const OrderTable = ({
  orders,
  loading = false,
  showActions = true,
  className = "",
  maxHeight = null,
}) => {
  const { updateOrderStatus } = useData();
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const statusIcons = {
    Pending: Clock,
    Accepted: CheckCircle,
    Preparing: Package,
    "On the Way": Truck,
    "Ready for Pickup": Package,
    Delivered: CheckCircle,
    Cancelled: XCircle,
  };

  const statusColors = {
    Pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Accepted:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Preparing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "On the Way":
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    "Ready for Pickup":
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    Delivered:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!showActions) return;

    setUpdatingOrder(orderId);
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (!result.success) {
        console.error("Failed to update order status:", result.error);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusIcon = (status) => {
    const Icon = statusIcons[status] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const orderColumns = [
    // {
    //   key: "id",
    //   label: "Order ID",
    //   render: (value) => `#${value || "N/A"}`,
    // },
    {
      key: "customerName",
      label: "Customer",
      render: (value, order) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-white">
            {value || "Unknown Customer"}
          </span>
          {order.customerEmail && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {order.customerEmail}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "customerPhone",
      label: "Contact",
      render: (value) => value || "N/A",
    },
    {
      key: "amount",
      label: "Amount",
      render: (value) => {
        const numValue =
          typeof value === "number" ? value : parseFloat(value) || 0;
        return `$${numValue.toFixed(2)}`;
      },
    },
    {
      key: "statusLabel",
      label: "Status",
      render: (value) => {
        if (!value) return <span className="text-gray-500">Unknown</span>;
      
        const statusColor = statusColors[value] || statusColors.Pending;
        const StatusIcon = statusIcons[value] || Clock;

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
          >
            <span className="mr-1">
              <StatusIcon className="h-4 w-4" />
            </span>
            {getOptionLabel(value)}
          </span>
        );
      },
    },
    {
      key: "date",
      label: "Date",
      render: (value) => {
        if (!value) return "N/A";
        return formatDate(value);
      },
    },
    ...(showActions
      ? [
          {
            key: "actions",
            label: "Actions",
            render: (_, order) => (
              <div className="flex items-center space-x-2">
                <Link
                  to={`/dashboard/orders/${order.id}`}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                  title="View Order Details"
                >
                  <Eye className="h-6 w-6" />
                </Link>
                <select
                  value={getOptionValue(order.statusLabel)}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  disabled={updatingOrder === order.id}
                  className="text-sm border px-2 py-1 border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready for Pickup</option>
                  <option value="on_the_way">On the Way</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <DataTable
        columns={orderColumns}
        data={orders}
        loading={loading}
        maxHeight={maxHeight}
      />
    </div>
  );
};

export default OrderTable;
