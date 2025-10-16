// frontend/src/components/ReferralTree.tsx
import { useEffect, useState } from "react";
import axios from "../utils/api";
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
  children: TreeNode[];
  active?: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: TreeNode;
  totalUsers?: number;
}

Modal.setAppElement("#root");

// ----------------- Component -----------------
export default function ReferralTree() {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [nodes, setNodes] = useState<Node<TreeNode>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<TreeNode | null>(null);
  const [error, setError] = useState("");

  const nodeTypes = { custom: CustomReferralNode };
  const localUser = localStorage.getItem("userInfo");
  const refCode = localUser ? JSON.parse(localUser).refCode : null;

  // ----------------- Fetch Referral Tree -----------------
  useEffect(() => {
    if (!refCode) {
      setError("No referral code found in local storage.");
      setLoading(false);
      return;
    }

    const fetchTree = async () => {
      try {
        const res = await axios.get<ApiResponse>(`/api/tree/GROLIFE-ROOT-000000`);
        if (res.data.success) {
          const root = markAllActive(res.data.data);
          const { nodes, edges } = convertToFlow(root);
          setTree(root);
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

  const markAllActive = (node: TreeNode): TreeNode => ({
    ...node,
    active: true,
    children: node.children.map(markAllActive),
  });

  if (loading)
    return <div className="text-center text-green-700 mt-10">Loading tree...</div>;
  if (error)
    return <div className="text-center text-red-600 mt-10">⚠️ {error}</div>;
  if (!tree)
    return <div className="text-center text-gray-500 mt-10">No tree data found.</div>;

  return (
    <div className="h-[80vh] w-full bg-green-50 rounded-xl shadow-md border border-green-200 p-4">
      <h2 className="text-2xl font-bold text-green-700 mb-3 text-center">
        Referral Binary Tree 🌳
      </h2>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodeTypes={nodeTypes}
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
          <p className="text-gray-600 text-xs mt-2 font-mono">
            Ref Code: {selected.refCode}
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

// ----------------- Binary Tree Builder -----------------
function convertToFlow(root: TreeNode): { nodes: Node<TreeNode>[]; edges: Edge[] } {
  const nodes: Node<TreeNode>[] = [];
  const edges: Edge[] = [];

  try {
    // Collect all children recursively in BFS order
    function collectBFS(root: TreeNode): TreeNode[] {
      const queue: TreeNode[] = [root];
      const bfs: TreeNode[] = [];

      while (queue.length > 0) {
        const current = queue.shift()!;
        for (const child of current.children) {
          bfs.push({ ...child, children: [...(child.children || [])] });
          queue.push(child);
        }
      }
      return bfs;
    }

    // --- Build binary tree (no root reprocessing) ---
    function buildBinary(rootNode: TreeNode): TreeNode {
      const waiting = collectBFS(rootNode);
      console.log("🧾 Initial Waiting Queue:", waiting.map((n) => n.name));

      const queue: TreeNode[] = [];

      // Step 1: Assign root children (only once)
      rootNode.children = [];
      while (rootNode.children.length < 2 && waiting.length > 0) {
        const next = waiting.shift()!;
        rootNode.children.push(next);
        queue.push(next); // push only children, not root
        console.log(`🟢 Root got child: ${next.name}`);
      }

      // Step 2: Fill level-by-level
      let level = 0;
      while (waiting.length > 0 && queue.length > 0) {
        level++;
        const currentLevel = [...queue];
        queue.length = 0;

        console.log(`\n🧩 Level ${level}`);
        console.log("📦 Current Level:", currentLevel.map((n) => n.name));
        console.log("🕓 Waiting before:", waiting.map((n) => n.name));

        for (const node of currentLevel) {
          node.children = [];
          while (node.children.length < 2 && waiting.length > 0) {
            const next = waiting.shift()!;
            node.children.push(next);
            queue.push(next);
            console.log(`🟢 Assigned ${next.name} → ${node.name}`);
          }
        }

        console.log("🕓 Waiting after:", waiting.map((n) => n.name));
      }

      console.log("✅ Final binary tree:", JSON.parse(JSON.stringify(rootNode)));
      return rootNode;
    }

    const binaryRoot = buildBinary(root);

    // --- Traverse to build ReactFlow nodes + edges ---
    function traverse(node: TreeNode, x: number, y: number, level: number) {
      nodes.push({
        id: node.refCode,
        position: { x, y },
        data: node,
        type: "custom",
      });

      if (!node.children || node.children.length === 0) return;
      const spacing = 350 / (level + 1);

      if (node.children[0]) {
        const leftX = x - spacing;
        const leftY = y + 150;
        edges.push({
          id: `${node.refCode}->${node.children[0].refCode}`,
          source: node.refCode,
          target: node.children[0].refCode,
          style: { stroke: "#22c55e", strokeWidth: 1.5 },
        });
        traverse(node.children[0], leftX, leftY, level + 1);
      }

      if (node.children[1]) {
        const rightX = x + spacing;
        const rightY = y + 150;
        edges.push({
          id: `${node.refCode}->${node.children[1].refCode}`,
          source: node.refCode,
          target: node.children[1].refCode,
          style: { stroke: "#22c55e", strokeWidth: 1.5 },
        });
        traverse(node.children[1], rightX, rightY, level + 1);
      }
    }

    traverse(binaryRoot, 0, 0, 0);
    return { nodes, edges };
  } catch (err) {
    console.error("🔥 Error inside convertToFlow:", err);
    return { nodes: [], edges: [] };
  }
}
