

// src/pages/Landing/Catalog.tsx
// import { useEffect, useState } from "react";
// import { useOutletContext } from "react-router-dom";
// import { fakeApi } from "../../utils/fakeApi";
// import type { Product } from "../../data/sampleProducts";
// import { useBundleStore } from "../../store/useStore";

// interface UserLayoutContext {
//   searchTerm: string;
//   category: string;
//   priceRange: [number, number]; // used to filter by MRP now
// }

// export default function Catalog() {
//   const { searchTerm, category, priceRange } = useOutletContext<UserLayoutContext>();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filtered, setFiltered] = useState<Product[]>([]);

//   // productId -> quantity shown on card
//   const [qtyMap, setQtyMap] = useState<Record<string, number>>({});

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
//       const [min, max] = priceRange;
//       list = list.filter((p) => p.mrp >= (min || 0) && p.mrp <= (max || Infinity));
//     }
//     setFiltered(list);
//   }, [searchTerm, category, priceRange, products]);

//   // Use dp as effective line price (fallback to mrp if dp missing)
//   // const effectiveLinePrice = (p: Product) => (typeof p.dp === "number" ? p.dp : p.mrp);

//   const handleAddFirst = (p: Product) => {
//     setQtyMap((m) => ({ ...m, [p.id]: 1 }));
//     addItem({
//       productId: p.id,
//       title: p.name,
//       qty: 1,
//       mrp: p.mrp,
//       dp: p.dp,
//       // keep legacy "price" only if your store expects it:
//       // price: effectiveLinePrice(p),
//     });
//   };

//   const inc = (p: Product) => {
//     setQtyMap((m) => {
//       const next = (m[p.id] || 0) + 1;
//       return { ...m, [p.id]: next };
//     });
//     addItem({
//       productId: p.id,
//       title: p.name,
//       qty: 1,
//       mrp: p.mrp,
//       dp: p.dp,
//       // price: effectiveLinePrice(p),
//     });
//     // Prefer setItemQty(productId, qty) if your store supports exact qty setting
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

//             {/* MRP and DP display */}
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

// src/pages/Landing/CatalogStandalone.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fakeApi } from "../../utils/fakeApi";
import type { Product } from "../../data/sampleProducts";
import { sampleProducts } from "../../data/sampleProducts";
import { useBundleStore, type BundleItem } from "../../store/useStore";

