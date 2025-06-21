import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginCustomer = async (email, password) => {
    // Simulate API call to customer login endpoint
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo customer credentials
        if (email === 'customer@food.com' && password === 'customer123') {
          const userData = {
            id: 1,
            name: 'John Customer',
            email: 'customer@food.com',
            role: 'customer',
            avatar: null
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid customer credentials'));
        }
      }, 1000);
    });
  };

  const loginVendor = async (email, password) => {
    // Simulate API call to vendor login endpoint
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo vendor credentials
        if (email === 'vendor@restaurant.com' && password === 'vendor123') {
          const userData = {
            id: 2,
            name: 'Pizza Palace Owner',
            email: 'vendor@restaurant.com',
            role: 'vendor',
            vendorId: 1,
            avatar: null
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid vendor credentials'));
        }
      }, 1000);
    });
  };

  const loginAdmin = async (email, password) => {
    // Simulate API call to admin login endpoint
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo admin credentials
        if (email === 'admin@delivery.com' && password === 'admin123') {
          const userData = {
            id: 3,
            name: 'Admin User',
            email: 'admin@delivery.com',
            role: 'admin',
            avatar: null
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid admin credentials'));
        }
      }, 1000);
    });
  };

  const registerCustomer = async (name, email, password) => {
    // Simulate API call to customer registration endpoint
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if email already exists (demo validation)
        if (email === 'customer@food.com') {
          reject(new Error('Email already exists'));
          return;
        }
        
        const userData = {
          id: Date.now(),
          name,
          email,
          role: 'customer',
          avatar: null
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        resolve(userData);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loginCustomer,
    loginVendor,
    loginAdmin,
    registerCustomer,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};