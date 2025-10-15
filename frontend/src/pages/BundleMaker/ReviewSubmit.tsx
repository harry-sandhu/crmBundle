

// import { useEffect, useMemo } from "react";
// import { useBundleStore } from "../../store/useStore";
// import { useNavigate } from "react-router-dom";

// // Local PV history storage key (client-side demo)
// const PV_HISTORY_KEY = "pv_submissions_history";

// type PVEntry = {
//   pv: number;
//   ts: number; // timestamp ms
// };

// // Match your store item shape (no any)
// type BundleItem = {
//   productId: string;
//   title: string;
//   qty: number;
//   mrp: number;
//   dp: number;
// };

// const getRecentPVEntries = (): PVEntry[] => {
//   const raw = localStorage.getItem(PV_HISTORY_KEY);
//   if (!raw) return [];
//   try {
//     const arr: PVEntry[] = JSON.parse(raw);
//     const now = Date.now();
//     const dayAgo = now - 24 * 60 * 60 * 1000;
//     const recent = arr.filter((e) => e.ts >= dayAgo);
//     // keep recent only
//     localStorage.setItem(PV_HISTORY_KEY, JSON.stringify(recent));
//     return recent;
//   } catch {
//     return [];
//   }
// };

// const getRecentPVTotal = () => getRecentPVEntries().reduce((sum, e) => sum + e.pv, 0);

// const pushPV = (pv: number) => {
//   const now = Date.now();
//   const recent = getRecentPVEntries(); // also cleans old
//   recent.push({ pv, ts: now });
//   localStorage.setItem(PV_HISTORY_KEY, JSON.stringify(recent));
// };

// export default function ReviewBundle() {
//   const { items, clearBundle } = useBundleStore();
//   const navigate = useNavigate();

//   // totals (uncapped) — inline helpers to avoid extra deps
//   const totalMRP = useMemo(() => {
//     return (items as BundleItem[]).reduce((sum, i) => sum + (i.mrp ?? 0) * i.qty, 0);
//   }, [items]);

//   const totalDP = useMemo(() => {
//     return (items as BundleItem[]).reduce((sum, i) => sum + (i.dp ?? 0) * i.qty, 0);
//   }, [items]);

//   const totalPVRaw = useMemo(() => {
//     return (items as BundleItem[]).reduce((sum, i) => {
//       const lineDP = (i.dp ?? 0) * i.qty;
//       const pv = Math.floor(lineDP / 1000) * 100;
//       return sum + pv;
//     }, 0);
//   }, [items]);

//   // Compute capped PV for display and submission
//   const recentPV = useMemo(() => getRecentPVTotal(), []);
//   const remainingPV = Math.max(0, 5000 - recentPV);

//   // PV that can be counted now (capped) without exceeding 5000 in the last 24h
//   const totalPVDisplay = Math.min(totalPVRaw, remainingPV);

//   // Immediately alert if cap applies when landing on this page
//   useEffect(() => {
//     if (totalPVRaw > totalPVDisplay) {
//       const overBy = totalPVRaw - totalPVDisplay;
//       alert(
//         `PV capped to 5000 in the last 24 hours. ` +
//           `You can add only ${totalPVDisplay} PV now (excess ${overBy} PV not counted).`
//       );
//     }
//   }, [totalPVRaw, totalPVDisplay]);

//   const handleSubmit = () => {
//     // Record only the capped PV increment
//     const submitPV = totalPVDisplay;
//     if (submitPV > 0) pushPV(submitPV);

//     alert("Bundle submitted successfully!");
//     clearBundle();
//     navigate("/catalog");
//   };

//   return (
//     <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
//       <h2 className="text-2xl font-bold text-green-800 mb-4">Review Your Bundle</h2>

