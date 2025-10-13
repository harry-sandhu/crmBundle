// import { useBundleStore } from "../store/useStore";
// import { useNavigate } from "react-router-dom";

// export default function BundleSidebar() {
//   const { items, removeItem, notes, setNotes, clearBundle } = useBundleStore();
//   const navigate = useNavigate();

//   const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

//   return (
//     <div className="w-80 bg-white border-l border-green-100 shadow-xl p-5 flex flex-col justify-between">
//       <div>
//         <h2 className="text-xl font-bold text-green-800 mb-3">Your Bundle</h2>
//         {items.length === 0 ? (
//           <p className="text-gray-500 text-sm">No items added yet</p>
//         ) : (
//           <ul className="space-y-3">
//             {items.map((i) => (
//               <li
//                 key={i.productId}
//                 className="flex justify-between items-center text-sm"
//               >
//                 <div>
//                   <p className="font-medium text-green-700">{i.title}</p>
//                   <p className="text-gray-600">
//                     {i.qty} × ₹{i.price}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => removeItem(i.productId)}
//                   className="text-red-500 hover:text-red-700 font-bold"
//                 >
//                   ×
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}

//         {items.length > 0 && (
//           <>
//             <textarea
//               placeholder="Add notes (optional)"
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="w-full mt-4 p-2 border border-green-200 rounded-lg text-sm focus:ring-2 focus:ring-green-300"
//             />
//             <p className="mt-3 font-semibold text-green-700">
//               Total: ₹{total.toLocaleString()}
//             </p>
//           </>
//         )}
//       </div>

//       {items.length > 0 && (
//         <div className="mt-5 space-y-2">
//           <button
//             onClick={() => navigate("/review-bundle")}
//             className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
//           >
//             Review & Submit
//           </button>
//           <button
//             onClick={clearBundle}
//             className="w-full py-2 border border-green-400 text-green-700 rounded-lg hover:bg-green-50"
//           >
//             Clear Bundle
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


// import { useBundleStore } from "../store/useStore";
// import { useNavigate } from "react-router-dom";

// export default function BundleSidebar() {
//   const { items, removeItem, notes, setNotes, clearBundle } = useBundleStore();
//   const navigate = useNavigate();

//   // Totals based on mrp/dp
//   const totalMRP = items.reduce((sum, i) => sum + (i.mrp || 0) * i.qty, 0);
//   const totalDP = items.reduce((sum, i) => sum + (i.dp || 0) * i.qty, 0);

//   // PV slab logic: every full 1000 in DP total yields +100 PV
//   const totalPV = Math.floor(totalDP / 1000) * 100;

//   return (
//     <div className="w-80 bg-white border-l border-green-100 shadow-xl p-5 flex flex-col justify-between">
//       <div>
//         <h2 className="text-xl font-bold text-green-800 mb-3">Your Bundle</h2>

//         {items.length === 0 ? (
//           <p className="text-gray-500 text-sm">No items added yet</p>
//         ) : (
//           <ul className="space-y-3">
//             {items.map((i) => (
//               <li
//                 key={i.productId}
//                 className="flex justify-between items-center text-sm"
//               >
//                 <div>
//                   <p className="font-medium text-green-700">{i.title}</p>
//                   <p className="text-gray-600">
//                     {i.qty} × DP ₹{(i.dp || 0).toLocaleString()}
//                   </p>
//                   <p className="text-gray-500">
//                     MRP: ₹{(i.mrp || 0).toLocaleString()}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => removeItem(i.productId)}
//                   className="text-red-500 hover:text-red-700 font-bold"
//                 >
//                   ×
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}

//         {items.length > 0 && (
//           <>
//             <textarea
//               placeholder="Add notes (optional)"
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="w-full mt-4 p-2 border border-green-200 rounded-lg text-sm focus:ring-2 focus:ring-green-300"
//             />
//             <div className="mt-3 space-y-1">
//               <p className="font-semibold text-green-700">
//                 Final MRP: ₹{totalMRP.toLocaleString()}
//               </p>
//               <p className="font-semibold text-green-700">
//                 Final PV: {totalPV.toLocaleString()}
//               </p>
//             </div>
//           </>
//         )}
//       </div>

//       {items.length > 0 && (
//         <div className="mt-5 space-y-2">
//           <button
//             onClick={() => navigate("/review-bundle")}
//             className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
//           >
//             Review & Submit
//           </button>
//           <button
//             onClick={clearBundle}
//             className="w-full py-2 border border-green-400 text-green-700 rounded-lg hover:bg-green-50"
//           >
//             Clear Bundle
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }



import { useBundleStore ,type BundleItem} from "../store/useStore";
import { useNavigate } from "react-router-dom";
// import { useBundleStore, type BundleItem } from "../../store/useStore";
export default function BundleSidebar() {
  const { items, removeItem, notes, setNotes, clearBundle } = useBundleStore();
  const navigate = useNavigate();

  // Per-item computed helpers
  const lineMRP = (i: BundleItem) => (i.mrp || 0) * i.qty;
  const lineDP = (i: BundleItem) => (i.dp || 0) * i.qty;

  // Overall totals
  const totalMRP = items.reduce((sum, i) => sum + lineMRP(i), 0);
  const totalDP = items.reduce((sum, i) => sum + lineDP(i), 0);

  // PV slab logic on overall DP
  // 1000–1999 => 100, 2000–2999 => 200, etc.
  const totalPV = Math.floor(totalDP / 1000) * 100;

  return (
    <div className="w-80 bg-white border-l border-green-100 shadow-xl p-5 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-green-800 mb-3">Your Bundle</h2>

        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No items added yet</p>
        ) : (
          <ul className="space-y-4">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between items-start text-sm">
                <div className="pr-2">
                  {/* Title with multiplier */}
                  <p className="font-medium text-green-700">
                    {i.title} <span className="text-gray-600">× {i.qty}</span>
                  </p>

                  {/* Base prices (per unit) */}
                  <p className="text-gray-700">
                    DP: ₹{(i.dp || 0).toLocaleString()} • MRP: ₹{(i.mrp || 0).toLocaleString()}
                  </p>

                  {/* Line totals */}
                  <div className="text-gray-600">
                    <p>Final DP: ₹{lineDP(i).toLocaleString()}</p>
                    <p>Final MRP: ₹{lineMRP(i).toLocaleString()}</p>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(i.productId)}
                  className="text-red-500 hover:text-red-700 font-bold leading-none"
                  aria-label="remove"
                  title="Remove item"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <>
            <textarea
              placeholder="Add notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full mt-4 p-2 border border-green-200 rounded-lg text-sm focus:ring-2 focus:ring-green-300"
            />

            {/* Overall totals */}
            <div className="mt-3 space-y-1">
              <p className="font-semibold text-green-700">
                Overall DP: ₹{totalDP.toLocaleString()}
              </p>
              <p className="font-semibold text-green-700">
                Overall MRP: ₹{totalMRP.toLocaleString()}
              </p>
              <p className="font-semibold text-green-700">
                Final PV: {totalPV.toLocaleString()}
              </p>
            </div>
          </>
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-5 space-y-2">
          <button
            onClick={() => navigate("/bundle/review")}
            className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
          >
            Review & Submit
          </button>
          <button
            onClick={clearBundle}
            className="w-full py-2 border border-green-400 text-green-700 rounded-lg hover:bg-green-50"
          >
            Clear Bundle
          </button>
        </div>
      )}
    </div>
  );
}
