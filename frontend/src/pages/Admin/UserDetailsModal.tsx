import { useEffect, useState } from "react";
import api from "../../utils/api";

interface UserDetailsModalProps {
  refCode: string;
  onClose: () => void;
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

export default function UserDetailsModal({ refCode, onClose }: UserDetailsModalProps) {
  const [details, setDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/admin/earnings/user/${refCode}/details`);
        if (res.data.success) setDetails(res.data as UserDetails);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    })();
  }, [refCode]);

  if (!details)
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center text-white">
        Loading...
      </div>
    );

  const { user, stats, orders, earnings } = details;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-2">
          {user.name} ({user.refCode})
        </h2>
        <p className="text-gray-600 mb-3">
          {user.email} | {user.phone || "-"} |{" "}
          {user.active ? (
            <span className="text-green-600">Active</span>
          ) : (
            <span className="text-red-600">Inactive</span>
          )}
        </p>

        <div className="mb-4 font-medium">
          Total Orders: <b>{stats.totalOrders}</b> | Total Earnings:{" "}
          <b>₹{stats.totalEarnings.toLocaleString()}</b>
        </div>

        <h3 className="text-lg font-semibold mb-2">🧾 Orders</h3>
        <div className="max-h-40 overflow-y-auto text-sm border rounded mb-3">
          {orders.map((o) => (
            <div key={o._id} className="border-b px-2 py-1">
              <b>₹{o.totalAmount}</b> — {new Date(o.createdAt).toLocaleString()}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-2">💰 Earnings</h3>
        <div className="max-h-40 overflow-y-auto text-sm border rounded">
          {earnings.map((e) => (
            <div key={e._id} className="border-b px-2 py-1">
              <b>{e.type.toUpperCase()}</b> — ₹{e.amount} on{" "}
              {new Date(e.createdAt).toLocaleString()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