//       {(items as BundleItem[]).length === 0 ? (
//         <p className="text-center text-gray-500">No items in your bundle.</p>
//       ) : (
//         <>
//           {/* Table */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full border border-green-100 rounded-lg">
//               <thead className="bg-green-50 text-left">
//                 <tr>
//                   <th className="px-3 py-2 border-b">Product</th>
//                   <th className="px-3 py-2 border-b">Qty</th>
//                   <th className="px-3 py-2 border-b">MRP (unit)</th>
//                   <th className="px-3 py-2 border-b">DP (unit)</th>
//                   <th className="px-3 py-2 border-b">Line MRP</th>
//                   <th className="px-3 py-2 border-b">Line DP</th>
//                   <th className="px-3 py-2 border-b">Line PV</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {(items as BundleItem[]).map((i) => {
//                   const lineMrp = (i.mrp ?? 0) * i.qty;
//                   const lineDp = (i.dp ?? 0) * i.qty;
//                   const linePv = Math.floor(lineDp / 1000) * 100;
//                   return (
//                     <tr key={i.productId} className="border-b">
//                       <td className="px-3 py-2">{i.title}</td>
//                       <td className="px-3 py-2">{i.qty}</td>
//                       <td className="px-3 py-2">₹{(i.mrp ?? 0).toLocaleString()}</td>
//                       <td className="px-3 py-2">₹{(i.dp ?? 0).toLocaleString()}</td>
//                       <td className="px-3 py-2">₹{lineMrp.toLocaleString()}</td>
//                       <td className="px-3 py-2">₹{lineDp.toLocaleString()}</td>
//                       <td className="px-3 py-2">{linePv.toLocaleString()}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//               <tfoot className="bg-green-50">
//                 <tr>
//                   <td className="px-3 py-2 font-semibold" colSpan={4}>
//                     Final Totals
//                   </td>
//                   <td className="px-3 py-2 font-semibold">
//                     ₹{totalMRP.toLocaleString()}
//                   </td>
//                   <td className="px-3 py-2 font-semibold">
//                     ₹{totalDP.toLocaleString()}
//                   </td>
//                   <td className="px-3 py-2 font-semibold">
//                     {totalPVDisplay.toLocaleString()}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="px-3 py-2 text-sm text-gray-700" colSpan={7}>
//                     Last 24h PV used: {recentPV.toLocaleString()} • Remaining capacity:{" "}
//                     {remainingPV.toLocaleString()} • This submission PV (capped):{" "}
//                     {totalPVDisplay.toLocaleString()}
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>

//           {/* Submit */}
//           <button
//             onClick={handleSubmit}
//             className="mt-5 w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg"
//           >
//             Submit Bundle
//           </button>
//         </>
//       )}
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { useBundleStore } from "../../store/useStore";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const PV_HISTORY_KEY = "pv_submissions_history";

type PVEntry = { pv: number; ts: number };

type BundleItem = {
  productId: string;
  title: string;
  qty: number;
  mrp: number;
  dp: number;
};

type ApiErrorShape = {
  response?: { data?: { message?: string } };
  message?: string;
};

function getErrMessage(e: unknown): string {
  const err = e as ApiErrorShape;
  return err?.response?.data?.message || err?.message || "Failed to submit bundle";
}

const getRecentPVEntries = (): PVEntry[] => {
  const raw = localStorage.getItem(PV_HISTORY_KEY);
  if (!raw) return [];
  try {
    const arr: PVEntry[] = JSON.parse(raw);
    const now = Date.now();
    const dayAgo = now - 24 * 60 * 60 * 1000;
    const recent = arr.filter((e) => e.ts >= dayAgo);
    localStorage.setItem(PV_HISTORY_KEY, JSON.stringify(recent));
    return recent;
  } catch {
    return [];
  }
};

const getRecentPVTotal = () => getRecentPVEntries().reduce((sum, e) => sum + e.pv, 0);

const pushPV = (pv: number) => {
  const now = Date.now();
  const recent = getRecentPVEntries();
  recent.push({ pv, ts: now });
  localStorage.setItem(PV_HISTORY_KEY, JSON.stringify(recent));
};

