import { Routes, Route, Navigate } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Submit from "./pages/Submit";
import Track from "./pages/Track";
import Support from "./pages/Support";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <MotionConfig reducedMotion="user">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/track" element={<Track />} />
            <Route path="/support" element={<Support />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<Navigate to="/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </MotionConfig>
    </AuthProvider>
  );
}

export default App;
