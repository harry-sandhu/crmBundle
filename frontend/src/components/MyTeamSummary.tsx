import React, { useEffect, useState } from "react";
import axios from "../utils/api";
import AddMemberPopup from "../components/AddMemberPopup";

interface TreeNode {
  name: string;
  email: string;
  phone?: string | null;
  refCode: string;
  children: TreeNode[];
  [key: string]: unknown;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: TreeNode;
  totalUsers?: number;
}

export default function TeamSummary() {
  const [tableData, setTableData] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const localUser = localStorage.getItem("userInfo");
  const refCode = localUser ? JSON.parse(localUser).refCode : null;

  const fetchTree = async () => {
    if (!refCode) {
      setError("No referral code found in local storage.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get<ApiResponse>(`/api/tree/${refCode}`);
      if (res.data.success && res.data.data) {
        const flat = flattenTree(res.data.data);
        setTableData(flat);
      } else {
        setError(res.data.message || "Failed to load data");
      }
    } catch (err) {
      console.error("❌ Error fetching team summary:", err);
      setError("Failed to fetch team summary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, [refCode]);

  const flattenTree = (node: TreeNode): TreeNode[] => {
    let result = [node];
    for (const child of node.children || []) {
      result = result.concat(flattenTree(child));
    }
    return result;
  };

  if (loading)
    return <div className="text-center text-green-700 mt-10">Loading team summary...</div>;

  if (error)
    return <div className="text-center text-red-600 mt-10">⚠️ {error}</div>;

  const defaultColumns = ["name", "email", "phone", "refCode"];
  const allKeys = Object.keys(tableData[0] || {});
  const columns = allKeys.filter((key) => defaultColumns.includes(key));

  return (
    <div className="bg-white border rounded-xl p-5 shadow-md h-[80vh] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-700">🌿 My Team Summary</h2>

        <button
          onClick={() => setShowPopup(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          ➕ Add Member
        </button>
      </div>

      <div className="flex-1 overflow-auto border border-green-200 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-green-600 text-white sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              {columns.map((col) => (
                <th key={col} className="px-3 py-2 text-left capitalize">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, idx) => (
              <tr key={item.refCode || idx} className="border-b hover:bg-green-50 transition">
                <td className="px-3 py-2">{idx + 1}</td>
                {columns.map((col) => (
                  <td key={col} className="px-3 py-2">
                    {String(item[col] ?? "N/A")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Add Member Popup */}
      {showPopup && refCode && (
        <AddMemberPopup
          refCode={refCode}
          onClose={() => setShowPopup(false)}
          onAdded={fetchTree}
        />
      )}
    </div>
  );
}
