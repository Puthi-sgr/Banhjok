import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("jwt_token") || null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const hasFetchedUser = useRef(false);

  // Centralized user fetcher
  const fetchUser = async (
    tokenForFetching,
    roleHint = null // "admin" | "customer" | null
  ) => {
    const api = import.meta.env.VITE_API_URL;
    const paths = {
      admin: "/api/admin/user",
      customer: "/api/v1/auth/profile",
    };
    const tryPaths = roleHint
      ? [paths[roleHint]]
      : [paths.admin, paths.customer];

    for (const path of tryPaths) {
      const response = await fetch(`${api}${path}`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenForFetching}`,
        },
      });

      if (response.status === 401) throw new Error("unauthorized");
      if (!response.ok) continue;

      const { data } = await response.json();
      return path.includes("/admin/")
        ? { ...data, role: "admin", id: data.admin_id ?? data.id }
        : { ...data, role: "customer", id: data.user_id ?? data.id };
    }
    throw new Error("Failed to fetch profile");
  };

  useEffect(() => {
    if (!token || hasFetchedUser.current) return;

    hasFetchedUser.current = true;

    // Check if we have user data in localStorage to determine role
    const existingUser = localStorage.getItem("user");
    if (existingUser) {
      try {
        const userData = JSON.parse(existingUser);
        if (userData.role === "customer") {
          getCustomer();
        } else if (userData.role === "admin") {
          getUser();
        } else {
          getCustomer();
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        localStorage.removeItem("user");
        getCustomer();
      }
    } else {
      getCustomer();
    }
  }, [token]);

  // Refactored getUser
  const getUser = async (triedAdmin = false) => {
    setIsLoading(true);
    try {
      if (!token) throw new Error("No token");
      const userData = await fetchUser(token, "admin");
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setAuthError(null);
    } catch (error) {
      console.error("Error fetching admin user:", error.message);
      if (!triedAdmin) {
        await getCustomer(true);
      } else {
        setUser(null);
        setAuthError(
          "Failed to get admin profile. Please check your connection."
        );
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Refactored getCustomer
  const getCustomer = async (triedCustomer = false) => {
    setIsLoading(true);
    try {
      if (!token) throw new Error("No token");
      const customerData = await fetchUser(token, "customer");
      setUser(customerData);
      localStorage.setItem("user", JSON.stringify(customerData));
      setAuthError(null);
    } catch (error) {
      console.error("Error fetching customer:", error.message);
      if (!triedCustomer) {
        await getUser(true);
      } else {
        setUser(null);
        setAuthError(
          "Failed to get customer profile. Please check your connection."
        );
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Login flows use fetchUser
  const loginCustomer = async (email, password) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Invalid customer credentials");
      }
      const data = await response.json();
      const responseData = data.data || data;
      if (responseData.token) {
        saveToken(responseData.token);
        const customerData = await fetchUser(responseData.token, "customer");
        setUser(customerData);
        localStorage.setItem("user", JSON.stringify(customerData));
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      throw new Error(error.message || "Failed to login as customer");
    }
  };

  const loginVendor = async (email, password) => {
    // Simulate API call to vendor login endpoint
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo vendor credentials
        if (email === "vendor@restaurant.com" && password === "vendor123") {
          const userData = {
            id: 2,
            name: "Pizza Palace Owner",
            email: "vendor@restaurant.com",
            role: "vendor",
            vendorId: 1,
            avatar: null,
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error("Invalid vendor credentials"));
        }
      }, 1000);
    });
  };

  // Login admin using API for AuthPage.jsx
  const loginAdmin = async (email, password) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Invalid admin credentials");
      }
      const data = await response.json();
      const responseData = data.data || data;
      if (responseData.token) {
        saveToken(responseData.token);
        const adminData = await fetchUser(responseData.token, "admin");
        setUser(adminData);
        localStorage.setItem("user", JSON.stringify(adminData));
        return adminData;
      }
      throw new Error("No token received from server");
    } catch (error) {
      console.error("Login failed:", error.message);
      throw new Error(error.message || "Failed to login as admin");
    }
  };

  const registerCustomer = async (name, email, password) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Invalid customer credentials");
      }
      const data = await response.json();
      const responseData = data.data || data;
      if (responseData.token) {
        saveToken(responseData.token);
        const customerData = await fetchUser(responseData.token, "customer");
        setUser(customerData);
        localStorage.setItem("user", JSON.stringify(customerData));
      }
    } catch (error) {
      console.error("Register failed:", error.message);
      throw new Error(error.message || "Failed to register as customer");
    }
  };

  const saveToken = (token) => {
    setToken(token);
    localStorage.setItem("jwt_token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("jwt_token");
    navigate("/auth");
  };

  const value = {
    user,
    loginCustomer,
    loginVendor,
    loginAdmin,
    registerCustomer,
    logout,
    isLoading,
    token,
    getCustomer,
    getUser,
    authError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
