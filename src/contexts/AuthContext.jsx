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
  const navigate = useNavigate();

  const hasFetchedUser = useRef(false);

  useEffect(() => {
    if (!token || hasFetchedUser.current) return;

    hasFetchedUser.current = true;
    getUser();
  }, [token]);

  const getUser = async () => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        console.warn("VITE_API_URL not found in environment variables");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${apiUrl}/api/admin/user`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response received:", textResponse);

        // Check for database connection errors
        if (
          textResponse.includes("too many clients already") ||
          textResponse.includes("DB connection failed")
        ) {
          throw new Error("Database connection limit reached");
        }

        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();
      const userData = data.data || data;

      const userWithRole = {
        ...userData,
        role: "admin",
      };

      setUser(userWithRole);
      localStorage.setItem("user", JSON.stringify(userWithRole));
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getUser();
    } else {
      // Check if there's existing user data in localStorage
      const existingUser = localStorage.getItem("user");
      if (existingUser) {
        try {
          const userData = JSON.parse(existingUser);
          setUser(userData);
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    }
  }, [token]);

  const saveToken = (token) => {
    setToken(token);
    localStorage.setItem("jwt_token", token);
  };

  const loginCustomer = async (email, password) => {
    // Simulate API call to customer login endpoint
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo customer credentials
        if (email === "customer@food.com" && password === "customer123") {
          const userData = {
            id: 1,
            name: "John Customer",
            email: "customer@food.com",
            role: "customer",
            avatar: null,
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error("Invalid customer credentials"));
        }
      }, 1000);
    });
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

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response received:", textResponse);

        // Check for database connection errors
        if (
          textResponse.includes("too many clients already") ||
          textResponse.includes("DB connection failed")
        ) {
          throw new Error("Database connection limit reached");
        }

        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();

      const responseData = data.data || data;

      if (responseData.token) {
        saveToken(responseData.token);

        // Create user object with admin role
        const userData = {
          id: responseData.admin_id,
          email: email,
          role: "admin",
          admin_id: responseData.admin_id,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        return userData;
      }

      throw new Error("No token received from server");
    } catch (error) {
      console.error("Login failed:", error.message);
      throw new Error(error.message || "Failed to login as admin");
    }
  };

  const registerCustomer = async (name, email, password) => {
    // Simulate API call to customer registration endpoint
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if email already exists (demo validation)
        if (email === "customer@food.com") {
          reject(new Error("Email already exists"));
          return;
        }

        const userData = {
          id: Date.now(),
          name,
          email,
          role: "customer",
          avatar: null,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        resolve(userData);
      }, 1000);
    });
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
