

// src/pages/Admin/AdminLayout.tsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  function logout() {
    // Clear auth token and any user context you use
    localStorage.removeItem("token");
    // If you store other auth info, clear it here as well
    // e.g., localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4 text-xl font-bold">Admin Panel</div>
        <nav className="px-2 space-y-1">
          <Section title="Dashboard" links={[{ to: "/admin", label: "Overview" }]} />
          <Section
            title="Manage Members"
            links={[
              { to: "/admin/members/all", label: "All Members" },
              { to: "/admin/members/find", label: "Find Member" },
            ]}
          />
          <Section title="User Tree" links={[{ to: "/admin/tree", label: "View Tree" }]} />
          <Section title="Earnings" links={[{ to: "/admin/earnings", label: "Summary" }]} />
          <Section
            title="Products & Services"
            links={[
              { to: "/admin/products/add", label: "Add Product" },
              { to: "/admin/products/manage", label: "Manage Products" },
              { to: "/admin/orders", label: "All Orders" },
            ]}
          />
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-gray-50">
        {/* Header matches sidebar color */}
        <header className="h-14 border-b bg-gray-900 px-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">Admin</h1>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M16 13v-2H7V8l-5 4 5 4v-3h9ZM20 3h-8a2 2 0 0 0-2 2v4h2V5h8v14h-8v-4h-2v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
            </svg>
            Logout
          </button>
        </header>

        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function Section({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div className="pb-3">
      <div className="px-2 py-2 text-xs uppercase tracking-wider text-gray-400">{title}</div>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              end
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm ${
                  isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800/70"
                }`
              }
            >
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
