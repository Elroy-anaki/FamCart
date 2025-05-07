import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import AuthProvider from "./context/AuthContext.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <ToastContainer />
      <App />
    </AuthProvider>
  </QueryClientProvider>
);

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;
