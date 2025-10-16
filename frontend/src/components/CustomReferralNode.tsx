// frontend/src/components/CustomReferralNode.tsx
import { Handle, type NodeProps, Position } from "reactflow";

interface NodeData {
  name: string;
  phone?: string | null;
  active?: boolean;
}

export default function CustomReferralNode({ data }: NodeProps<NodeData>) {
  const isActive = data.active;

  return (
    <div
      className={`rounded-full px-4 py-3 text-center shadow-md border transition-all duration-300 cursor-pointer select-none ${
        isActive
          ? "border-green-500 shadow-[0_0_10px_2px_rgba(34,197,94,0.5)]"
          : "border-gray-300"
      } bg-white hover:scale-105`}
    >
      <div className="font-semibold text-green-800 text-sm">{data.name}</div>
      <div className="text-xs text-gray-600">📞 {data.phone || "N/A"}</div>

      {/* invisible handles for React Flow connections */}
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}