export default function ReviewBundle() {
  const { items, clearBundle, notes } = useBundleStore() as {
    items: BundleItem[];
    clearBundle: () => void;
    notes?: string;
  };
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const totalMRP = useMemo(
    () => items.reduce((sum, i) => sum + (i.mrp ?? 0) * i.qty, 0),
    [items]
  );

  const totalDP = useMemo(
    () => items.reduce((sum, i) => sum + (i.dp ?? 0) * i.qty, 0),
    [items]
  );

  const totalPVRaw = useMemo(
    () =>
      items.reduce((sum, i) => {
        const lineDP = (i.dp ?? 0) * i.qty;
        const pv = Math.floor(lineDP / 1000) * 100;
        return sum + pv;
      }, 0),
    [items]
  );

  const recentPV = useMemo(() => getRecentPVTotal(), []);
  const remainingPV = Math.max(0, 5000 - recentPV);
  const totalPVDisplay = Math.min(totalPVRaw, remainingPV);

  useEffect(() => {
    if (totalPVRaw > totalPVDisplay) {
      const overBy = totalPVRaw - totalPVDisplay;
      alert(
        `PV capped to 5000 in the last 24 hours. You can add only ${totalPVDisplay} PV now (excess ${overBy} PV not counted).`
      );
    }
  }, [totalPVRaw, totalPVDisplay]);

  const handleSubmit = async () => {
    if (!items.length) {
      alert("No items to submit.");
      return;
    }
    setSubmitting(true);
    try {
      const submitPV = totalPVDisplay;
      if (submitPV > 0) pushPV(submitPV);

      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          title: i.title,
          qty: i.qty,
          mrp: i.mrp ?? 0,
          dp: i.dp ?? 0,
        })),
        notes: notes || "",
      };

      const resp = await api.post("/api/orders/submit", payload);
      if (!resp.data?.success) {
        throw new Error(resp.data?.message || "Order submission failed");
      }

      alert("Bundle submitted successfully!");
      clearBundle();
      navigate("/shop/catalog");
    } catch (err: unknown) {
      const msg = getErrMessage(err);
      console.error("Submit bundle failed:", msg, err);
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Review Your Bundle</h2>

      {items.length === 0 ? (
        <p className="text-center text-gray-500">No items in your bundle.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-green-100 rounded-lg">
              <thead className="bg-green-50 text-left">
                <tr>
                  <th className="px-3 py-2 border-b">Product</th>
                  <th className="px-3 py-2 border-b">Qty</th>
                  <th className="px-3 py-2 border-b">MRP (unit)</th>
                  <th className="px-3 py-2 border-b">DP (unit)</th>
                  <th className="px-3 py-2 border-b">Line MRP</th>
                  <th className="px-3 py-2 border-b">Line DP</th>
                  <th className="px-3 py-2 border-b">Line PV</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => {
                  const lineMrp = (i.mrp ?? 0) * i.qty;
                  const lineDp = (i.dp ?? 0) * i.qty;
                  const linePv = Math.floor(lineDp / 1000) * 100;
                  return (
                    <tr key={i.productId} className="border-b">
                      <td className="px-3 py-2">{i.title}</td>
                      <td className="px-3 py-2">{i.qty}</td>
                      <td className="px-3 py-2">₹{(i.mrp ?? 0).toLocaleString()}</td>
                      <td className="px-3 py-2">₹{(i.dp ?? 0).toLocaleString()}</td>
                      <td className="px-3 py-2">₹{lineMrp.toLocaleString()}</td>
                      <td className="px-3 py-2">₹{lineDp.toLocaleString()}</td>
                      <td className="px-3 py-2">{linePv.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-green-50">
                <tr>
                  <td className="px-3 py-2 font-semibold" colSpan={4}>
                    Final Totals
                  </td>
                  <td className="px-3 py-2 font-semibold">₹{totalMRP.toLocaleString()}</td>
                  <td className="px-3 py-2 font-semibold">₹{totalDP.toLocaleString()}</td>
                  <td className="px-3 py-2 font-semibold">{totalPVDisplay.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-sm text-gray-700" colSpan={7}>
                    Last 24h PV used: {recentPV.toLocaleString()} • Remaining capacity:{" "}
                    {remainingPV.toLocaleString()} • This submission PV (capped):{" "}
                    {totalPVDisplay.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-5 w-full py-3 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white rounded-lg"
          >
            {submitting ? "Submitting..." : "Submit Bundle"}
          </button>
        </>
      )}
    </div>
  );
}
