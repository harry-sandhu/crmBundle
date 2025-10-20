import { useEffect, useState } from "react";
import api from "../utils/api";
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

interface BinaryNode {
  name: string;
  email: string;
  phone?: string | null;
  refCode: string;
  active?: boolean;
  position?: "left" | "right";
  leftChild?: BinaryNode | null;
  rightChild?: BinaryNode | null;
}

interface ApiResponse {
  success: boolean;
  data: BinaryNode;
}

Modal.setAppElement("#root");

export default function BinaryTree() {
  const [tree, setTree] = useState<BinaryNode | null>(null);
  const [nodes, setNodes] = useState<Node<BinaryNode>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selected, setSelected] = useState<BinaryNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const nodeTypes = { custom: CustomReferralNode };
  const localUser = localStorage.getItem("userInfo");
  const refCode = localUser ? JSON.parse(localUser).refCode : null;

  useEffect(() => {
    if (!refCode) {
      setError("No referral code found in local storage.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await api.get<ApiResponse>(`/api/binary-tree/${refCode}`);
        if (res.data.success) {
          const root = res.data.data;
          const { nodes, edges } = convertToFlow(root);
          setTree(root);
          setNodes(nodes);
          setEdges(edges);
        } else setError("Failed to fetch binary tree");
      } catch (err) {
        console.error("❌ Binary tree fetch failed:", err);
        setError("Error fetching binary tree");
      } finally {
        setLoading(false);
      }
    })();
  }, [refCode]);

  if (loading) return <div className="text-center text-green-700 mt-10">Loading binary tree...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">⚠️ {error}</div>;
  if (!tree) return <div className="text-center text-gray-500 mt-10">No binary data found.</div>;

  return (
    <div className="h-[80vh] w-full bg-green-50 rounded-xl shadow-md border border-green-200 p-4">
      <h2 className="text-2xl font-bold text-green-700 mb-3 text-center">⚖️ Binary Tree</h2>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        onNodeClick={(_, node) => setSelected(node.data)}
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>

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
          <p className="text-gray-600 text-xs mt-2 font-mono">Ref Code: {selected.refCode}</p>
          <p className="text-sm mt-2 font-semibold text-green-600">
            Position: {selected.position?.toUpperCase() || "ROOT"}
          </p>
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

// --- Layout Builder for ReactFlow ---
function convertToFlow(root: BinaryNode): { nodes: Node<BinaryNode>[]; edges: Edge[] } {
  const nodes: Node<BinaryNode>[] = [];
  const edges: Edge[] = [];

  const traverse = (node: BinaryNode, x: number, y: number, level: number) => {
    nodes.push({
      id: node.refCode,
      position: { x, y },
      data: node,
      type: "custom",
    });

    const spacing = 400 / (level + 1);

    if (node.leftChild) {
      const leftX = x - spacing;
      const leftY = y + 150;
      edges.push({
        id: `${node.refCode}->${node.leftChild.refCode}`,
        source: node.refCode,
        target: node.leftChild.refCode,
        style: { stroke: "#10b981", strokeWidth: 1.5 },
      });
      traverse(node.leftChild, leftX, leftY, level + 1);
    }

    if (node.rightChild) {
      const rightX = x + spacing;
      const rightY = y + 150;
      edges.push({
        id: `${node.refCode}->${node.rightChild.refCode}`,
        source: node.refCode,
        target: node.rightChild.refCode,
        style: { stroke: "#3b82f6", strokeWidth: 1.5 },
      });
      traverse(node.rightChild, rightX, rightY, level + 1);
    }
  };

  traverse(root, 0, 0, 0);
  return { nodes, edges };
}
