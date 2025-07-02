import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../admin/layouts/Dashboard";
import DashboardHome from "../admin/pages/DashboardHome";
import VendorManagement from "../admin/pages/VendorManagement";
import VendorDetails from "../admin/pages/VendorDetails";
import OrderManagement from "../admin/pages/OrderManagement";
import AdminProfile from "../admin/pages/AdminProfile";
import AuthPage from "../auth/AuthPage";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../clients/pages/Home";
import VendorDashboard from "../vendor/pages/VendorDashboard";
import OrderDetail from "../admin/pages/OrderDetail";
import CustomerManagement from "../admin/pages/CustomerManagement";
import CustomerProfile from "../admin/pages/CustomerProfile";

const AppRouter = () => {
  return (
    <>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
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
        <Route path="*" element={<Navigate to="/auth" replace />} />

        {/* Client Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Vendor Routes */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRouter;
