

// // src/routes/AppRoutes.tsx
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "../components/ProtectedRoute";
// import AdminRoute from "../components/AdminRoute";
// import MainLayout from "../layouts/MainLayout";
// import AppLayout from "../pages/Landing/AppLayout";
// import Login from "../pages/Auth/Login";
// import Signup from "../pages/Auth/Signup";
// import VerifyOtp from "../pages/Auth/VerifyOtp";
// import ForgotPassword from "../pages/Auth/ForgotPassword";
// import ChangePassword from "../pages/Auth/ChangePassword";
// import DashboardHome from "../pages/Landing/DashboardHome";
// import Catalog from "../pages/Landing/Catalog";
// import Orders from "../pages/Landing/MyOrders";
// import ReviewBundle from "../pages/BundleMaker/ReviewSubmit";
// import {
//   TeamAll, TeamTree, TeamSummary, TeamReferral, TeamGeneration,
//   CommissionDashboard, CommissionEarnings
// } from "../pages/Landing/stubs";
// import Profile from "../pages/User/Profile";
// import AdminPage from "../pages/Admin/HomePage";

// // Define a minimal auth user shape used by routes
// // type AuthUser = {
// //   email: string | null;
// //   authenticated: boolean;
// // } | null;

// export default function AppRoutes() {
//   // TODO: replace with your actual auth selector
//   // const user: AuthUser = null;

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public */}
//         <Route element={<MainLayout />}>
//           <Route path="/" element={<Navigate to="/login" replace />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Signup />} />
//           <Route path="/verify-otp" element={<VerifyOtp />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//         </Route>

//         {/* Protected USER area */}
//         <Route element={<ProtectedRoute />}>
//           <Route element={<AppLayout />}>
//             <Route path="/dashboard" element={<DashboardHome />} />
//             <Route path="/team/all" element={<TeamAll />} />
//             <Route path="/team/view-tree" element={<TeamTree />} />
//             <Route path="/team/summary" element={<TeamSummary />} />
//             <Route path="/team/referral" element={<TeamReferral />} />
//             <Route path="/team/generation" element={<TeamGeneration />} />
//             <Route path="/commission/dashboard" element={<CommissionDashboard />} />
//             <Route path="/commission/earnings" element={<CommissionEarnings />} />
//             <Route path="/shop/catalog" element={<Catalog />} />
//             <Route path="/shop/orders" element={<Orders />} />
//             <Route path="/bundle/review" element={<ReviewBundle />} />
//             <Route path="/profile" element={<Profile />} />
//           </Route>
//           <Route path="/change-password" element={<ChangePassword />} />
//         </Route>

//         {/* Protected ADMIN area */}
//         <Route
//           path="/admin"
//           element={
//             // <AdminRoute user={user} adminEmail="growlifesupremo2025@gmail.com">
//             <AdminRoute>
//               <AdminPage />
//             </AdminRoute>
//           }
//         />

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/dashboard" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


// src/routes/AppRoutes.tsx
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// // Guards
// import ProtectedRoute from "../components/ProtectedRoute";
// import AdminRoute from "../components/AdminRoute";

// // Public layouts/pages
// import MainLayout from "../layouts/MainLayout";
// import AppLayout from "../pages/Landing/AppLayout";
// import Login from "../pages/Auth/Login";
// import Signup from "../pages/Auth/Signup";
// import VerifyOtp from "../pages/Auth/VerifyOtp";
// import ForgotPassword from "../pages/Auth/ForgotPassword";
// import ChangePassword from "../pages/Auth/ChangePassword";

// // User area
// import DashboardHome from "../pages/Landing/DashboardHome";
// import Catalog from "../pages/Landing/Catalog";
// import Orders from "../pages/Landing/MyOrders";
// import ReviewBundle from "../pages/BundleMaker/ReviewSubmit";
// import {
//   TeamAll,
//   TeamTree,
//   TeamSummary,
//   TeamReferral,
//   TeamGeneration,
//   CommissionDashboard,
//   CommissionEarnings,
// } from "../pages/Landing/stubs";


// // Admin Area (still protected but no role check here)
// // import SuperAdminPanel from "../pages/SuperAdmin/SuperAdminPanel";
// // import SuperAdminUsers from "../pages/SuperAdmin/SuperAdminUsers";
// // import ProductCRUD from "../pages/SuperAdmin/ProductCRUD";
// // import BundleTable from "../pages/SuperAdmin/BundleTable";
// import Profile from "../pages/User/Profile"
// import Home from "../pages/Landing/Home";
// import AboutUs from "../pages/Landing/About";
// import Vision from "../pages/Landing/Vision";
// import Contact from "../pages/Landing/Contact";
// // Admin layout and pages
// import AdminLayout from "../pages/Admin/AdminLayout";
// // import AdminDashboard from "../pages/Admin/Dashboard";
// import MembersAll from "../pages/Admin/Members/MembersAll";
// import MemberFind from "../pages/Admin/Members/MemberFind";
// import MemberAdd from "../pages/Admin/Members/MemberAdd";
// // import UserTree from "../pages/Admin/UserTree";
// // import Earnings from "../pages/Admin/Earnings";
// // import ProductAdd from "../pages/Admin/Products/ProductAdd";
// // import ProductManage from "../pages/Admin/Products/ProductManage";
// // import OrdersAll from "../pages/Admin/OrdersAll";

