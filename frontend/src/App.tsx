import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Beds from "./pages/Beds";
import Alerts from "./pages/Alerts";
import SystemStatus from "./pages/SystemStatus";
import BedDetail from "./pages/BedDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="beds" element={<Beds />} />
          <Route path="beds/:id" element={<BedDetail />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="system" element={<SystemStatus />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
