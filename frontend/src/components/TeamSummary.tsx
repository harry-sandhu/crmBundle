import { useEffect, useState } from "react";
import axios from "../utils/api";

interface TreeNode {
  name: string;
  email: string;
  phone?: string | null;
  refCode: string;
  position?: "left" | "right" | null;
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

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await axios.get<ApiResponse>("/api/tree/GROLIFE-ROOT-000000?mode=bulk");
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
    fetchTree();
  }, []);

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
  if (!tableData.length)
    return <div className="text-center text-gray-500 mt-10">No data found.</div>;

  // ✅ Include position in columns
  const defaultColumns = ["name", "email", "phone", "refCode", "position"];
  const allKeys = Object.keys(tableData[0] || {});
  const columns = allKeys.filter((key) => defaultColumns.includes(key));

  return (
    <div className="bg-white border rounded-xl p-5 shadow-md h-[80vh] flex flex-col">
      <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
        🌿 Team Summary
      </h2>

      {/* Scrollable table wrapper */}
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
              <tr
                key={item.refCode || idx}
                className="border-b hover:bg-green-50 transition"
              >
                <td className="px-3 py-2">{idx + 1}</td>
                {columns.map((col) => (
                  <td
                    key={col}
                    className={`px-3 py-2 ${
                      col === "position"
                        ? item.position === "left"
                          ? "text-blue-600 font-semibold"
                          : item.position === "right"
                          ? "text-rose-600 font-semibold"
                          : "text-gray-400 italic"
                        : ""
                    }`}
                  >
                    {String(item[col] ?? "N/A")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
