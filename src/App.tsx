import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GuildLayout from "./pages/GuildLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ComponentBuilder from "./pages/ComponentBuilder";
import WelcomeBuilder from "./pages/Welcome";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
