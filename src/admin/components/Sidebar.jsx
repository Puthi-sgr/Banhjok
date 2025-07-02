import { NavLink, useLocation } from "react-router-dom";
import { Home, Store, ShoppingCart, X, Truck, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Vendors", href: "/dashboard/vendors", icon: Store },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { name: "Customers", href: "/dashboard/customers", icon: Users },
  ];

  const isActive = (href) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              DeliveryAdmin
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  onClick={() => onClose()}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive(item.href)
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400"
                    }`}
                  />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          to="https://docs.google.com/spreadsheets/d/1vLaUqZRiDGpY4Dy0G8uTRq7qNzs3eQL_LhWNiQ2eDfc/edit?usp=sharing"
          target="_blank"
          className="absolute bottom-4 left-4 right-4"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <h3 className="text-sm font-semibold">Need Help?</h3>
            <p className="text-xs mt-1 opacity-90">
              Check our documentation for guides and API reference.
            </p>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
