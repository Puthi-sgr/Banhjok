import { createContext, useContext, useEffect, useState } from "react";

const VendorContext = createContext();

export const useVendor = () => {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error("useVendor must be used within a VendorProvider");
  }
  return context;
};

export const VendorProvider = ({ children }) => {
  const [vendors, setVendors] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getVendors = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/public/vendors`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch vendors");
      }
      const data = await response.json();
      setVendors(data.data.vendors);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getVendorById = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/public/vendors/${id}`,
        {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch vendor");
      }
      const { data } = await response.json();
      setVendor(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVendors();
  }, []);

  const values = {
    vendors,
    vendor,
    loading,
    error,
    getVendors,
    getVendorById,
  };
  return (
    <VendorContext.Provider value={values}>{children}</VendorContext.Provider>
  );
};
