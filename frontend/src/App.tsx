import { HashRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Beds from "./pages/Beds";
import Alerts from "./pages/Alerts";
import SystemStatus from "./pages/SystemStatus";
import BedDetail from "./pages/BedDetail";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./lib/auth";
import { ThemeProvider } from "./components/theme-provider";

function ProtectedRoute() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="aegis-theme">
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="beds" element={<Beds />} />
                <Route path="beds/:id" element={<BedDetail />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="system" element={<SystemStatus />} />
              </Route>
            </Route>
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
