// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AppLayout from "../pages/Landing/AppLayout";
// import AdminLayout from "../layouts/AdminLayout";
// import UserLayout from "../layouts/UserLayout";

// Public Pages
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ChangePassword from "../pages/Auth/ChangePassword";

// User Area
import DashboardHome from "../pages/Landing/DashboardHome";
// import WelcomeLetter from "../pages/Landing/WelcomeLetter";
import Catalog from "../pages/Landing/Catalog";
import Orders from "../pages/Landing/MyOrders"
// import Orders from "../pages/Catalog/Orders";
// import MyCart from "../pages/Catalog/MyCart";
import ReviewBundle from "../pages/BundleMaker/ReviewSubmit";
import {
  TeamAll,
  TeamTree,
  TeamSummary,
  TeamReferral,
  TeamGeneration,
  CommissionDashboard,
  CommissionEarnings,
} from "../pages/Landing/stubs";

// Admin Area (still protected but no role check here)
// import SuperAdminPanel from "../pages/SuperAdmin/SuperAdminPanel";
// import SuperAdminUsers from "../pages/SuperAdmin/SuperAdminUsers";
// import ProductCRUD from "../pages/SuperAdmin/ProductCRUD";
// import BundleTable from "../pages/SuperAdmin/BundleTable";
import Profile from "../pages/User/Profile"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected USER area */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            

            {/* <Route path="/welcome-letter" element={<WelcomeLetter />} /> */}
            {/* <Route path="/shop/orders" element={<Orders />} /> */}
            {/* <Route path="/shop/my-cart" element={<MyCart />} /> */}
            <Route path="/team/all" element={<TeamAll />} />
            <Route path="/team/view-tree" element={<TeamTree />} />
            <Route path="/team/summary" element={<TeamSummary />} />
            <Route path="/team/referral" element={<TeamReferral />} />
            <Route path="/team/generation" element={<TeamGeneration />} />
            <Route path="/commission/dashboard" element={<CommissionDashboard />} />
            <Route path="/commission/earnings" element={<CommissionEarnings />} />
            <Route path="/shop/catalog" element={<Catalog />} />
            <Route path="/shop/orders" element={<Orders />} />
            <Route path="/bundle/review" element={<ReviewBundle />} />
            <Route path="/profile" element={<Profile/>} />
          </Route>
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
        
        {/* Protected ADMIN area (no role gating here; add back if needed) */}
        {/* <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/Superadmin" element={<SuperAdminPanel />} />
            <Route path="/Superadmin/users" element={<SuperAdminUsers onSelectUser={() => {}} />}/>
            <Route path="/Superadmin/products" element={<ProductCRUD />} />
            <Route path="/Superadmin/bundles" element={<BundleTable />} />
          </Route>
        </Route> */}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
