import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getOptionLabel, getOptionValue } from "../admin/components/OrderTable";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

// Initial state
const initialState = {
  vendors: [],
  orders: [],
  customers: [],
  stats: {
    totalCustomers: 0,
    totalVendors: 0,
    totalOrders: 0,
    totalRevenue: 0,
  },
  loading: true,
};

export const DataProvider = ({ children }) => {
  const [vendors, setVendors] = useState(initialState.vendors);
  const [orders, setOrders] = useState(initialState.orders);
  const [customers, setCustomers] = useState(initialState.customers);
  const [stats, setStats] = useState(initialState.stats);
  const [loading, setLoading] = useState(initialState.loading);
  const { token, user } = useAuth();

  // Fetch with auth
  const fetchWithAuth = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      // throw new Error(`Something went wrong, please try again later.`);
      let errorMessage = `${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = `${errorMessage} - ${errorData.message}`;
        }
        if (errorData.error) {
          errorMessage = `${errorMessage} - ${errorData.error}`;
        }
      } catch (e) {
        console.log("Could not parse error response as JSON");
      }
      throw new Error(errorMessage);
    }

    return response.json();
  };

  // Fetch stats
  const getStats = async () => {
    try {
      const data = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/api/admin/stats`
      );

      if (data.success) {
        setStats({
          totalCustomers: data.data.total_customers || 0,
          totalVendors: data.data.total_vendors || 0,
          totalOrders: data.data.total_orders || 0,
          totalRevenue: data.data.total_revenue || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers
  const getCustomers = async () => {
    try {
      const data = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/api/admin/customers`
      );

      if (data.success) {
        // Format customer data for table display
        const formattedCustomers = data.data.map((customer) => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          location: customer.location,
          latLng: customer.lat_lng,
          image: customer.image,
          created_at: customer.created_at,
        }));

        setCustomers(formattedCustomers);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    }
  };

  // Fetch vendors
  const getVendors = async () => {
    try {
      const data = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/api/admin/vendors`
      );

      if (data.success) {
        // Format vendor data for table display
        const formattedVendors = data.data.vendors.map((vendor) => ({
          id: vendor.id,
          name: vendor.name,
          email: vendor.email,
          phone: vendor.phone,
          address: vendor.address,
          foodTypes: vendor.food_types || [],
          rating: vendor.rating,
          image: vendor.image,
          // Add mock data for display purposes
          orders: vendor.totalOrders,
          revenue: vendor.revenue,
          status: "active",
        }));

        setVendors(formattedVendors);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setVendors([]);
    }
  };

  // Fetch orders
  const getOrders = async () => {
    try {
      const data = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/api/admin/orders`
      );

      if (data.success) {
        // Format order data for table display
        const formattedOrders = data.data.orders.map((order) => ({
          id: order.id,
          customerId: order.customer.id,
          customerName: order.customer.name,
          customerEmail: order.customer.email,
          customerPhone: order.customer.phone,
          customerAddress: order.customer.address,
          amount: parseFloat(order.total_amount) || 0,
          statusLabel: order.statuslabel,
          remarks: order.remarks || "",
          date: order.created_at,
          created_at: order.created_at,
        }));

        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  // Add vendor
  const addVendor = async (vendorData) => {
    try {
      const formData = new FormData();
      formData.append("name", vendorData.name);
      formData.append("email", vendorData.email);
      formData.append("password", vendorData.password);
      formData.append("phone", vendorData.phone);
      formData.append("address", vendorData.address);
      formData.append("rating", parseFloat(vendorData.rating));

      if (vendorData.food_types && Array.isArray(vendorData.food_types)) {
        vendorData.food_types.forEach((type, index) => {
          formData.append(`food_types[${index}]`, type);
        });
      }

      if (vendorData.image instanceof File) {
        formData.append("image", vendorData.image);
      } else if (vendorData.image) {
        formData.append("image_url", vendorData.image);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/vendors`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add vendor");
      }

      const data = await response.json();

      if (data.success) {
        getVendors();
        getStats();
      }

      return { success: true, data: data };
    } catch (error) {
      console.error("Error adding vendor:", error);
      return { success: false, error: error.message };
    }
  };

  // Delete vendor
  const deleteVendor = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/vendors/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete vendor");
      }

      setVendors(vendors.filter((vendor) => vendor.id !== id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting vendor:", error);
      return { success: false, error: error.message };
    }
  };

  // Update vendor
  const updateVendor = async (id, updates) => {
    try {
      const formData = new FormData();
      formData.append("name", updates.name);
      formData.append("phone", updates.phone);
      formData.append("address", updates.address);
      formData.append("rating", parseFloat(updates.rating));

      if (updates.food_types && Array.isArray(updates.food_types)) {
        updates.food_types.forEach((type, index) => {
          formData.append(`food_types[${index}]`, type);
        });
      }

      if (updates.image instanceof File) {
        formData.append("image", updates.image);
      } else if (updates.image) {
        formData.append("image_url", updates.image);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/vendors/${id}`,
        {
          method: "PUT",
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        // Debugging: log status and try to parse error message
        console.error(
          "Update vendor failed:",
          response.status,
          response.statusText
        );
        let errorMsg = `Failed to update vendor: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error("Error response from server:", errorData);
          if (errorData.message) {
            errorMsg += ` - ${errorData.message}`;
          }
          if (errorData.error) {
            errorMsg += ` - ${errorData.error}`;
          }
        } catch (e) {
          console.error("Could not parse error response as JSON");
        }
        throw new Error(errorMsg);
      }
      const data = await response.json();

      if (data.success) {
        getVendors();
      }

      return { success: true, data: data };
    } catch (error) {
      console.error("Error updating vendor:", error);
      return { success: false, error: error.message };
    }
  };

  // Fetch vendor by ID with foods
  const getVendorById = async (vendorId) => {
    try {
      const data = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/api/admin/vendors/${vendorId}`
      );

      if (data.success) {
        // Format vendor and foods data for detail page
        const formattedVendor = {
          ...data.data.vendor,
          foodTypes: data.data.vendor.food_types || [],
        };

        const formattedFoods = data.data.foods.map((food) => ({
          id: food.id,
          name: food.name,
          description: food.description,
          category: food.category,
          price: parseFloat(food.price),
          readyTime: food.ready_time,
          rating: parseFloat(food.rating),
          image: food.image,
          qtyAvailable: food.qty_available,
          createdAt: food.created_at,
          updatedAt: food.updated_at,
        }));

        return {
          success: true,
          data: {
            vendor: formattedVendor,
            foods: formattedFoods,
          },
        };
      } else {
        throw new Error(data.message || "Failed to fetch vendor details");
      }
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      return { success: false, error: error.message };
    }
  };

  // Add food item
  const addFoodItem = async (vendorId, item) => {
    try {
      const formData = new FormData();
      formData.append("vendor_id", vendorId);
      formData.append("name", item.name);
      formData.append("description", item.description || "");
      formData.append("category", item.category);
      formData.append("price", item.price);
      formData.append("ready_time", item.ready_time || 0);
      formData.append("rating", item.rating || 0);

      if (item.image instanceof File) {
        formData.append("image", item.image);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/foods`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add food item");
      }

      const data = await response.json();
      return { success: true, data: data };
    } catch (error) {
      console.error("Error adding food item:", error);
      return { success: false, error: error.message };
    }
  };

  // Update food item
  const updateFoodItem = async (vendorId, itemId, updates) => {
    try {
      const data = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/api/admin/foods/${itemId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            vendor_id: vendorId,
            name: updates.name,
            description: updates.description || "",
            category: updates.category,
            price: updates.price,
            ready_time: updates.ready_time || 0,
            rating: updates.rating || 0,
            images: updates.images || [],
          }),
        }
      );

      if (data.success) {
        return { success: true, data: data };
      } else {
        throw new Error(data.message || "Failed to update food item");
      }
    } catch (error) {
      console.error("Error updating food item:", error);
      return { success: false, error: error.message };
    }
  };

  // Delete food item
  const deleteFoodItem = async (itemId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/foods/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete food item");
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting food item:", error);
      return { success: false, error: error.message };
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const data = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status_key: getOptionValue(status) }),
        }
      );

      if (data.success) {
        setOrders(
          orders.map((order) =>
            order.id === orderId
              ? { ...order, statusLabel: getOptionLabel(status) }
              : order
          )
        );
        return { success: true };
      } else {
        throw new Error(data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      return { success: false, error: error.message };
    }
  };

  // Fetch order by ID
  const getOrderById = async (orderId) => {
    try {
      const data = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}`
      );

      if (data.success) {
        return { success: true, data: data.data.order };
      } else {
        throw new Error(data.message || "Failed to fetch order details");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      return { success: false, error: error.message };
    }
  };

  // Add customer
  const addCustomer = async (customerData) => {
    try {
      const response = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/api/admin/customers`,
        {
          method: "POST",
          body: JSON.stringify(customerData),
        }
      );

      return {
        success: true,
        data: { ...customerData, lat_lng: "" || null },
      };
    } catch (error) {
      console.error("Error adding customer:", error);
      return { success: false, error: error.message };
    }
  };

  // Delete customer
  const deleteCustomer = async (id) => {
    try {
      const response = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/api/admin/customers/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.success) {
        setCustomers(customers.filter((customer) => customer.id != id));
        return { success: true };
      } else {
        throw new Error("Failed to delete customer");
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  // Update customer
  const updateCustomer = async (id, updates) => {
    try {
      const response = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/api/admin/customers/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(updates),
        }
      );

      if (response.success) {
        setCustomers(
          customers.map((customer) =>
            customer.id === id ? { ...customer, ...updates } : customer
          )
        );
        return { success: true };
      } else {
        throw new Error("Failed to update customer");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      return { success: false, error: error.message };
    }
  };

  // Fetch customer by ID
  const getCustomerById = async (id) => {
    const data = await fetchWithAuth(
      `${import.meta.env.VITE_API_URL}/api/admin/customers/${id}`
    );
    return data;
  };

  useEffect(() => {
    // Only fetch admin data if user is authenticated and is an admin
    if (token && user && user.role === "admin") {
      getStats();
      getVendors();
      getOrders();
    } else if (token && user) {
      // For non-admin users, just set loading to false
      setLoading(false);
    }
  }, [token, user]);

  const value = {
    vendors,
    orders,
    customers,
    setCustomers,
    stats,
    loading,
    addVendor,
    updateVendor,
    getVendorById,
    deleteVendor,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    updateOrderStatus,
    getOrderById,
    getCustomers,
    deleteCustomer,
    addCustomer,
    updateCustomer,
    getCustomerById,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
