// src/pages/BundleMaker/ReviewBundle.tsx
import { useBundleStore } from "../../store/useStore";
import { useNavigate } from "react-router-dom";

export default function ReviewBundle() {
  const { items, clearBundle } = useBundleStore();
  const navigate = useNavigate();
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleSubmit = () => {
    alert("Bundle submitted successfully!");
    clearBundle();
    navigate("/catalog");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Review Your Bundle</h2>
      {items.length === 0 ? (
        <p className="text-center text-gray-500">No items in your bundle.</p>
      ) : (
        <>
          <ul className="divide-y divide-green-100">
            {items.map((i) => (
              <li key={i.productId} className="py-3 flex justify-between">
                <p className="text-green-700">{i.title}</p>
                <p className="font-semibold text-green-700">₹{i.price}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-semibold text-green-700">Total: ₹{total}</p>
          <button
            onClick={handleSubmit}
            className="mt-5 w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg"
          >
            Submit Bundle
          </button>
        </>
      )}
    </div>
  );
}
