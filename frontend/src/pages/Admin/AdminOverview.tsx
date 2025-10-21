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
  type: "pv" | "direct" | "matching" | "sponsorMatching"; // ✅ added sponsorMatching
  amount: number;
  createdAt: string;
}

interface SummaryData {
  users: { total: number; active: number; inactive: number };
  orders: { total: number; totalSales: number };
  earnings: {
    pv: number;
    direct: number;
    matching: number;
    sponsorMatching: number; // ✅ new field
    total: number;
  };
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
        <Card
          title="Total Sales"
          value={`₹${summary.orders.totalSales.toLocaleString()}`}
        />
        <Card
          title="PV Earnings"
          value={`₹${summary.earnings.pv.toLocaleString()}`}
        />
        <Card
          title="Direct Income"
          value={`₹${summary.earnings.direct.toLocaleString()}`}
        />
        <Card
          title="Matching Income"
          value={`₹${summary.earnings.matching.toLocaleString()}`}
        />
        <Card
          title="Sponsor Matching Income"
          value={`₹${summary.earnings.sponsorMatching.toLocaleString()}`}
        /> {/* ✅ NEW */}
        <Card
          title="Total Earnings"
          value={`₹${summary.earnings.total.toLocaleString()}`}
        />
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
                <td className="px-3 py-2 capitalize">
                  <TypeBadge type={r.type} /> {/* ✅ Styled type */}
                </td>
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

// -------------------- Reusable Components --------------------
function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white border rounded-lg shadow p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-semibold text-green-700 mt-1">{value}</p>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    pv: "bg-blue-100 text-blue-700",
    direct: "bg-yellow-100 text-yellow-700",
    matching: "bg-purple-100 text-purple-700",
    sponsorMatching: "bg-pink-100 text-pink-700", // ✅ new color
  };

  const labelMap: Record<string, string> = {
    pv: "PV",
    direct: "Direct",
    matching: "Matching",
    sponsorMatching: "Sponsor Matching",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        styles[type] || "bg-gray-100 text-gray-700"
      }`}
    >
      {labelMap[type] || type}
    </span>
  );
}
