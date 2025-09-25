import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Store,
  Clock,
  DollarSign,
  Package,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import noProfile from "../../assets/images/no-profile.png";

const OrderDetail = () => {
  const { id } = useParams();
  const { getOrderById } = useData();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getOrderById(id);

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch order detail");
        }

        setOrder(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchOrder();
    }
  }, [id, token, getOrderById]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Clock className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600 dark:text-gray-400">
            Loading order details...
          </span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/orders"
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Order Not Found
            </h1>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Order not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error ||
              "The order you're looking for doesn't exist or has been removed."}
          </p>
        </div>
      </div>
    );
  }

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

  const statusIcons = {
    Pending: Clock,
    Accepted: CheckCircle,
    Preparing: Package,
    "On the Way": Truck,
    "Ready for Pickup": Package,
    Delivered: CheckCircle,
    Cancelled: XCircle,
  };

  const StatusIcon = statusIcons[order.status.label] || Clock;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " at " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/dashboard/orders"
          className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Order #{order.id}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Order details and management
          </p>
        </div>
      </div>

      {/* Order Status Card */}
      <div
        className={`rounded-lg shadow-sm border p-6 ${
          order.status.label === "Pending"
            ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/40 dark:border-yellow-900"
            : order.status.label === "Accepted"
            ? "bg-green-50 border-green-200 dark:bg-green-900/40 dark:border-green-900"
            : order.status.label === "Preparing"
            ? "bg-blue-50 border-blue-200 dark:bg-blue-900/40 dark:border-blue-900"
            : order.status.label === "On the Way"
            ? "bg-purple-50 border-purple-200 dark:bg-purple-900/40 dark:border-purple-900"
            : order.status.label === "Ready for Pickup"
            ? "bg-orange-50 border-orange-200 dark:bg-orange-900/40 dark:border-orange-900"
            : order.status.label === "Delivered"
            ? "bg-green-50 border-green-200 dark:bg-green-900/40 dark:border-green-900"
            : order.status.label === "Cancelled"
            ? "bg-red-50 border-red-200 dark:bg-red-900/40 dark:border-red-900"
            : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`p-3 rounded-lg flex items-center justify-center ${
                  order.status.label === "Pending"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  : order.status.label === "Accepted"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : order.status.label === "Preparing"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  : order.status.label === "On the Way"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                  : order.status.label === "Ready for Pickup"
                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                  : order.status.label === "Delivered"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : order.status.label === "Cancelled"
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              <StatusIcon className="h-6 w-6" />
            </div>
            <div>
              <h2
                className={`text-xl font-semibold ${
                  order.status.label === "Pending"
                    ? "text-yellow-800 dark:text-yellow-300"
                    : order.status.label === "Accepted"
                    ? "text-green-800 dark:text-green-300"
                    : order.status.label === "Preparing"
                    ? "text-blue-800 dark:text-blue-300"
                    : order.status.label === "Ready for Pickup"
                    ? "text-orange-800 dark:text-orange-300"
                    : order.status.label === "Delivered"
                    ? "text-green-800 dark:text-green-300"
                    : order.status.label === "Cancelled"
                    ? "text-red-800 dark:text-red-300"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                Order Status: {order.status.label}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${parseFloat(order.total_amount).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Amount
            </div>
          </div>
        </div>
      </div>

      {/* Order Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              Customer Information
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <img
                  src={order.customer.image || noProfile}
                  alt={order.customer.name}
                  className="w-10 h-10 object-cover rounded-full"
                />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {order.customer.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Customer ID: {order.customer.id}
                </div>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 mr-3" />
                <span>{order.customer.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4 mr-3" />
                <span>{order.customer.phone}</span>
              </div>
              <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-3 mt-0.5" />
                <span>{order.customer.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Additional Information
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Special Instructions
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {order.remarks || "No special instructions provided"}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Payment Method
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Credit Card ending in ****1234
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Order Items
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {order.food_detail &&
              order.food_detail.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      {/* <Package className="h-6 w-6 text-orange-600 dark:text-orange-400" /> */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity: {parseInt(item.quantity)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      ${parseFloat(item.price).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      per item
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${parseFloat(order.total_amount || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Delivery Fee
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  $0.00
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  $0.00
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-gray-900 dark:text-white">
                  ${parseFloat(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Order Timeline
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  Order Placed
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(order.created_at)}
                </div>
              </div>
            </div>

            {order.status.label === "Accepted" && (
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    Order Accepted
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Restaurant has accepted your order
                  </div>
                </div>
              </div>
            )}

            {order.status.label !== "Pending" &&
              order.status.label !== "Accepted" && (
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      Order Confirmed
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Restaurant confirmed the order
                    </div>
                  </div>
                </div>
              )}

            {[
              "Accepted",
              "Preparing",
              "Ready for Pickup",
              "On the Way",
              "Delivered",
            ].includes(order.status.label) && (
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    Preparing
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Restaurant is preparing your order
                  </div>
                </div>
              </div>
            )}

            {[
              "Accepted",
              "Ready for Pickup",
              "On the Way",
              "Delivered",
            ].includes(order.status.label) && (
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {order.status.label === "Ready for Pickup"
                      ? "Ready for Pickup"
                      : "Out for Delivery"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {order.status.label === "Ready for Pickup"
                      ? "Your order is ready for pickup"
                      : "Your order is on the way"}
                  </div>
                </div>
              </div>
            )}

            {order.status.label === "Delivered" && (
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    Delivered
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Order has been delivered successfully
                  </div>
                </div>
              </div>
            )}

            {order.status.label === "Cancelled" && (
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    Order Cancelled
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    This order has been cancelled
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

export default OrderDetail;
