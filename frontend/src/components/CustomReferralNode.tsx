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
      className={`relative rounded-full px-4 py-3 text-center shadow-md border transition-all duration-500 cursor-pointer select-none 
        ${
          isActive
            ? "border-green-500 shadow-[0_0_25px_5px_rgba(34,197,94,0.4)] animate-glow"
            : "border-gray-300"
        }
        bg-white hover:scale-105`}
      style={{
        boxShadow: isActive
          ? "0 0 20px 4px rgba(34,197,94,0.45)"
          : "0 0 5px rgba(107,114,128,0.2)",
      }}
    >
      <div
        className={`font-semibold text-sm ${
          isActive ? "text-green-800" : "text-gray-700"
        }`}
      >
        {data.name}
      </div>
      <div className="text-xs text-gray-500">📞 {data.phone || "N/A"}</div>

      {/* invisible handles */}
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

      {/* custom glow animation */}
      <style>
        {`
          @keyframes glow {
            0% { box-shadow: 0 0 8px 2px rgba(34,197,94,0.4); }
            50% { box-shadow: 0 0 22px 6px rgba(34,197,94,0.7); }
            100% { box-shadow: 0 0 8px 2px rgba(34,197,94,0.4); }
          }
          .animate-glow {
            animation: glow 2.5s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
