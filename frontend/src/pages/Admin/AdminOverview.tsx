// frontend/src/pages/Admin/AdminOverview.tsx
import { useEffect, useState } from "react";
import api from "../../utils/api";

// -------------------- Types --------------------
interface UserRef {
  name: string;
  email: string;
  refCode: string;
}

interface EarningRecord {
  userId?: UserRef;
  type: "pv" | "direct" | "matching";
  amount: number;
  createdAt: string;
}

interface SummaryData {
  users: { total: number; active: number; inactive: number };
  orders: { total: number; totalSales: number };
  earnings: { pv: number; direct: number; matching: number; total: number };
  recentEarnings: EarningRecord[];
}

// -------------------- Component --------------------
export default function AdminOverview() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<{ data: SummaryData }>("/api/admin/summary");
        setSummary(res.data.data);
      } catch (err: unknown) {
        console.error("Error loading summary:", err);
        setError("Failed to fetch summary data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return <div className="text-center mt-10 text-green-600">Loading summary...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!summary)
    return <div className="text-center mt-10 text-gray-500">No data found.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">📊 Admin Overview</h1>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        <Card title="Total Users" value={summary.users.total} />
        <Card title="Active Users" value={summary.users.active} />
        <Card title="Inactive Users" value={summary.users.inactive} />
        <Card title="Total Orders" value={summary.orders.total} />
        <Card title="Total Sales" value={`₹${summary.orders.totalSales.toLocaleString()}`} />
        <Card title="PV Earnings" value={`₹${summary.earnings.pv.toLocaleString()}`} />
        <Card title="Direct Income" value={`₹${summary.earnings.direct.toLocaleString()}`} />
        <Card title="Matching Income" value={`₹${summary.earnings.matching.toLocaleString()}`} />
        <Card title="Total Earnings" value={`₹${summary.earnings.total.toLocaleString()}`} />
      </div>

      {/* Recent Earnings */}
      <div className="bg-white border rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-3">🕒 Recent Earnings</h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-3 py-2">User</th>
              <th className="text-left px-3 py-2">Type</th>
              <th className="text-left px-3 py-2">Amount</th>
              <th className="text-left px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {summary.recentEarnings.map((r, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">
                  {r.userId?.name || "Unknown"} ({r.userId?.refCode})
                </td>
                <td className="px-3 py-2 capitalize">{r.type}</td>
                <td className="px-3 py-2">₹{r.amount.toLocaleString()}</td>
                <td className="px-3 py-2">
                  {new Date(r.createdAt).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white border rounded-lg shadow p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-semibold text-green-700 mt-1">{value}</p>
    </div>
  );
}
