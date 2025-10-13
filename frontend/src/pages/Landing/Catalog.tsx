// // src/pages/Landing/Catalog.tsx
// import { useEffect, useState } from "react";
// import { useOutletContext } from "react-router-dom";
// import { fakeApi } from "../../utils/fakeApi";
// import type { Product } from "../../data/sampleProducts";
// import { useBundleStore } from "../../store/useStore";

// interface UserLayoutContext {
//   searchTerm: string;
//   category: string;
//   priceRange: [number, number];
// }

// export default function Catalog() {
//   const { searchTerm, category, priceRange } =
//     useOutletContext<UserLayoutContext>();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filtered, setFiltered] = useState<Product[]>([]);
//   const { addItem } = useBundleStore();

//   useEffect(() => {
//     fakeApi.getProducts().then((data) => {
//       setProducts(data);
//       setFiltered(data);
//     });
//   }, []);

//   useEffect(() => {
//     let list = [...products];
//     if (searchTerm)
//       list = list.filter((p) =>
//         p.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     if (category)
//       list = list.filter((p) => p.category === category);
//     if (priceRange[0] || priceRange[1])
//       list = list.filter(
//         (p) =>
//           p.price >= priceRange[0] &&
//           p.price <= (priceRange[1] || Infinity)
//       );
//     setFiltered(list);
//   }, [searchTerm, category, priceRange, products]);

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//       {filtered.map((p) => (
//         <div
//           key={p.id}
//           className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
//         >
//           <img
//             src={p.image}
//             alt={p.name}
//             className="w-full h-40 object-cover rounded-lg mb-3"
//           />
//           <h2 className="text-lg font-bold text-green-800">{p.name}</h2>
//           <p className="text-sm text-gray-600 mb-1">{p.category}</p>
//           <p className="font-semibold text-green-700 mt-2">₹{p.price}</p>
//           <button
//             onClick={() =>
//               addItem({ productId: p.id, title: p.name, qty: 1, price: p.price })
//             }
//             className="mt-3 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
//           >
//             Add to Bundle
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }


// // src/pages/Landing/Catalog.tsx
// import { useEffect, useState } from "react";
// import { useOutletContext } from "react-router-dom";
// import { fakeApi } from "../../utils/fakeApi";
// import type { Product } from "../../data/sampleProducts";
// import { useBundleStore } from "../../store/useStore";

// interface UserLayoutContext {
//   searchTerm: string;
//   category: string;
//   priceRange: [number, number];
// }

// export default function Catalog() {
//   const { searchTerm, category, priceRange } = useOutletContext<UserLayoutContext>();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filtered, setFiltered] = useState<Product[]>([]);

//   // Local map of productId -> quantity shown on card
//   const [qtyMap, setQtyMap] = useState<Record<string, number>>({});

//   // Pull only what's needed from store
//   const { addItem /*, removeItem, setItemQty */ } = useBundleStore();

//   useEffect(() => {
//     fakeApi.getProducts().then((data) => {
//       setProducts(data);
//       setFiltered(data);
//     });
//   }, []);

//   useEffect(() => {
//     let list = [...products];
//     if (searchTerm)
//       list = list.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
//     if (category) list = list.filter((p) => p.category === category);
//     if (priceRange[0] || priceRange[1])
//       list = list.filter((p) => p.price >= priceRange[0] && p.price <= (priceRange[1] || Infinity));
//     setFiltered(list);
//   }, [searchTerm, category, priceRange, products]);

//   const handleAddFirst = (p: Product) => {
//     // set local quantity to 1 and add to bundle
//     setQtyMap((m) => ({ ...m, [p.id]: 1 }));
//     addItem({ productId: p.id, title: p.name, qty: 1, price: p.price });
//   };

//   const inc = (p: Product) => {
//     setQtyMap((m) => {
//       const next = (m[p.id] || 0) + 1;
//       return { ...m, [p.id]: next };
//     });
//     // reflect in bundle store (add one more)
//     addItem({ productId: p.id, title: p.name, qty: 1, price: p.price });
//     // If your store supports setItemQty(productId, qty) use that instead for exact sync
//   };

//   const dec = (p: Product) => {
//     setQtyMap((m) => {
//       const current = m[p.id] || 0;
//       const next = Math.max(0, current - 1);
//       const updated = { ...m, [p.id]: next };
//       if (next === 0) delete updated[p.id];
//       return updated;
//     });
//     // TODO: reflect in bundle store
//     // - If you have removeItem(productId), call it when next === 0
//     // - If you have setItemQty(productId, qty), call it with new qty
//     // Example (uncomment if available):
//     // if (current - 1 <= 0) removeItem(p.id);
//     // else setItemQty(p.id, current - 1);
//   };

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//       {filtered.map((p) => {
//         const qty = qtyMap[p.id] || 0;
//         return (
//           <div key={p.id} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
//             <img
//               src={p.image}
//               alt={p.name}
//               className="w-full h-40 object-cover rounded-lg mb-3"
//             />
//             <h2 className="text-lg font-bold text-green-800">{p.name}</h2>
//             <p className="text-sm text-gray-600 mb-1">{p.category}</p>
//             <p className="font-semibold text-green-700 mt-2">₹{p.price}</p>

