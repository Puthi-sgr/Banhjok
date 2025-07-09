import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, LogOut } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import Footer from "./Footer";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItemCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = () => {
    logout();
  };

  const handleUserClick = () => {
    if (!user) {
      navigate("/auth");
    } else {
      switch (user.role) {
        case "customer":
          navigate("/profile");
          break;
        case "vendor":
          navigate("/vendor");
          break;
        case "admin":
          navigate("/dashboard");
          break;
        default:
          navigate("/auth");
      }
    }
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Banhjok</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/"
                    ? "text-orange-600 bg-orange-50"
                    : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/explore"
                className={`text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === "/explore"
                    ? "text-orange-600 bg-orange-50"
                    : ""
                }`}
              >
                Explore
              </Link>
              <button className="text-gray-700 hover:text-orange-600 p-2 rounded-md transition-colors">
                <Search className="w-5 h-5" />
              </button>

              {/* Authentication Section */}
              {user ? (
                // User is logged in - show profile, cart, and logout
                <>
                  {user.role === "customer" && (
                    <Link
                      to="/cart"
                      className="relative text-gray-700 hover:text-orange-600 p-2 rounded-md transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {cartItemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                  )}
                  <button
                    onClick={handleUserClick}
                    className="text-gray-700 hover:text-orange-600 p-2 rounded-md transition-colors"
                    title={user.name || user.email}
                  >
                    <User className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-orange-600 p-2 rounded-md transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                // User is not logged in - show login button
                <Link
                  to="/auth"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-orange-600 p-2 rounded-md"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === "/"
                    ? "text-orange-600 bg-orange-50"
                    : "text-gray-700 hover:text-orange-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/explore"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === "/explore"
                    ? "text-orange-600 bg-orange-50"
                    : "text-gray-700 hover:text-orange-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>

              {/* Mobile Authentication Section */}
              {user ? (
                // User is logged in - show profile, cart, and logout
                <>
                  {user.role === "customer" && (
                    <>
                      <Link
                        to="/cart"
                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>Cart ({cartItemCount})</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <span>Profile</span>
                      </Link>
                    </>
                  )}
                  {user.role !== "customer" && (
                    <button
                      onClick={() => {
                        handleUserClick();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600"
                    >
                      <User className="w-5 h-5" />
                      <span>{user.name || user.email}</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                // User is not logged in - show login button
                <Link
                  to="/auth"
                  className="block w-full text-center bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
      <Outlet />
      <Footer />
    </>
  );
};
