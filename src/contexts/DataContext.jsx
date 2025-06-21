import { createContext, useContext, useState } from "react";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

// Mock data
const mockVendors = [
  {
    id: 1,
    name: "Pizza Palace",
    email: "contact@pizzapalace.com",
    phone: "+1234567890",
    address: "123 Main St, City",
    rating: 4.5,
    orders: 156,
    revenue: 12450,
    status: "active",
    image:
      "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400",
    foodItems: [
      { id: 1, name: "Margherita Pizza", price: 12.99, category: "Pizza" },
      { id: 2, name: "Pepperoni Pizza", price: 14.99, category: "Pizza" },
    ],
  },
  {
    id: 2,
    name: "Burger House",
    email: "info@burgerhouse.com",
    phone: "+1234567891",
    address: "456 Oak Ave, City",
    rating: 4.2,
    orders: 134,
    revenue: 9800,
    status: "active",
    image:
      "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400",
    foodItems: [
      { id: 3, name: "Classic Burger", price: 8.99, category: "Burger" },
      { id: 4, name: "Cheese Burger", price: 9.99, category: "Burger" },
    ],
  },
  {
    id: 3,
    name: "Sushi Express",
    email: "hello@sushiexpress.com",
    phone: "+1234567892",
    address: "789 Pine St, City",
    rating: 4.7,
    orders: 98,
    revenue: 15600,
    status: "active",
    image:
      "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400",
    foodItems: [
      { id: 5, name: "Salmon Roll", price: 16.99, category: "Sushi" },
      { id: 6, name: "Tuna Roll", price: 18.99, category: "Sushi" },
    ],
  },
];

const mockOrders = [
  {
    id: "ORD001",
    customerId: 1,
    customerName: "John Doe",
    vendorId: 1,
    vendorName: "Pizza Palace",
    amount: 25.98,
    status: "delivered",
    date: "2024-01-15T10:30:00Z",
    items: ["Margherita Pizza", "Pepperoni Pizza"],
  },
  {
    id: "ORD002",
    customerId: 2,
    customerName: "Jane Smith",
    vendorId: 2,
    vendorName: "Burger House",
    amount: 18.98,
    status: "preparing",
    date: "2024-01-15T11:15:00Z",
    items: ["Classic Burger", "Cheese Burger"],
  },
  {
    id: "ORD003",
    customerId: 3,
    customerName: "Mike Johnson",
    vendorId: 3,
    vendorName: "Sushi Express",
    amount: 35.98,
    status: "out-for-delivery",
    date: "2024-01-15T12:00:00Z",
    items: ["Salmon Roll", "Tuna Roll"],
  },
  {
    id: "ORD004",
    customerId: 4,
    customerName: "Sarah Wilson",
    vendorId: 1,
    vendorName: "Pizza Palace",
    amount: 14.99,
    status: "pending",
    date: "2024-01-15T12:30:00Z",
    items: ["Pepperoni Pizza"],
  },
];

export const DataProvider = ({ children }) => {
  const [vendors, setVendors] = useState(mockVendors);
  const [orders, setOrders] = useState(mockOrders);

  const stats = {
    totalCustomers: 1247,
    totalVendors: vendors.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
  };

  const addVendor = (vendor) => {
    const newVendor = {
      ...vendor,
      id: Date.now(),
      orders: 0,
      revenue: 0,
      status: "active",
      foodItems: [],
    };
    setVendors([...vendors, newVendor]);
  };

  const updateVendor = (id, updates) => {
    setVendors(
      vendors.map((vendor) =>
        vendor.id === id ? { ...vendor, ...updates } : vendor
      )
    );
  };

  const deleteVendor = (id) => {
    setVendors(vendors.filter((vendor) => vendor.id !== id));
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const addFoodItem = (vendorId, item) => {
    const newItem = { ...item, id: Date.now() };
    setVendors(
      vendors.map((vendor) =>
        vendor.id === vendorId
          ? { ...vendor, foodItems: [...vendor.foodItems, newItem] }
          : vendor
      )
    );
  };

  const updateFoodItem = (vendorId, itemId, updates) => {
    setVendors(
      vendors.map((vendor) =>
        vendor.id === vendorId
          ? {
              ...vendor,
              foodItems: vendor.foodItems.map((item) =>
                item.id === itemId ? { ...item, ...updates } : item
              ),
            }
          : vendor
      )
    );
  };

  const deleteFoodItem = (vendorId, itemId) => {
    setVendors(
      vendors.map((vendor) =>
        vendor.id === vendorId
          ? {
              ...vendor,
              foodItems: vendor.foodItems.filter((item) => item.id !== itemId),
            }
          : vendor
      )
    );
  };

  const value = {
    vendors,
    orders,
    stats,
    addVendor,
    updateVendor,
    deleteVendor,
    updateOrderStatus,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
