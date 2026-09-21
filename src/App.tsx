import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "./lib/ToastContext";
import ToastContainer from "./components/ToastContainer";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GuildLayout from "./pages/GuildLayout";
import ComponentBuilder from "./pages/ComponentBuilder";
import WelcomeBuilder from "./pages/WelcomeBuilder";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/:guildId" element={<GuildLayout />}>
                <Route path="components" element={<ComponentBuilder />} />
                <Route path="welcome" element={<WelcomeBuilder />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
