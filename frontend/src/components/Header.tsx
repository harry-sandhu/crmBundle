import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/aboutus", label: "About Us" },
    { path: "/vision", label: "Vision" },
    { path: "/contact", label: "Contact Us" },
    {path: "/Login", label: "Login"}
  ];

  return (
    <header className="flex justify-between items-center p-4 bg-green-600 text-white shadow-md">
      {/* Left side — Logo + Title */}
      <div className="flex items-center gap-3">
        <img
          src="/finallogo.png" // ✅ Use absolute path (public/finallogo.png)
          alt="Logo"
          className="h-10 w-10 rounded-full"
        />
        <h1 className="text-xl font-bold tracking-wide">GrowLifeSuprimo</h1>
      </div>

      {/* Right side — Navbar */}
      <nav className="flex items-center gap-6">
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
  );
}
