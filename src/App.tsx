import { Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Submit from "./pages/Submit";
import Track from "./pages/Track";
import Support from "./pages/Support";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/track" element={<Track />} />
          <Route path="/support" element={<Support />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>
      </Routes>
    </MotionConfig>
  );
}

export default App;
