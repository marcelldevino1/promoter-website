import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import OrderForm from "./pages/OrderForm";
import AdminLogin from "./pages/admin/Login";
import AdminRegister from "./pages/admin/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OrdersPage from "./pages/admin/OrdersPage";
import PackagesManager from "./pages/admin/PackagesManager";
import SetNumberPage from "./pages/admin/SetNumberPage";
import BrandSetting from "./pages/admin/BrandSetting";
import TestimonialsManager from "./pages/admin/TestimonialsManager";

// 🛡️ Komponen proteksi route admin
function ProtectedRoute({ children }) {
  const loggedIn = localStorage.getItem("loggedInAdmin");
  return loggedIn ? children : <Navigate to="/admin/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/order" element={<OrderForm />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* 🔐 Admin Routes (Proteksi Login) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/packages"
          element={
            <ProtectedRoute>
              <PackagesManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/setnumber"
          element={
            <ProtectedRoute>
              <SetNumberPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/brandsetting"
          element={
            <ProtectedRoute>
              <BrandSetting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/testimonials"
          element={
            <ProtectedRoute>
              <TestimonialsManager /> {/* ✅ Route baru */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
