import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { DataProvider } from "./contexts/DataContext.jsx";
import { CartProvider } from "./clients/contexts/CartContext.jsx";
import { FoodProvider } from "./clients/contexts/FoodContext.jsx";
import { VendorProvider } from "./clients/contexts/VendorContext.jsx";

const basename = (() => {
  const rawBase = import.meta.env.BASE_URL || "/";
  const normalized = rawBase.endsWith("/") && rawBase.length > 1
    ? rawBase.slice(0, -1)
    : rawBase;
  return normalized === "" ? "/" : normalized;
})();

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename={basename}>
    <AuthProvider>
      <ThemeProvider>
        <DataProvider>
          <FoodProvider>
            <VendorProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </VendorProvider>
          </FoodProvider>
        </DataProvider>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);
