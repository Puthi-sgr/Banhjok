import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { DataProvider } from "./contexts/DataContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);
