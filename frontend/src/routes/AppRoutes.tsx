// // src/routes/AppRoutes.tsx
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import ProtectedRoute from "../components/ProtectedRoute";

// // Layouts
// import MainLayout from "../layouts/MainLayout";
// import UserLayout from "../layouts/UserLayout";

// // Public Pages
// import Login from "../pages/Auth/Login";
// import Signup from "../pages/Auth/Signup";
// import VerifyOtp from "../pages/Auth/VerifyOtp";
// import ForgotPassword from "../pages/Auth/ForgotPassword";

// // User Pages
// import Catalog from "../pages/Landing/Catalog";
// import Dashboard from "../pages/User/Dashboard";
// import ReviewSubmit from "../pages/BundleMaker/ReviewSubmit";
// import AdminPanel from "../pages/Admin/AdminPanel";
// import AdminUsers from "../pages/Admin/AdminUsers";
// import ProductCRUD from "../pages/Admin/ProductCRUD";
// import BundleTable from "../pages/Admin/BundleTable";

// export default function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* 🟢 PUBLIC ROUTES */}
//         <Route element={<MainLayout />}>
//           <Route path="/" element={<Login />} />
//           <Route path="/register" element={<Signup />} />
//           <Route path="/verify-otp" element={<VerifyOtp />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//         </Route>

//         {/* 🔒 PROTECTED USER ROUTES */}
//         <Route
//           element={
//             <ProtectedRoute role="user">
//               <UserLayout  />
//             </ProtectedRoute>
//           }
//         >
//           <Route path="/catalog" element={<Catalog />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/bundle/review" element={<ReviewSubmit />} />
//         </Route>

        
//         {/* 🔒 PROTECTED ADMIN ROUTES */}
//         <Route
//           element={
//             <ProtectedRoute role="admin">
//               <AdminLayout /> {/* Or use AdminPanel here if no layout */}
//             </ProtectedRoute>
//           }
//         >
//           <Route path="/admin" element={<AdminPanel/>} />
//           <Route path="/admin/users" element={<AdminUsers/>}>
//           <Route path="/admin/products" element={<ProductCRUD />} />
//           <Route path="/admin/bundles" element={<BundleTable />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Layouts
import MainLayout from "../layouts/MainLayout";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout"; // optional, if you want sidebar/topbar

// Public Pages
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import ForgotPassword from "../pages/Auth/ForgotPassword";

// User Pages
import Catalog from "../pages/Landing/Catalog";
import Dashboard from "../pages/User/Dashboard";
import ReviewSubmit from "../pages/BundleMaker/ReviewSubmit";

// Admin Pages
import SuperAdminPanel from "../pages/SuperAdmin/SuperAdminPanel";
import SuperAdminUsers from "../pages/SuperAdmin/SuperAdminUsers";
import ProductCRUD from "../pages/SuperAdmin/ProductCRUD";
import BundleTable from "../pages/SuperAdmin/BundleTable";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🟢 PUBLIC ROUTES */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* 🔒 PROTECTED USER ROUTES */}
        <Route
          element={
            <ProtectedRoute role="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bundle/review" element={<ReviewSubmit />} />
        </Route>
        
        {/* 🔒 PROTECTED ADMIN ROUTES */}
        <Route
          element={
            <ProtectedRoute role="admin">
              <AdminLayout /> {/* Or use AdminPanel here if no layout */}
            </ProtectedRoute>
          }
        >
          <Route path="/Superadmin" element={<SuperAdminPanel />} />
          <Route path="/Superadmin/users" element={<SuperAdminUsers onSelectUser={() => {}}/>
  } />
          <Route path="/Superadmin/products" element={<ProductCRUD />} />
          <Route path="/Superadmin/bundles" element={<BundleTable />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
