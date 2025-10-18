// src/pages/Admin/Orders/AllOrders.tsx
import { useEffect, useMemo, useState } from "react";
import api from "../../utils/api";
import axios, { AxiosError } from "axios";

type OrderItem = {
  productId: string;
  title: string;
  qty: number;
  dp: number;
  mrp: number;
  lineTotal: number;
};

type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  totalPV: number;
  status: string;
  notes?: string;
  createdAt: string;
};

type UserSummary = {
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  orderCount: number;
  totalSpent: number;
  totalPV: number;
  lastOrderAt?: string;
};

type UserSummariesResponse = {
  ok: boolean;
  data: UserSummary[];
  message?: string;
};

type UserOrdersResponse = {
  ok: boolean;
  data: Order[];
  message?: string;
};

type ApiFail = { ok: false; message: string };

export default function AllOrders() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  // top-level list
  const [users, setUsers] = useState<UserSummary[]>([]);

  // user modal
  const [showUser, setShowUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersErr, setOrdersErr] = useState("");

  // nested order drawer
  const [showOrder, setShowOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get<UserSummariesResponse>("/api/admin/orders/users");
        if (cancel) return;
        if (res.data.ok) setUsers(res.data.data);
        else setErr(res.data.message || "Failed to load orders summary");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const ax = error as AxiosError<ApiFail>;
          const status = ax.response?.status ?? "network";
          const message = ax.response?.data?.message ?? ax.message ?? "Request failed";
          setErr(`Failed to load orders summary (${status}): ${message}`);
        } else if (error instanceof Error) {
          setErr(`Failed to load orders summary: ${error.message}`);
        } else {
          setErr("Failed to load orders summary");
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return users;
    const t = q.trim().toLowerCase();
    return users.filter((u) => {
      return (
        u.userId.toLowerCase().includes(t) ||
        (u.name || "").toLowerCase().includes(t) ||
        (u.email || "").toLowerCase().includes(t) ||
        (u.phone || "").toLowerCase().includes(t)
      );
    });
  }, [users, q]);

  async function openUser(u: UserSummary) {
    setSelectedUser(u);
    setShowUser(true);
    setShowOrder(false);
    setSelectedOrder(null);
    setOrdersErr("");
    setOrdersLoading(true);
    try {
      const res = await api.get<UserOrdersResponse>(`/api/admin/orders/user/${u.userId}`);
      if (res.data.ok) setUserOrders(res.data.data);
      else setOrdersErr(res.data.message || "Failed to load user orders");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const ax = error as AxiosError<ApiFail>;
        const status = ax.response?.status ?? "network";
        const message = ax.response?.data?.message ?? ax.message ?? "Request failed";
        setOrdersErr(`Failed to load user orders (${status}): ${message}`);
      } else if (error instanceof Error) {
        setOrdersErr(`Failed to load user orders: ${error.message}`);
      } else {
        setOrdersErr("Failed to load user orders");
      }
    } finally {
      setOrdersLoading(false);
    }
  }

  function closeUser() {
    setShowUser(false);
    setSelectedUser(null);
    setUserOrders([]);
    setShowOrder(false);
    setSelectedOrder(null);
  }

  function openOrder(o: Order) {
    setSelectedOrder(o);
    setShowOrder(true);
  }
  function closeOrder() {
    setShowOrder(false);
    setSelectedOrder(null);
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by user, name, email, phone"
          className="border rounded px-3 py-2 w-full max-w-lg"
        />
      </div>

      {err && <div className="mb-3 text-red-600">{err}</div>}

      <div className="overflow-x-auto bg-white border rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-green-50 text-green-800">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-right">Orders</th>
              <th className="px-4 py-3 text-right">Total Spent</th>
              <th className="px-4 py-3 text-right">Total PV</th>
              <th className="px-4 py-3 text-left">Last Order</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={8}>
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={8}>
                  No orders found
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.userId} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{u.name || u.userId}</div>
                  </td>
                  <td className="px-4 py-3">{u.email || "-"}</td>
                  <td className="px-4 py-3">{u.phone || "-"}</td>
                  <td className="px-4 py-3 text-right">{u.orderCount}</td>
                  <td className="px-4 py-3 text-right">₹{u.totalSpent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{u.totalPV.toLocaleString()}</td>
                  <td className="px-4 py-3">{u.lastOrderAt ? new Date(u.lastOrderAt).toLocaleString() : "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() => openUser(u)}
                        className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        View Orders
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User orders drawer */}
      {showUser && selectedUser && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/40" onClick={closeUser} />
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Orders of {selectedUser.name || selectedUser.userId}
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedUser.email || "-"} • {selectedUser.phone || "-"}
                </p>
              </div>
              <button onClick={closeUser} className="text-gray-500 hover:text-gray-700 text-lg" aria-label="Close">
                ✕
              </button>
            </div>

            {ordersErr && <div className="mb-3 text-red-600">{ordersErr}</div>}
            {ordersLoading ? (
              <div className="text-gray-600">Loading orders…</div>
            ) : userOrders.length === 0 ? (
              <div className="text-gray-600">No orders for this user.</div>
            ) : (
              <div className="space-y-3">
                {userOrders.map((o) => (
                  <div key={o.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(o.createdAt).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Status: {o.status}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-700">₹{o.totalAmount.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">PV: {o.totalPV.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => openOrder(o)}
                        className="px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white"
                      >
                        View Items
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nested order items drawer */}
          {showOrder && selectedOrder && (
            <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white border-l border-gray-200 shadow-2xl p-5 z-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Order Items</h3>
                <button onClick={closeOrder} className="text-gray-500 hover:text-gray-700 text-lg">
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="border rounded p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{it.title}</div>
                        <div className="text-sm text-gray-600">
                          Qty: {it.qty} • DP: ₹{it.dp} • MRP: ₹{it.mrp}
                        </div>
                      </div>
                      <div className="font-semibold text-green-700">₹{(it.lineTotal ?? 0).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
