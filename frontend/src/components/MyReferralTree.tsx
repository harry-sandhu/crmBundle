import { useEffect, useState } from "react";
import api from "../utils/api"; // ✅ use api.ts (not axios)
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import Modal from "react-modal";
import CustomReferralNode from "./CustomReferralNode";

// ----------------- Types -----------------
interface TreeNode {
  name: string;
  email: string;
  phone?: string | null;
  refCode: string;
  active?: boolean;
  children: TreeNode[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: TreeNode;
}

Modal.setAppElement("#root");

// ----------------- Component -----------------
export default function MyReferralTree() {
  const [fullTree, setFullTree] = useState<TreeNode | null>(null);
  const [currentRoot, setCurrentRoot] = useState<TreeNode | null>(null);
  const [history, setHistory] = useState<TreeNode[]>([]);
  const [nodes, setNodes] = useState<Node<TreeNode>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selected, setSelected] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const nodeTypes = { custom: CustomReferralNode };

  // ✅ Get user referral code dynamically
  const localUser = localStorage.getItem("userInfo");
  const refCode = localUser ? JSON.parse(localUser).refCode : null;

  // ✅ Fetch referral tree
  useEffect(() => {
    if (!refCode) {
      setError("No referral code found in local storage.");
      setLoading(false);
      return;
    }

    const fetchTree = async () => {
      try {
        const res = await api.get<ApiResponse>(`/api/tree/${refCode}?mode=bulk`);
        if (res.data.success) {
          const tree = res.data.data;
          setFullTree(tree);
          setCurrentRoot(tree);
          const { nodes, edges } = convertToFlow(tree);
          setNodes(nodes);
          setEdges(edges);
        } else setError(res.data.message || "Failed to load tree");
      } catch (err) {
        console.error("❌ Error fetching referral tree:", err);
        setError("Failed to fetch referral tree.");
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, [refCode]);

  // ✅ Handle node click
  const handleNodeClick = (nodeData: TreeNode) => {
    if (!nodeData.children || nodeData.children.length === 0) {
      setSelected(nodeData);
      return;
    }

    setHistory((h) => [...h, currentRoot!]);
    setCurrentRoot(nodeData);
    const { nodes, edges } = convertToFlow(nodeData);
    setNodes(nodes);
    setEdges(edges);
  };

  // ✅ Back navigation
  const handleBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentRoot(prev);
    const { nodes, edges } = convertToFlow(prev);
    setNodes(nodes);
    setEdges(edges);
  };

  // ✅ Toggle Active Status
  const handleToggleActive = async (node: TreeNode, newStatus: boolean) => {
    try {
      await api.patch(`/api/users/${node.refCode}/active`, { active: newStatus });

      // Update modal state
      setSelected((prev) => (prev ? { ...prev, active: newStatus } : prev));

      // Update node visuals in tree
      setNodes((nodes) =>
        nodes.map((n) =>
          n.id === node.refCode
            ? { ...n, data: { ...n.data, active: newStatus } }
            : n
        )
      );
    } catch (err) {
      console.error("Failed to update active status", err);
      alert("Failed to update active status. Please try again.");
    }
  };

  if (loading)
    return <div className="text-center text-green-700 mt-10">Loading referral tree...</div>;
  if (error)
    return <div className="text-center text-red-600 mt-10">⚠️ {error}</div>;
  if (!fullTree || !currentRoot)
    return <div className="text-center text-gray-500 mt-10">No referral data found.</div>;

  return (
    <div className="h-[80vh] w-full bg-green-50 rounded-xl shadow-md border border-green-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-bold text-green-700 flex-1 text-center">
          🌿 My Referral Tree (Dynamic Subtree Viewer)
        </h2>
        {history.length > 0 && (
          <button
            onClick={handleBack}
            className="text-sm px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            ⬅ Back
          </button>
        )}
      </div>

      {/* ReactFlow */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => handleNodeClick(node.data)}
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>

      {/* Modal */}
      {selected && (
        <Modal
          isOpen={!!selected}
          onRequestClose={() => setSelected(null)}
          className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20 border border-green-200 outline-none"
          overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
        >
          <h3 className="text-xl font-bold text-green-700 mb-2">{selected.name}</h3>
          <p className="text-gray-700 text-sm">📧 {selected.email}</p>
          <p className="text-gray-700 text-sm">📞 {selected.phone || "N/A"}</p>
          <p className="text-gray-600 text-xs mt-2 font-mono">
            Ref Code: {selected.refCode}
          </p>

          {/* ✅ Toggle */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Active Status:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <span
                className={`text-sm ${
                  selected.active ? "text-green-700" : "text-red-500"
                }`}
              >
                {selected.active ? "Active" : "Inactive"}
              </span>
              <input
                type="checkbox"
                checked={selected.active ?? false}
                onChange={(e) => handleToggleActive(selected, e.target.checked)}
                className="w-5 h-5 accent-green-600"
              />
            </label>
          </div>

          <button
            onClick={() => setSelected(null)}
            className="mt-5 text-sm text-red-500 hover:underline"
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
}

// ----------------- Layout Builder -----------------
function convertToFlow(root: TreeNode): { nodes: Node<TreeNode>[]; edges: Edge[] } {
  const nodes: Node<TreeNode>[] = [];
  const edges: Edge[] = [];

  function traverse(node: TreeNode, x: number, y: number, level: number) {
    nodes.push({
      id: node.refCode,
      position: { x, y },
      data: node,
      type: "custom", // use CustomReferralNode
    });

    if (!node.children || node.children.length === 0) return;

    const spacing = 400 / (level + 1);
    const offset = -(spacing * (node.children.length - 1)) / 2;

    node.children.forEach((child, index) => {
      const childX = x + offset + index * spacing;
      const childY = y + 180;
      edges.push({
        id: `${node.refCode}->${child.refCode}`,
        source: node.refCode,
        target: child.refCode,
        style: { stroke: "#16a34a", strokeWidth: 1.6 },
      });
      traverse(child, childX, childY, level + 1);
    });
  }

  traverse(root, 0, 0, 0);
  return { nodes, edges };
}