//             {qty === 0 ? (
//               <button
//                 onClick={() => handleAddFirst(p)}
//                 className="mt-3 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
//               >
//                 Add to Bundle
//               </button>
//             ) : (
//               <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg">
//                 <button
//                   onClick={() => dec(p)}
//                   className="px-3 py-2 text-green-700 hover:bg-green-100 rounded-l-lg"
//                   aria-label="decrease"
//                 >
//                   −
//                 </button>
//                 <span className="px-3 py-2 font-semibold text-green-800">{qty}</span>
//                 <button
//                   onClick={() => inc(p)}
//                   className="px-3 py-2 text-green-700 hover:bg-green-100 rounded-r-lg"
//                   aria-label="increase"
//                 >
//                   +
//                 </button>
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// src/pages/Landing/Catalog.tsx
// import { useEffect, useState } from "react";
// import { useOutletContext } from "react-router-dom";
// import { fakeApi } from "../../utils/fakeApi";
// import type { Product } from "../../data/sampleProducts";
// import { useBundleStore } from "../../store/useStore";

// interface UserLayoutContext {
//   searchTerm: string;
//   category: string;
//   priceRange: [number, number]; // keep to reuse the filter UI; will filter on mrp
// }

// export default function Catalog() {
//   const { searchTerm, category, priceRange } = useOutletContext<UserLayoutContext>();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filtered, setFiltered] = useState<Product[]>([]);

//   // Local map of productId -> quantity shown on card
//   const [qtyMap, setQtyMap] = useState<Record<string, number>>({});

//   // Store actions
//   const { addItem /*, removeItem, setItemQty */ } = useBundleStore();

//   useEffect(() => {
//     fakeApi.getProducts().then((data) => {
//       setProducts(data);
//       setFiltered(data);
//     });
//   }, []);

//   useEffect(() => {
//     let list = [...products];
//     if (searchTerm)
//       list = list.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
//     if (category) list = list.filter((p) => p.category === category);
//     if (priceRange[0] || priceRange[1]) {
//       // Filter by MRP since price was removed
//       const [min, max] = priceRange;
//       list = list.filter((p) => p.mrp >= (min || 0) && p.mrp <= (max || Infinity));
//     }
//     setFiltered(list);
//   }, [searchTerm, category, priceRange, products]);

//   // Choose which price to use for bundle line item
//   // Here dp is used as the effective price when adding to bundle.
//   const effectiveLinePrice = (p: Product) => p.dp ?? p.mrp;

//   const handleAddFirst = (p: Product) => {
//     setQtyMap((m) => ({ ...m, [p.id]: 1 }));
//     addItem({ productId: p.id, title: p.name, qty: 1, price: effectiveLinePrice(p) });
//   };

//   const inc = (p: Product) => {
//     setQtyMap((m) => {
//       const next = (m[p.id] || 0) + 1;
//       return { ...m, [p.id]: next };
//     });
//     addItem({ productId: p.id, title: p.name, qty: 1, price: effectiveLinePrice(p) });
//     // If your store supports setItemQty(productId, qty), prefer calling that with the new qty
//   };

//   const dec = (p: Product) => {
//     setQtyMap((m) => {
//       const current = m[p.id] || 0;
//       const next = Math.max(0, current - 1);
//       const updated = { ...m, [p.id]: next };
//       if (next === 0) delete updated[p.id];
//       return updated;
//     });
//     // Reflect in store if you have helpers:
//     // if (current - 1 <= 0) removeItem(p.id);
//     // else setItemQty(p.id, current - 1);
//   };

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//       {filtered.map((p) => {
//         const qty = qtyMap[p.id] || 0;
//         return (
//           <div key={p.id} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
//             <img
//               src={p.image}
//               alt={p.name}
//               className="w-full h-40 object-cover rounded-lg mb-3"
//             />
//             <h2 className="text-lg font-bold text-green-800">{p.name}</h2>
//             <p className="text-sm text-gray-600 mb-1">{p.category}</p>

//             {/* MRP and DP block */}
//             <div className="mt-2 space-y-1">
//               <p className="text-sm text-gray-800">
//                 MRP: <span className="font-semibold text-green-700">₹{p.mrp}</span>
//               </p>
//               <p className="text-sm text-gray-800">
//                 DP: <span className="font-semibold text-green-700">₹{p.dp}</span>
//               </p>
//             </div>

