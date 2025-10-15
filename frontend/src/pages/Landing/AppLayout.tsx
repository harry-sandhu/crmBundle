// src/layouts/AppLayout.tsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

function MenuLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center justify-between px-3 py-2 rounded-md transition ${
          isActive
            ? "bg-indigo-100 text-indigo-800"
            : "text-slate-200/90 hover:bg-slate-800/40 hover:text-white"
        }`
      }
    >
      <span>{label}</span>
    </NavLink>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block w-0 h-0 border-t-[6px] border-b-[6px] border-l-[8px] border-t-transparent border-b-transparent border-l-current transition-transform duration-200 ${
        open ? "rotate-90" : "rotate-0"
      }`}
      style={{ lineHeight: 0 }}
    />
  );
}

export default function AppLayout() {
  const navigate = useNavigate();
  const [openShop, setOpenShop] = useState(false);
  const [openTeam, setOpenTeam] = useState(false);
  const [openCommission, setOpenCommission] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header: slate base with indigo accent */}
      <div className="h-14 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-md backdrop-blur-sm bg-opacity-95 border-b border-slate-800/60 flex items-center px-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center font-bold ring-1 ring-white/20">
            G
          </div>
          <div className="font-semibold tracking-wide">GrowLifeSuprimo</div>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition ring-1 ring-white/20"
          >
            Dashboard
          </button>
          

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              localStorage.removeItem("userInfo");
              navigate("/login");
            }}
            className="px-3 py-1 rounded bg-rose-500/90 hover:bg-rose-500 text-white transition"
            title="Logout"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex">
        {/* Sidebar: slate glass with indigo active */}
        <aside className="w-64 bg-slate-900/95 text-slate-50 border-r border-slate-800/70 shadow-xl min-h-[calc(100vh-56px)] p-3">
          <nav className="space-y-2 text-sm">
            <div className="text-slate-300/80 uppercase text-[11px] tracking-wider px-3 my-1">
              Main
            </div>
            <MenuLink to="/dashboard" label="Dashboard" />

            <div className="text-slate-300/80 uppercase text-[11px] tracking-wider px-3 mt-4 mb-1">
              Quick
            </div>
            <MenuLink to="/welcome-letter" label="Welcome Letter" />
            <MenuLink to="/change-password" label="Change Password" />
            <MenuLink to="/profile" label="Profile" />

            {/* Shop */}
            <div className="mt-3">
              <button
                onClick={() => setOpenShop((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-slate-100 hover:bg-slate-800/50 transition"
              >
                <span>Shop</span>
                <Chevron open={openShop} />
              </button>
              {openShop && (
                <div className="ml-3 mt-1 space-y-1">
                  <MenuLink to="/shop/catalog" label="Catalog" />
                  <MenuLink to="/shop/orders" label="Orders" />
                  {/* <MenuLink to="/shop/my-cart" label="My Cart" /> */}
                </div>
              )}
            </div>

            {/* My Team */}
            <div className="mt-2">
              <button
                onClick={() => setOpenTeam((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-slate-100 hover:bg-slate-800/50 transition"
              >
                <span>My Team</span>
                <Chevron open={openTeam} />
              </button>
              {openTeam && (
                <div className="ml-3 mt-1 space-y-1">
                  <MenuLink to="/team/all" label="All Team" />
                  <MenuLink to="/team/view-tree" label="View Tree" />
                  <MenuLink to="/team/summary" label="Team Summary" />
                  <MenuLink to="/team/referral" label="Referral Team" />
                  <MenuLink to="/team/generation" label="Generation List" />
                </div>
              )}
            </div>

            {/* My Commission */}
            <div className="mt-2">
              <button
                onClick={() => setOpenCommission((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-slate-100 hover:bg-slate-800/50 transition"
              >
                <span>My Commission</span>
                <Chevron open={openCommission} />
              </button>
              {openCommission && (
                <div className="ml-3 mt-1 space-y-1">
                  <MenuLink to="/commission/dashboard" label="Earning Dashboard" />
                  <MenuLink to="/commission/earnings" label="My Earnings" />
                </div>
              )}
            </div>

            {/* Sidebar tip with cyan accent ring */}
            <div className="mt-6 mx-3 p-3 rounded-lg bg-slate-800/60 text-slate-100 text-xs ring-1 ring-cyan-400/40">
              Tip: Use the Catalog to add products and track PV in real time.
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-5 bg-slate-50">
          <div className="bg-white/95 backdrop-blur rounded-xl border border-slate-200 shadow-sm p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
