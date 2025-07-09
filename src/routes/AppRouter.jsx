import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../admin/layouts/Dashboard";
import DashboardHome from "../admin/pages/DashboardHome";
import VendorManagement from "../admin/pages/VendorManagement";
import VendorDetails from "../admin/pages/VendorDetails";
import OrderManagement from "../admin/pages/OrderManagement";
import AdminProfile from "../admin/pages/AdminProfile";
import AuthPage from "../auth/AuthPage";
import ProtectedRoute from "./ProtectedRoute";
import VendorDashboard from "../vendor/pages/VendorDashboard";
import OrderDetail from "../admin/pages/OrderDetail";
import CustomerManagement from "../admin/pages/CustomerManagement";
import CustomerProfile from "../admin/pages/CustomerProfile";
import { Landing } from "../clients/pages/Landing";
import { Explore } from "../clients/pages/Explore";
import { VendorDetail } from "../clients/pages/VendorDetail";
import { FoodDetail } from "../clients/pages/FoodDetail";
import { Cart } from "../clients/pages/Cart";
import { CheckoutConfirm } from "../clients/pages/CheckoutConfirm";
import { PaymentPage } from "../clients/pages/PaymentPage";
import { OrderSuccess } from "../clients/pages/OrderSuccess";
import CustomerProfilePage from "../clients/pages/CustomerProfile";
import { Navbar } from "../clients/components/Navbar";

const AppRouter = () => {
  return (
    <>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Client Routes - Public access for most routes */}
        <Route path="/" element={<Navbar />}>
          <Route index element={<Landing />} />
          <Route path="explore" element={<Explore />} />
          <Route path="vendor/:vendorId" element={<VendorDetail />} />
          <Route path="food/:foodId" element={<FoodDetail />} />

          {/* Customer-specific routes - require customer authentication */}
          <Route
            path="cart"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout/confirm"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CheckoutConfirm />
              </ProtectedRoute>
            }
          />
          <Route
            path="payment"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="order/success"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Routes - Protected for admin only */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="vendors" element={<VendorManagement />} />
          <Route path="vendors/:id" element={<VendorDetails />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="customers/:id" element={<CustomerProfile />} />
        </Route>

        {/* Vendor Routes - Protected for vendor only */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route - redirect to auth if not authenticated, otherwise to appropriate dashboard */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </>
  );
};

export default AppRouter;
