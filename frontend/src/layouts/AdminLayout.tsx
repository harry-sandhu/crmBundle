import { Link, Outlet, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/Superadmin", label: "Dashboard" },
  { to: "/Superadmin/users", label: "Users" },
  { to: "/Superadmin/products", label: "Products" },
  { to: "/Superadmin/bundles", label: "Bundles" }
];

export default function AdminLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg px-4 py-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`py-2 px-3 rounded transition-colors ${
                pathname === link.to
                  ? "bg-blue-600 text-white"
                  : "text-gray-800 hover:bg-blue-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
