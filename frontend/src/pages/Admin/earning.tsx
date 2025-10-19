import { useEffect, useState } from "react";
import api from "../../utils/api";

interface UserSummary {
  name: string;
  refCode: string;
  email: string;
  phone: string;
  active: boolean;
  totalOrders: number;
  totalEarnings: number;
}

interface UserDetails {
  user: {
    name: string;
    refCode: string;
    email: string;
    phone: string;
    active: boolean;
  };
  stats: {
    totalOrders: number;
    totalEarnings: number;
  };
  orders: {
    _id: string;
    totalAmount: number;
    createdAt: string;
  }[];
  earnings: {
    _id: string;
    type: "pv" | "direct" | "matching";
    amount: number;
    createdAt: string;
  }[];
}

export default function AdminUsersEarningsList() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [selected, setSelected] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "details">("list");
  const [error, setError] = useState<string | null>(null);

  // Load summary list (main admin table)
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/admin/earnings/users-summary");
        if (res.data.success) setUsers(res.data.data as UserSummary[]);
      } catch (err) {
        console.error("Error fetching users summary:", err);
        setError("Failed to load user summary.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch user details by refCode
  const handleRowClick = async (refCode: string) => {
    setLoading(true);
    setError(null);
    setSelected(null);
    try {
      const res = await api.get(`/api/admin/earnings/user/${refCode}/details`);
      if (res.data.success && res.data.user) {
        setSelected(res.data as UserDetails);
      } else {
        setSelected({
          user: {
            name: "",
            refCode,
            email: "",
            phone: "",
            active: true,
          },
          stats: { totalOrders: 0, totalEarnings: 0 },
          orders: [],
          earnings: [],
        });
      }
      setView("details");
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("No details found for this user.");
      setView("details");
    } finally {
      setLoading(false);
    }
  };

  // Go back to list and reset state
  const handleBack = () => {
    setView("list");
    setSelected(null);
    setError(null);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ==========================
  // 🟢 LIST VIEW
  // ==========================
  if (view === "list") {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          👥 User Earnings Summary
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Ref Code</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Phone</th>
                  <th className="px-3 py-2 text-left">Active</th>
                  <th className="px-3 py-2 text-left">Orders</th>
                  <th className="px-3 py-2 text-left">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.refCode}
                    onClick={() => handleRowClick(u.refCode)}
                    className="border-t hover:bg-green-50 cursor-pointer transition"
                  >
                    <td className="px-3 py-2">{u.name}</td>
                    <td className="px-3 py-2 font-mono">{u.refCode}</td>
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2">{u.phone}</td>
                    <td className="px-3 py-2">
                      {u.active ? (
                        <span className="text-green-600 font-semibold">Active</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Inactive</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{u.totalOrders}</td>
                    <td className="px-3 py-2 text-green-700 font-semibold">
                      ₹{u.totalEarnings.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // ==========================
  // 🟣 DETAILS VIEW
  // ==========================
  if (view === "details") {
    if (loading)
      return (
        <div className="p-4 text-center text-gray-600">
          Loading user details...
        </div>
      );

    if (error)
      return (
        <div className="p-4 text-center text-red-600">
          {error}
          <div>
            <button
              onClick={handleBack}
              className="mt-3 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              ← Back
            </button>
          </div>
        </div>
      );

    if (!selected)
      return (
        <div className="p-4 text-center text-gray-600">
          No details available.
          <div>
            <button
              onClick={handleBack}
              className="mt-3 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              ← Back
            </button>
          </div>
        </div>
      );

    const { user, stats, orders, earnings } = selected;

    return (
      <div className="p-4">
        <button
          onClick={handleBack}
          className="text-sm mb-4 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          ← Back
        </button>

        {/* User Header */}
        {user.name ? (
          <>
            <h1 className="text-2xl font-bold mb-2">
              {user.name}{" "}
              <span className="text-gray-500 font-normal">({user.refCode})</span>
            </h1>
            <p className="text-gray-700 mb-3">
              📧 {user.email || "-"} | 📱 {user.phone || "-"} |{" "}
              {user.active ? (
                <span className="text-green-600 font-semibold">Active</span>
              ) : (
                <span className="text-red-600 font-semibold">Inactive</span>
              )}
            </p>
          </>
        ) : (
          <h1 className="text-xl font-semibold text-gray-600 mb-4">
            No data available for {user.refCode}
          </h1>
        )}

        {/* Stats */}
        <div className="bg-white border rounded-lg p-4 mb-4 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="font-bold text-lg">{stats.totalOrders}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Earnings</p>
              <p className="font-bold text-lg text-green-700">
                ₹{stats.totalEarnings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* If no data */}
        {orders.length === 0 && earnings.length === 0 ? (
          <div className="text-center text-gray-500 py-10 border rounded-lg bg-white">
            No details available for this user.
          </div>
        ) : (
          <>
            {/* Orders */}
            <h3 className="text-lg font-semibold mb-2">🧾 Orders</h3>
            {orders.length === 0 ? (
              <p className="text-gray-500 mb-4">No orders yet.</p>
            ) : (
              <div className="bg-white rounded-lg border shadow-sm overflow-y-auto max-h-48 mb-4">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-3 py-2 text-left">Order ID</th>
                      <th className="px-3 py-2 text-left">Amount</th>
                      <th className="px-3 py-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id} className="border-t">
                        <td className="px-3 py-2">{o._id}</td>
                        <td className="px-3 py-2">₹{o.totalAmount}</td>
                        <td className="px-3 py-2">
                          {new Date(o.createdAt).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Earnings */}
            <h3 className="text-lg font-semibold mb-2">💰 Earnings</h3>
            {earnings.length === 0 ? (
              <p className="text-gray-500">No earnings yet.</p>
            ) : (
              <div className="bg-white rounded-lg border shadow-sm overflow-y-auto max-h-48">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-3 py-2 text-left">Type</th>
                      <th className="px-3 py-2 text-left">Amount</th>
                      <th className="px-3 py-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earnings.map((e) => (
                      <tr key={e._id} className="border-t">
                        <td className="px-3 py-2 capitalize">{e.type}</td>
                        <td className="px-3 py-2 text-green-700">₹{e.amount}</td>
                        <td className="px-3 py-2">
                          {new Date(e.createdAt).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return null;
}