// export default function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public */}
//         <Route element={<MainLayout />}>
//           <Route path="/" element={<Home />} />
//   <Route path="/aboutus" element={<AboutUs />} />
//   <Route path="/vision" element={<Vision />} />
//   <Route path="/contact" element={<Contact />} />
//   <Route path="/login" element={<Login />} />
//   <Route path="/register" element={<Signup />} />
//   <Route path="/verify-otp" element={<VerifyOtp />} />
//   <Route path="/forgot-password" element={<ForgotPassword />} />
//         </Route>

//         {/* Protected USER area */}
//         <Route element={<ProtectedRoute />}>
//           <Route element={<AppLayout />}>
//             <Route path="/dashboard" element={<DashboardHome />} />
//             <Route path="/team/all" element={<TeamAll />} />
//             <Route path="/team/view-tree" element={<TeamTree />} />
//             <Route path="/team/summary" element={<TeamSummary />} />
//             <Route path="/team/referral" element={<TeamReferral />} />
//             <Route path="/team/generation" element={<TeamGeneration />} />
//             <Route path="/commission/dashboard" element={<CommissionDashboard />} />
//             <Route path="/commission/earnings" element={<CommissionEarnings />} />
//             <Route path="/shop/catalog" element={<Catalog />} />
//             <Route path="/shop/orders" element={<Orders />} />
//             <Route path="/bundle/review" element={<ReviewBundle />} />
//             <Route path="/profile" element={<Profile />} />
//           </Route>
//           <Route path="/change-password" element={<ChangePassword />} />
//         </Route>

//         {/* Protected ADMIN area with nested routes */}
//         <Route
//           path="/admin"
//           element={
//             <AdminRoute>
//               <AdminLayout />
//             </AdminRoute>
//           }
//         >
//           {/* index -> /admin */}
//           {/* <Route index element={<AdminDashboard />} /> */}

//           {/* Members */}
//           <Route path="members/all" element={<MembersAll />} />
//           <Route path="members/find" element={<MemberFind />} />
//           <Route path="members/add" element={<MemberAdd />} />

//           {/* Tree, Earnings */}
//           {/* <Route path="tree" element={<UserTree />} />
//           <Route path="earnings" element={<Earnings />} />

//           {/* Products & Services and Orders */}
//           {/* <Route path="products/add" element={<ProductAdd />} />
//           <Route path="products/manage" element={<ProductManage />} />
//           <Route path="orders" element={<OrdersAll />} /> */} */
//         </Route>

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/dashboard" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Guards
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AppLayout from "../pages/Landing/AppLayout";
import AdminLayout from "../pages/Admin/AdminLayout";

// Public Pages
import Home from "../pages/Landing/Home";
import AboutUs from "../pages/Landing/About";
import Vision from "../pages/Landing/Vision";
import Contact from "../pages/Landing/Contact";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ChangePassword from "../pages/Auth/ChangePassword";

// User Area
import DashboardHome from "../pages/Landing/DashboardHome";
import Catalog from "../pages/Landing/Catalog";
import Orders from "../pages/Landing/MyOrders";
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
import Profile from "../pages/User/Profile";

// Admin Pages
// import AdminDashboard from "../pages/Admin/";
import MembersAll from "../pages/Admin/Members/MembersAll";
import MemberFind from "../pages/Admin/Members/MemberFind";
import MemberAdd from "../pages/Admin/Members/MemberAdd";
import UserTree from "../pages/Admin/UserTree";
// import Earnings from "../pages/Admin/Earnings";
import ProductAdd from "../pages/Admin/AddProduct";
import ProductManage from "../pages/Admin/ManageProduct";
import OrdersAll from "../pages/Admin/AllOrders";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected USER area */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
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
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>

        {/* Protected ADMIN area with nested routes and persistent sidebar */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* <Route index element={<AdminDashboard />} /> */}
          <Route path="members/all" element={<MembersAll />} />
          <Route path="members/find" element={<MemberFind />} />
          <Route path="members/add" element={<MemberAdd />} />
          <Route path="tree" element={<UserTree />} />
          {/* <Route path="earnings" element={<Earnings />} /> */}
          <Route path="products/add" element={<ProductAdd />} />
          <Route path="products/manage" element={<ProductManage />} />
          <Route path="orders" element={<OrdersAll />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
