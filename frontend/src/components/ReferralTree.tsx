// frontend/src/components/ReferralTree.tsx
import { useEffect, useState } from "react";
import axios from "../utils/api";

interface TreeNode {
  name: string;
  email: string;
  phone?: string | null;
  refCode: string;
  children: TreeNode[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: TreeNode;
  totalUsers?: number;
}

export default function ReferralTree() {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Get refCode from localStorage
  const localUser = localStorage.getItem("userInfo");
  const refCode = localUser ? JSON.parse(localUser).refCode : null;

  useEffect(() => {
    if (!refCode) {
      setError("No referral code found in local storage. Please sign up or log in.");
      setLoading(false);
      return;
    }

    const fetchTree = async () => {
      try {
        const res = await axios.get<ApiResponse>(`/api/tree/${refCode}`);
        if (res.data.success) {
          setTree(res.data.data);
        } else {
          setError(res.data.message || "Failed to load tree");
        }
      } catch (err) {
        console.error("Error fetching referral tree:", err);
        setError("Failed to fetch referral tree.");
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, [refCode]);

  if (loading)
    return (
      <div className="text-center text-green-700 mt-10">Loading tree...</div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 mt-10">
        ⚠️ {error}
      </div>
    );

  if (!tree)
    return (
      <div className="text-center text-gray-500 mt-10">
        No tree data found.
      </div>
    );

  return (
    <div className="mt-10 p-6 bg-white rounded-xl shadow-lg border border-green-100">
      <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
        Referral Tree 🌳
      </h2>
      <TreeNodeComponent node={tree} level={0} />
    </div>
  );
}

/**
 * Recursive sub-component for rendering each node
 */
function TreeNodeComponent({ node, level }: { node: TreeNode; level: number }) {
  return (
    <div
      className="border-l border-green-300 pl-4 mb-4"
      style={{ marginLeft: level * 20 }}
    >
      <div className="p-3 bg-green-50 rounded-lg shadow-sm border border-green-100">
        <div className="text-lg font-semibold text-green-800">{node.name}</div>
        <div className="text-sm text-gray-700">{node.email}</div>
        <div className="text-sm text-gray-600">📞 {node.phone || "N/A"}</div>
        <div className="text-xs text-green-600 mt-1 font-mono">
          Referral ID: {node.refCode}
        </div>
      </div>

      {node.children?.length > 0 && (
        <div className="ml-4 mt-3 border-l border-dashed border-green-300 pl-4">
          {node.children.map((child) => (
            <TreeNodeComponent key={child.refCode} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
