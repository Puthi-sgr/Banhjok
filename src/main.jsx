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

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
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
