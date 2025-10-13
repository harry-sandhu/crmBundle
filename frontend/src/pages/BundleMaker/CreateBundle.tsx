
import { useNavigate } from "react-router-dom";
import { useBundleStore } from "../../store/useStore";

export default function CreateBundle() {
  const navigate = useNavigate();
  const { items,  notes, setNotes } = useBundleStore();

  const handleSubmit = () => {
    if (!items.length) return alert("Add at least one item to your bundle!");
    navigate("/bundle/review");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Create Your Bundle</h1>

      <div className="mb-4">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about your bundle (optional)"
          className="w-full border border-green-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="mb-4 text-gray-600">You have {items.length} items in your bundle.</div>

      <div className="flex justify-between">
        <button
          onClick={() => navigate("/catalog")}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Add More Items
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
        >
          Review Bundle
        </button>
      </div>
    </div>
  );
}
