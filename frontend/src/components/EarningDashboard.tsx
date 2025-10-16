// src/pages/EarningsDashboard.tsx
import { useEffect, useState } from "react";
import api from "../utils/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- Define Types ---
interface TrendPoint {
  date: string;
  value: number;
}

interface EarningsTrends {
  pvTrend: TrendPoint[];
  directTrend: TrendPoint[];
  matchingTrend: TrendPoint[];
}

interface EarningsTotals {
  pvCommission: number;
  directIncome: number;
  matchingIncome: number;
}

interface DashboardData {
  totals: EarningsTotals;
  trends: EarningsTrends;
}

// --- Component ---
export default function EarningsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const localUser = localStorage.getItem("userInfo");
  const refCode = localUser ? JSON.parse(localUser).refCode : null;

  useEffect(() => {
    if (!refCode) {
      console.warn("⚠️ No refCode found in localStorage");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await api.get<{ data: DashboardData }>(
          `/api/earnings/dashboard/${refCode}`
        );
        setData(res.data.data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [refCode]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!data)
    return (
      <div className="text-center text-red-600 py-10">
        No data found or missing refCode.
      </div>
    );

  const { totals, trends } = data;

  const charts = [
    { title: "PV Commission", color: "#16a34a", data: trends.pvTrend },
    { title: "Direct Income", color: "#2563eb", data: trends.directTrend },
    { title: "Matching Income", color: "#9333ea", data: trends.matchingTrend },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Earnings Dashboard</h2>

      {/* Summary cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <SummaryCard
          title="PV Commission"
          color="green"
          amount={totals.pvCommission}
        />
        <SummaryCard
          title="Direct Income"
          color="blue"
          amount={totals.directIncome}
        />
        <SummaryCard
          title="Matching Income"
          color="purple"
          amount={totals.matchingIncome}
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-6">
        {charts.map((c) => (
          <div key={c.title} className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-2">{c.title}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={c.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={c.color}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Subcomponent for Summary Cards ---
function SummaryCard({
  title,
  amount,
  color,
}: {
  title: string;
  amount: number;
  color: string;
}) {
  return (
    <div
      className={`p-4 bg-${color}-50 rounded-lg text-center border border-${color}-200`}
    >
      <p className={`font-semibold text-${color}-800`}>{title}</p>
      <p className={`text-2xl font-bold text-${color}-700`}>
        ₹{amount.toLocaleString()}
      </p>
    </div>
  );
}