export default function CatalogStandalone() {
  // Filters state (formerly from Navbar + Outlet context)
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});

  // Store actions
  const { addItem, items, removeItem, notes, setNotes, clearBundle } = useBundleStore();

  const navigate = useNavigate();

  // Load products
  useEffect(() => {
    fakeApi.getProducts().then((data) => setProducts(data));
  }, []);

  // Derived: categories for filter dropdown
  const categories = useMemo(() => {
    const set = new Set(sampleProducts.map((p) => p.category));
    return Array.from(set);
  }, []);

  // Derived: numeric price filters
  const priceRange = useMemo<[number, number]>(() => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || 0;
    return [min, max];
  }, [minPrice, maxPrice]);

  // Filtered list
  const filtered = useMemo(() => {
    let list = [...products];
    if (term) {
      const t = term.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(t));
    }
    if (category) list = list.filter((p) => p.category === category);
    if (priceRange[0] || priceRange[1]) {
      const [min, max] = priceRange;
      list = list.filter((p) => (p.mrp ?? 0) >= (min || 0) && (p.mrp ?? 0) <= (max || Infinity));
    }
    return list;
  }, [products, term, category, priceRange]);

  // BundleSidebar helpers
  const lineMRP = (i: BundleItem) => (i.mrp ?? 0) * i.qty;
  const lineDP = (i: BundleItem) => (i.dp ?? 0) * i.qty;
  const totalMRP = items.reduce((sum, i) => sum + lineMRP(i as BundleItem), 0);
  const totalDP = items.reduce((sum, i) => sum + lineDP(i as BundleItem), 0);
  const totalPV = Math.floor(totalDP / 1000) * 100;

  // Catalog qty handlers
  const handleAddFirst = (p: Product) => {
    setQtyMap((m) => ({ ...m, [p.id]: 1 }));
    addItem({
      productId: p.id,
      title: p.name,
      qty: 1,
      mrp: p.mrp ?? 0,
      dp: p.dp ?? 0,
    });
  };

  const inc = (p: Product) => {
    setQtyMap((m) => ({ ...m, [p.id]: (m[p.id] || 0) + 1 }));
    addItem({
      productId: p.id,
      title: p.name,
      qty: 1,
      mrp: p.mrp ?? 0,
      dp: p.dp ?? 0,
    });
  };

  const dec = (p: Product) => {
    setQtyMap((m) => {
      const current = m[p.id] || 0;
      const next = Math.max(0, current - 1);
      const updated = { ...m, [p.id]: next };
      if (next === 0) delete updated[p.id];
      return updated;
    });
    // Optionally reflect in store if you have setItemQty/removeItem
  };

  // Navbar logout watcher
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // useEffect(() => {
  //   setIsLoggedIn(!!localStorage.getItem("token"));
  //   const onStorage = (e: StorageEvent) => {
  //     if (e.key === "token") setIsLoggedIn(!!e.newValue);
  //   };
  //   window.addEventListener("storage", onStorage);
  //   return () => window.removeEventListener("storage", onStorage);
  // }, []);

  

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
      {/* Embedded Navbar */}
         <header className="w-full bg-white shadow-md py-2 px-4 flex items-center gap-3">
        {/* Brand text only, aligned left */}
        {/* <button
          onClick={() => navigate("/shop/catalog")}
          className="text-base font-extrabold text-green-700 whitespace-nowrap"
        >
          GrowLifeSuprimo
        </button> */}

        {/* Search expands, with gap from filters and bundle */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex-1 flex items-center bg-green-50 rounded-lg shadow-inner min-w-0"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full px-3 py-2 bg-transparent outline-none text-gray-700"
          />
        </form>

        {/* Filters */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-green-300 rounded-md px-2 py-1 bg-white text-green-700 text-sm"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-20 border border-green-300 rounded-md px-2 py-1 text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-20 border border-green-300 rounded-md px-2 py-1 text-sm"
          />
        </div>

        {/* Bundle button pinned to extreme right, smaller size */}
        <button
          onClick={() => navigate("/bundle/review")}
          className="ml-auto bg-green-600 text-white px-2.5 py-1.5 rounded-md text-sm hover:bg-green-700 transition shrink-0"
          title="Open Bundle"
        >
          🛒 Bundle
        </button>
      </header>

      {/* Body with grid + sidebar */}
      <div className="flex flex-1">
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((p) => {
              const qty = qtyMap[p.id] || 0;
              return (
                <div
                  key={p.id}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h2 className="text-lg font-bold text-green-800">{p.name}</h2>
                  <p className="text-sm text-gray-600 mb-1">{p.category}</p>

                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-800">
                      MRP: <span className="font-semibold text-green-700">₹{p.mrp ?? 0}</span>
                    </p>
                    <p className="text-sm text-gray-800">
                      DP: <span className="font-semibold text-green-700">₹{p.dp ?? 0}</span>
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
        </main>

        {/* Embedded BundleSidebar */}
        <aside className="w-80 bg-white border-l border-green-100 shadow-xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-green-800 mb-3">Your Bundle</h2>

            {items.length === 0 ? (
              <p className="text-gray-500 text-sm">No items added yet</p>
            ) : (
              <ul className="space-y-4">
                {items.map((i) => {
                  const item = i as BundleItem;
                  return (
                    <li
                      key={item.productId}
                      className="flex justify-between items-start text-sm"
                    >
                      <div className="pr-2">
                        <p className="font-medium text-green-700">
                          {item.title} <span className="text-gray-600">× {item.qty}</span>
                        </p>
                        <p className="text-gray-700">
                          DP: ₹{(item.dp ?? 0).toLocaleString()} • MRP: ₹{(item.mrp ?? 0).toLocaleString()}
                        </p>
                        <div className="text-gray-600">
                          <p>Final DP: ₹{lineDP(item).toLocaleString()}</p>
                          <p>Final MRP: ₹{lineMRP(item).toLocaleString()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-500 hover:text-red-700 font-bold leading-none"
                        aria-label="remove"
                        title="Remove item"
                      >
                        ×
                      </button>
                    </li>
                  );
                })}
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
        </aside>
      </div>
    </div>
  );
}
