

import { useEffect, useState } from "react";
import api from "../../utils/api";

type OrderListItem = {
  _id: string;
  totalAmount: number;
  status?: string;
  createdAt?: string;
};

type OrderItem = {
  productId: string;
  title?: string;
  qty: number;
  dp?: number;
  mrp?: number;
  lineTotal?: number;
};

type OrderDetail = {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status?: string;
  notes?: string;
  createdAt?: string;
};

type ApiError = {
  response?: { data?: { message?: string } };
  message?: string;
};

function getErrMessage(e: unknown): string {
  const err = e as ApiError;
  return err?.response?.data?.message || err?.message || "Request failed";
}

export default function MyOrders() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [page] = useState(1);
  const [limit] = useState(25);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const resp = await api.get(`/api/orders/my?page=${page}&limit=${limit}`);
        if (!mounted) return;
        setOrders(resp.data?.data ?? []);
      } catch (err: unknown) {
        console.error("Load orders failed:", getErrMessage(err));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [page, limit]);

  const openDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const resp = await api.get(`/api/orders/${id}`);
      const d = resp.data?.data as OrderDetail;
      setSelected(d);
    } catch (err: unknown) {
      alert(getErrMessage(err));
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => setSelected(null);

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-700 mb-4">My Orders</h1>

      <div className="bg-white border rounded-xl p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2">Order ID</th>
                <th className="text-left px-3 py-2">Placed On</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Total (DP)</th>
                <th className="text-left px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-3 py-3" colSpan={5}>Loading...</td></tr>
              ) : orders.length === 0 ? (
                <>
                  <tr><td className="px-3 py-3" colSpan={5}>No orders found.</td></tr>
                  <tr>
                    <td className="px-3 py-3" colSpan={5}>
                      <div className="text-center py-6">
                        <p className="text-slate-500 mb-3">You haven't placed any orders yet.</p>
                        <a href="/shop/catalog" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
                          Go to Catalog
                        </a>
                      </div>
                    </td>
                  </tr>
                </>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="border-t">
                    <td className="px-3 py-2 font-mono text-xs">{o._id}</td>
                    <td className="px-3 py-2">
                      {o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}
                    </td>
                    <td className="px-3 py-2">{o.status || "submitted"}</td>
                    <td className="px-3 py-2">₹{(o.totalAmount ?? 0).toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => openDetail(o._id)}
                        className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-green-800">Order Details</h2>
              <button onClick={closeDetail} className="text-slate-600 hover:text-black">Close</button>
            </div>

            {detailLoading ? (
              <div className="p-4">Loading order…</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <Info label="Order ID" value={selected._id} mono />
                  <Info label="Placed On" value={selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "—"} />
                  <Info label="Status" value={selected.status || "submitted"} />
                  <Info label="Total (DP)" value={`₹${(selected.totalAmount ?? 0).toLocaleString()}`} />
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-3 py-2">Product</th>
                        <th className="text-left px-3 py-2">Qty</th>
                        <th className="text-left px-3 py-2">DP (unit)</th>
                        <th className="text-left px-3 py-2">MRP (unit)</th>
                        <th className="text-left px-3 py-2">Line DP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.items?.length ? (
                        selected.items.map((it) => {
                          const lineDP = (it.dp ?? 0) * it.qty;
                          const title = it.title || `Product ${it.productId}`;
                          return (
                            <tr key={`${selected._id}-${it.productId}`} className="border-t">
                              <td className="px-3 py-2">{title}</td>
                              <td className="px-3 py-2">{it.qty}</td>
                              <td className="px-3 py-2">₹{(it.dp ?? 0).toLocaleString()}</td>
                              <td className="px-3 py-2">₹{(it.mrp ?? 0).toLocaleString()}</td>
                              <td className="px-3 py-2">₹{lineDP.toLocaleString()}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr><td className="px-3 py-3" colSpan={5}>No items.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {selected.notes ? (
                  <div className="mt-4 text-sm text-slate-600">
                    <span className="font-semibold">Notes:</span> {selected.notes}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-slate-800 ${mono ? "font-mono text-xs" : ""}`}>{value}</div>
    </div>
  );
}
