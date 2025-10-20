// import { Link, useLocation } from "react-router-dom";

// export default function Header() {
//   const location = useLocation();

//   const navLinks = [
//     { path: "/", label: "Home" },
//     { path: "/aboutus", label: "About Us" },
//     { path: "/vision", label: "Vision" },
//     { path: "/contact", label: "Contact Us" },
//     {path: "/Login", label: "Login"}
//   ];

//   return (
//     <header className="flex justify-between items-center p-4 bg-green-600 text-white shadow-md">
//       {/* Left side — Logo + Title */}
//       <div className="flex items-center gap-3">
//         <img
//           src="/ourlogo.jpeg" // ✅ Use absolute path (public/finallogo.png)
//           alt="Logo"
//           className="h-10 w-10 rounded-full"
//         />
//         <h1 className="text-xl font-bold tracking-wide">GrowLifeSuprimo</h1>
//       </div>

//       {/* Right side — Navbar */}
//       <nav className="flex items-center gap-6">
//         {navLinks.map(({ path, label }) => (
//           <Link
//             key={path}
//             to={path}
//             className={`hover:text-yellow-300 transition ${
//               location.pathname === path ? "underline text-yellow-200" : ""
//             }`}
//           >
//             {label}
//           </Link>
//         ))}
//       </nav>
//     </header>
//   );
// }

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/aboutus", label: "About Us" },
    { path: "/vision", label: "Vision" },
    { path: "/contact", label: "Contact Us" },
    { path: "/login", label: "Login" },
    { path: "/register", label: "Sign Up" },
  ];

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-green-600 text-white shadow-md relative">
        {/* Left side — Hamburger + Logo + Title */}
        <div className="flex items-center gap-3">
          {/* Hamburger Icon */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col justify-between w-8 h-6 cursor-pointer mr-2"
          >
            <span className="block h-1 w-full bg-white rounded"></span>
            <span className="block h-1 w-full bg-white rounded"></span>
            <span className="block h-1 w-full bg-white rounded"></span>
          </button>

          {/* Logo */}
          <img
            src="/ourlogo.jpeg"
            alt="Logo"
            className="h-10 w-10 rounded-full"
          />
          <h1 className="text-xl font-bold tracking-wide">GrowLifeSuprimo</h1>
        </div>

        {/* Right side — Navbar */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`hover:text-yellow-300 transition ${
                location.pathname === path ? "underline text-yellow-200" : ""
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

        

<aside
  className={`fixed top-0 left-0 h-full w-64 text-white z-50 transform transition-transform
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    bg-gradient-to-b from-green-800 via-green-900 to-black shadow-lg`}
>
  <div className="flex justify-between items-center p-4 border-b border-green-700">
    <h2 className="font-bold text-lg">Menu</h2>
    <button
      onClick={() => setSidebarOpen(false)}
      className="text-white text-2xl font-bold"
    >
      &times;
    </button>
  </div>

  <nav className="flex flex-col mt-4 space-y-2 flex-1">
    {navLinks.map(({ path, label }) => (
      <Link
        key={path}
        to={path}
        onClick={() => setSidebarOpen(false)}
        className={`px-4 py-3 rounded-lg transition-all duration-200
          ${location.pathname === path ? "bg-green-700 font-semibold" : "hover:bg-green-600"} 
        `}
      >
        {label}
      </Link>
    ))}
  </nav>
</aside>

    </>
  );
}