//             {qty === 0 ? (
//               <button
//                 onClick={() => handleAddFirst(p)}
//                 className="mt-3 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
//               >
//                 Add to Bundle
//               </button>
//             ) : (
//               <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg">
//                 <button
//                   onClick={() => dec(p)}
//                   className="px-3 py-2 text-green-700 hover:bg-green-100 rounded-l-lg"
//                   aria-label="decrease"
//                 >
//                   −
//                 </button>
//                 <span className="px-3 py-2 font-semibold text-green-800">{qty}</span>
//                 <button
//                   onClick={() => inc(p)}
//                   className="px-3 py-2 text-green-700 hover:bg-green-100 rounded-r-lg"
//                   aria-label="increase"
//                 >
//                   +
//                 </button>
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }


// src/pages/Landing/Catalog.tsx
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { fakeApi } from "../../utils/fakeApi";
import type { Product } from "../../data/sampleProducts";
import { useBundleStore } from "../../store/useStore";

interface UserLayoutContext {
  searchTerm: string;
  category: string;
  priceRange: [number, number]; // used to filter by MRP now
}

export default function Catalog() {
  const { searchTerm, category, priceRange } = useOutletContext<UserLayoutContext>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);

  // productId -> quantity shown on card
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});

  const { addItem /*, removeItem, setItemQty */ } = useBundleStore();

  useEffect(() => {
    fakeApi.getProducts().then((data) => {
      setProducts(data);
      setFiltered(data);
    });
  }, []);

  useEffect(() => {
    let list = [...products];
    if (searchTerm)
      list = list.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (category) list = list.filter((p) => p.category === category);
    if (priceRange[0] || priceRange[1]) {
      const [min, max] = priceRange;
      list = list.filter((p) => p.mrp >= (min || 0) && p.mrp <= (max || Infinity));
    }
    setFiltered(list);
  }, [searchTerm, category, priceRange, products]);

  // Use dp as effective line price (fallback to mrp if dp missing)
  // const effectiveLinePrice = (p: Product) => (typeof p.dp === "number" ? p.dp : p.mrp);

  const handleAddFirst = (p: Product) => {
    setQtyMap((m) => ({ ...m, [p.id]: 1 }));
    addItem({
      productId: p.id,
      title: p.name,
      qty: 1,
      mrp: p.mrp,
      dp: p.dp,
      // keep legacy "price" only if your store expects it:
      // price: effectiveLinePrice(p),
    });
  };

  const inc = (p: Product) => {
    setQtyMap((m) => {
      const next = (m[p.id] || 0) + 1;
      return { ...m, [p.id]: next };
    });
    addItem({
      productId: p.id,
      title: p.name,
      qty: 1,
      mrp: p.mrp,
      dp: p.dp,
      // price: effectiveLinePrice(p),
    });
    // Prefer setItemQty(productId, qty) if your store supports exact qty setting
  };

  const dec = (p: Product) => {
    setQtyMap((m) => {
      const current = m[p.id] || 0;
      const next = Math.max(0, current - 1);
      const updated = { ...m, [p.id]: next };
      if (next === 0) delete updated[p.id];
      return updated;
    });
    // Reflect in store if you have helpers:
    // if (current - 1 <= 0) removeItem(p.id);
    // else setItemQty(p.id, current - 1);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filtered.map((p) => {
        const qty = qtyMap[p.id] || 0;
        return (
          <div key={p.id} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <h2 className="text-lg font-bold text-green-800">{p.name}</h2>
            <p className="text-sm text-gray-600 mb-1">{p.category}</p>

            {/* MRP and DP display */}
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-800">
                MRP: <span className="font-semibold text-green-700">₹{p.mrp}</span>
              </p>
              <p className="text-sm text-gray-800">
                DP: <span className="font-semibold text-green-700">₹{p.dp}</span>
              </p>
            </div>

            {qty === 0 ? (
              <button
                onClick={() => handleAddFirst(p)}
                className="mt-3 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
              >
                Add to Bundle
              </button>
            ) : (
              <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg">
                <button
                  onClick={() => dec(p)}
                  className="px-3 py-2 text-green-700 hover:bg-green-100 rounded-l-lg"
                  aria-label="decrease"
                >
                  −
                </button>
                <span className="px-3 py-2 font-semibold text-green-800">{qty}</span>
                <button
                  onClick={() => inc(p)}
                  className="px-3 py-2 text-green-700 hover:bg-green-100 rounded-r-lg"
                  aria-label="increase"
                >
                  +
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
