// src/pages/EarningsDetails.tsx
import { useEffect, useState } from "react";
import api from "../utils/api";

// --- Define Types ---
interface EarningRecord {
  _id: string;
  userId: string;
  refCode: string;
  sourceUserId: string;
  orderId: string;
  type: "pv" | "direct" | "matching";
  amount: number;
  level?: number;
  createdAt: string;
  updatedAt: string;
}

interface EarningsDetailsData {
  pv: EarningRecord[];
  direct: EarningRecord[];
  matching: EarningRecord[];
}

export default function EarningsDetails() {
  const [data, setData] = useState<EarningsDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Get refCode from localStorage
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
        const res = await api.get<{ data: EarningsDetailsData }>(
          `/api/earnings/details/${refCode}`
        );
        setData(res.data.data);
      } catch (err) {
        console.error("Details fetch failed:", err);
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

  const renderTable = (
    records: EarningRecord[],
    title: string,
    color: string
  ) => (
    <div className="bg-white p-4 rounded-lg border shadow-sm mb-6">
      <h3 className={`font-semibold text-${color}-700 mb-2`}>{title}</h3>
      {records.length === 0 ? (
        <p className="text-gray-500 text-sm">No records found.</p>
      ) : (
        <table className="min-w-full border border-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 border-b text-left">Date</th>
              <th className="px-3 py-2 border-b text-left">Order ID</th>
              <th className="px-3 py-2 border-b text-right">Amount</th>
              {title === "Matching Income" && (
                <th className="px-3 py-2 border-b text-center">Level</th>
              )}
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} className="border-b">
                <td className="px-3 py-2">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
                <td className="px-3 py-2">{r.orderId}</td>
                <td className="px-3 py-2 text-right">
                  ₹{r.amount.toLocaleString()}
                </td>
                {title === "Matching Income" && (
                  <td className="px-3 py-2 text-center">{r.level ?? "-"}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">
        My Earnings Details
      </h2>
      {renderTable(data.pv, "PV Commission", "green")}
      {renderTable(data.direct, "Direct Income", "blue")}
      {renderTable(data.matching, "Matching Income", "purple")}
    </div>
  );
}
