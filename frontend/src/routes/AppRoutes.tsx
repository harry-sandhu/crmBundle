import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "../pages/Landing/Catalog";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Signup";
// import Dashboard from "../pages/User/Dashboard";
import ForgotPassword from "../pages/Auth/ForgotPassword";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/catalog" element={<Dashboard />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}