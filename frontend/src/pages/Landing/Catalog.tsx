// // // src/pages/Landing/CatalogStandalone.tsx
// // import { useEffect, useMemo, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { fakeApi } from "../../utils/fakeApi";
// // import type { Product } from "../../data/sampleProducts";
// // import { sampleProducts } from "../../data/sampleProducts";
// // import { useBundleStore, type BundleItem } from "../../store/useStore";

// // export default function CatalogStandalone() {
// //   // Filters
// //   const [term, setTerm] = useState("");
// //   const [category, setCategory] = useState("");
// //   const [minPrice, setMinPrice] = useState("");
// //   const [maxPrice, setMaxPrice] = useState("");
// //   const [sidebarOpen, setSidebarOpen] = useState(false);

// //   const navigate = useNavigate();
// //   const { addItem, items, removeItem, clearBundle } = useBundleStore();

// //   // Load products
// //   const [products, setProducts] = useState<Product[]>([]);
// //   useEffect(() => {
// //     fakeApi.getProducts().then((data) => setProducts(data));
// //   }, []);

// //   // Derived categories
// //   const categories = useMemo(() => {
// //     const set = new Set(sampleProducts.map((p) => p.category));
// //     return Array.from(set);
// //   }, []);

// //   // Derived numeric range
// //   const priceRange = useMemo<[number, number]>(() => {
// //     const min = parseFloat(minPrice) || 0;
// //     const max = parseFloat(maxPrice) || 0;
// //     return [min, max];
// //   }, [minPrice, maxPrice]);

// //   // Filtered list
// //   const filtered = useMemo(() => {
// //     let list = [...products];
// //     if (term) {
// //       const t = term.toLowerCase();
// //       list = list.filter((p) => p.name.toLowerCase().includes(t));
// //     }
// //     if (category) list = list.filter((p) => p.category === category);
// //     if (priceRange[0] || priceRange[1]) {
// //       const [min, max] = priceRange;
// //       list = list.filter((p) => (p.mrp ?? 0) >= min && (p.mrp ?? 0) <= (max || Infinity));
// //     }
// //     return list;
// //   }, [products, term, category, priceRange]);

// //   // ✅ qtyMap derived from store
// //   const qtyMap = useMemo(() => {
// //     const map: Record<string, number> = {};
// //     for (const i of items) map[i.productId] = i.qty;
// //     return map;
// //   }, [items]);

// //   // Calculations
// //   const lineMRP = (i: BundleItem) => (i.mrp ?? 0) * i.qty;
// //   const lineDP = (i: BundleItem) => (i.dp ?? 0) * i.qty;
// //   const totalMRP = items.reduce((sum, i) => sum + lineMRP(i), 0);
// //   const totalDP = items.reduce((sum, i) => sum + lineDP(i), 0);
// //   const totalPVRaw = Math.floor(totalDP / 1000) * 100; // Raw PV value
// //   const totalPV = Math.min(totalPVRaw, 5000); // ✅ Cap at 5000 PV max

// //   // --- Quantity handlers ---
// //   const handleAddFirst = (p: Product) => {
// //     addItem({
// //       productId: p.id,
// //       title: p.name,
// //       qty: 1,
// //       mrp: p.mrp ?? 0,
// //       dp: p.dp ?? 0,
// //     });
// //   };

// //   const inc = (p: Product) => {
// //     addItem({
// //       productId: p.id,
// //       title: p.name,
// //       qty: 1,
// //       mrp: p.mrp ?? 0,
// //       dp: p.dp ?? 0,
// //     });
// //   };

// //   const dec = (p: Product) => {
// //     const item = items.find((i) => i.productId === p.id);
// //     if (!item) return;
// //     if (item.qty <= 1) removeItem(p.id);
// //     else {
// //       removeItem(p.id);
// //       addItem({
// //         productId: p.id,
// //         title: p.name,
// //         qty: item.qty - 1,
// //         mrp: p.mrp ?? 0,
// //         dp: p.dp ?? 0,
// //       });
// //     }
// //   };

// //   // --- UI ---
// //   return (
// //     <div className="flex flex-col h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
// //       {/* Header */}
// //       <header className="w-full bg-white shadow-md py-2 px-4 flex items-center gap-3 flex-shrink-0">
// //         {/* Search */}
// //         <form
// //           onSubmit={(e) => e.preventDefault()}
// //           className="flex-1 flex items-center bg-green-50 rounded-lg shadow-inner"
// //         >
// //           <input
// //             type="text"
// //             placeholder="Search products..."
// //             value={term}
// //             onChange={(e) => setTerm(e.target.value)}
// //             className="w-full px-3 py-2 bg-transparent outline-none text-gray-700"
// //           />
// //         </form>

// //         {/* Filters */}
// //         <div className="flex items-center gap-2 shrink-0">
// //           <select
// //             value={category}
// //             onChange={(e) => setCategory(e.target.value)}
// //             className="border border-green-300 rounded-md px-2 py-1 bg-white text-green-700 text-sm"
// //           >
// //             <option value="">All</option>
// //             {categories.map((cat) => (
// //               <option key={cat} value={cat}>
// //                 {cat}
// //               </option>
// //             ))}
// //           </select>

// //           <input
// //             type="number"
// //             placeholder="Min"
// //             value={minPrice}
// //             onChange={(e) => setMinPrice(e.target.value)}
// //             className="w-20 border border-green-300 rounded-md px-2 py-1 text-sm"
// //           />
// //           <input
// //             type="number"
// //             placeholder="Max"
// //             value={maxPrice}
// //             onChange={(e) => setMaxPrice(e.target.value)}
// //             className="w-20 border border-green-300 rounded-md px-2 py-1 text-sm"
// //           />
// //         </div>

// //         {/* Sidebar toggle */}
// //         <button
// //           onClick={() => setSidebarOpen(true)}
// //           className="ml-auto bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700 transition shrink-0"
// //         >
// //           🛒 Bundle
// //         </button>
// //       </header>

// //       {/* Body */}
// //       <div className="flex flex-1 relative overflow-hidden">
// //         {/* ✅ Scrollable Products Grid */}
// //         <main className="flex-1 overflow-y-auto p-6">
// //           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
// //             {filtered.map((p) => {
// //               const qty = qtyMap[p.id] || 0;
// //               return (
// //                 <div
// //                   key={p.id}
// //                   className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
// //                 >
// //                   <img
// //                     src={p.image}
// //                     alt={p.name}
// //                     className="w-full h-40 object-cover rounded-lg mb-3"
// //                   />
// //                   <h2 className="text-lg font-bold text-green-800">{p.name}</h2>
// //                   <p className="text-sm text-gray-600 mb-1">{p.category}</p>

// //                   <div className="mt-2 space-y-1">
// //                     <p className="text-sm text-gray-800">
// //                       MRP:{" "}
// //                       <span className="font-semibold text-green-700">
// //                         ₹{p.mrp ?? 0}
// //                       </span>
// //                     </p>
// //                     <p className="text-sm text-gray-800">
// //                       DP:{" "}
// //                       <span className="font-semibold text-green-700">
// //                         ₹{p.dp ?? 0}
// //                       </span>
// //                     </p>
// //                   </div>

// //                   {/* Add or Quantity Counter */}
// //                   {qty === 0 ? (
// //                     <button
// //                       onClick={() => handleAddFirst(p)}
// //                       className="mt-3 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
// //                     >
// //                       Add to Bundle
// //                     </button>
// //                   ) : (
// //                     <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg">
// //                       <button
// //                         onClick={() => dec(p)}
// //                         className="px-3 py-2 text-green-700 hover:bg-green-100 rounded-l-lg"
// //                       >
// //                         −
// //                       </button>
// //                       <span className="px-3 py-2 font-semibold text-green-800">{qty}</span>
// //                       <button
// //                         onClick={() => inc(p)}
// //                         className="px-3 py-2 text-green-700 hover:bg-green-100 rounded-r-lg"
// //                       >
// //                         +
// //                       </button>
// //                     </div>
// //                   )}
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </main>

// //         {/* Sidebar Drawer */}
// //         {sidebarOpen && (
// //           <aside className="absolute right-0 top-0 h-full w-80 bg-white border-l border-green-200 shadow-2xl p-5 flex flex-col z-50 animate-slideIn">
// //             <div className="flex items-center justify-between mb-4">
// //               <h2 className="text-xl font-bold text-green-800">Your Bundle</h2>
// //               <button
// //                 onClick={() => setSidebarOpen(false)}
// //                 className="text-red-500 hover:text-red-600 text-lg font-bold"
// //               >
// //                 ×
// //               </button>
// //             </div>

// //             {/* ✅ Scrollable Bundle List */}
// //             <div className="flex-1 overflow-y-auto">
// //               {items.length === 0 ? (
// //                 <p className="text-gray-500 text-sm">No items added yet</p>
// //               ) : (
// //                 <ul className="space-y-4">
// //                   {items.map((i) => (
// //                     <li
// //                       key={i.productId}
// //                       className="flex justify-between items-start text-sm"
// //                     >
// //                       <div className="pr-2">
// //                         <p className="font-medium text-green-700">
// //                           {i.title} × {i.qty}
// //                         </p>
// //                         <p className="text-gray-700">
// //                           DP: ₹{(i.dp ?? 0).toLocaleString()} • MRP: ₹
// //                           {(i.mrp ?? 0).toLocaleString()}
// //                         </p>
// //                       </div>
// //                       <button
// //                         onClick={() => removeItem(i.productId)}
// //                         className="text-red-500 hover:text-red-700 font-bold leading-none"
// //                       >
// //                         ×
// //                       </button>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               )}
// //             </div>

// //             {items.length > 0 && (
// //               <div className="mt-5 border-t pt-3 space-y-1 text-sm">
// //                 <p className="font-semibold text-green-700">
// //                   Overall DP: ₹{totalDP.toLocaleString()}
// //                 </p>
// //                 <p className="font-semibold text-green-700">
// //                   Overall MRP: ₹{totalMRP.toLocaleString()}
// //                 </p>
// //                 <p
// //                   className={`font-semibold ${
// //                     totalPVRaw > 5000 ? "text-red-600" : "text-green-700"
// //                   }`}
// //                 >
// //                   Final PV: {totalPV.toLocaleString()} / 5000
// //                 </p>
// //               </div>
// //             )}

// //             {items.length > 0 && (
// //               <div className="mt-4 space-y-2">
// //                 <button
// //                   onClick={() => {
// //                     setSidebarOpen(false);
// //                     setTimeout(() => navigate("/bundle/review"), 300);
// //                   }}
// //                   className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
// //                 >
// //                   Review & Submit
// //                 </button>
// //                 <button
// //                   onClick={clearBundle}
// //                   className="w-full py-2 border border-green-400 text-green-700 rounded-lg hover:bg-green-50"
// //                 >
// //                   Clear Bundle
// //                 </button>
// //               </div>
// //             )}
// //           </aside>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }


// // src/pages/Landing/CatalogStandalone.tsx
// // src/pages/Landing/CatalogStandalone.tsx
// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../utils/api";
// import { useBundleStore, type BundleItem } from "../../store/useStore";
// import axios, { AxiosError } from "axios";

// type Product = {
//   id: string;
//   name: string;
//   description: string;
//   image: string;
//   category: string;
//   mrp: number;
//   dp: number;
// };

// type ProductsResponse = {
//   ok: boolean;
//   data: Product[];
//   message?: string;
// };

// export default function CatalogStandalone() {
//   // Filters
//   const [term, setTerm] = useState("");
//   const [category, setCategory] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const navigate = useNavigate();
//   const { addItem, items, removeItem, clearBundle } = useBundleStore();

//   // Load products from API
//   const [products, setProducts] = useState<Product[]>([]);
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     let cancel = false;
//     (async () => {
//       try {
//         const res = await api.get<ProductsResponse>("/products");
//         if (cancel) return;
//         if (res.data.ok) setProducts(res.data.data);
//         else setErr(res.data.message || "Failed to load products");
//       } catch (error: unknown) {
//         if (axios.isAxiosError(error)) {
//           const ax = error as AxiosError<{ message?: string }>;
//           const status = ax.response?.status ?? "network";
//           const message = ax.response?.data?.message ?? ax.message ?? "Request failed";
//           setErr(`Failed to load products (${status}): ${message}`);
//         } else if (error instanceof Error) {
//           setErr(`Failed to load products: ${error.message}`);
//         } else {
//           setErr("Failed to load products");
//         }
//       }
//     })();
//     return () => {
//       cancel = true;
//     };
//   }, []);

//   // Categories derived from fetched products
//   const categories = useMemo(() => {
//     const set = new Set(products.map((p) => p.category));
//     return Array.from(set);
//   }, [products]);

//   // Derived numeric range
//   const priceRange = useMemo<[number, number]>(() => {
//     const min = parseFloat(minPrice) || 0;
//     const max = parseFloat(maxPrice) || 0;
//     return [min, max];
//   }, [minPrice, maxPrice]);

//   // Filtered list
//   const filtered = useMemo(() => {
//     let list = [...products];
//     if (term) {
//       const t = term.toLowerCase();
//       list = list.filter((p) => p.name.toLowerCase().includes(t));
//     }
//     if (category) list = list.filter((p) => p.category === category);
//     if (priceRange[0] || priceRange[1]) {
//       const [min, max] = priceRange;
//       list = list.filter((p) => (p.mrp ?? 0) >= min && (p.mrp ?? 0) <= (max || Infinity));
//     }
//     return list;
//   }, [products, term, category, priceRange]);

//   // qty map
//   const qtyMap = useMemo(() => {
//     const map: Record<string, number> = {};
//     for (const i of items) map[i.productId] = i.qty;
//     return map;
//   }, [items]);

//   // Calculations
//   const lineMRP = (i: BundleItem) => (i.mrp ?? 0) * i.qty;
//   const lineDP = (i: BundleItem) => (i.dp ?? 0) * i.qty;
//   const totalMRP = items.reduce((sum, i) => sum + lineMRP(i), 0);
//   const totalDP = items.reduce((sum, i) => sum + lineDP(i), 0);
//   const totalPVRaw = Math.floor(totalDP / 1000) * 100;
//   const totalPV = Math.min(totalPVRaw, 4000);

//   // Modal state
//   const [selected, setSelected] = useState<Product | null>(null);
//   const [showModal, setShowModal] = useState(false);

//   const onProductClick = (p: Product) => {
//     setSelected(p);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelected(null);
//   };

//   const handleAddFirst = (p: Product) => {
//     addItem({
//       productId: p.id,
//       title: p.name,
//       qty: 1,
//       mrp: p.mrp ?? 0,
//       dp: p.dp ?? 0,
//     });
//   };

//   const inc = (p: Product) => {
//     addItem({
//       productId: p.id,
//       title: p.name,
//       qty: 1,
//       mrp: p.mrp ?? 0,
//       dp: p.dp ?? 0,
//     });
//   };

//   const dec = (p: Product) => {
//     const item = items.find((i) => i.productId === p.id);
//     if (!item) return;
//     if (item.qty <= 1) removeItem(p.id);
//     else {
//       removeItem(p.id);
//       addItem({
//         productId: p.id,
//         title: p.name,
//         qty: item.qty - 1,
//         mrp: p.mrp ?? 0,
//         dp: p.dp ?? 0,
//       });
//     }
//   };

//   // Close modal on Escape
//   useEffect(() => {
//     function onKey(ev: KeyboardEvent) {
//       if (ev.key === "Escape") closeModal();
//     }
//     if (showModal) document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, [showModal]);

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
//       <header className="w-full bg-white shadow-md py-2 px-4 flex items-center gap-3 flex-shrink-0">
//         <form onSubmit={(e) => e.preventDefault()} className="flex-1 flex items-center bg-green-50 rounded-lg shadow-inner">
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={term}
//             onChange={(e) => setTerm(e.target.value)}
//             className="w-full px-3 py-2 bg-transparent outline-none text-gray-700"
//           />
//         </form>

//         <div className="flex items-center gap-2 shrink-0">
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="border border-green-300 rounded-md px-2 py-1 bg-white text-green-700 text-sm"
//           >
//             <option value="">All</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>

//           <input
//             type="number"
//             placeholder="Min"
//             value={minPrice}
//             onChange={(e) => setMinPrice(e.target.value)}
//             className="w-20 border border-green-300 rounded-md px-2 py-1 text-sm"
//           />
//           <input
//             type="number"
//             placeholder="Max"
//             value={maxPrice}
//             onChange={(e) => setMaxPrice(e.target.value)}
//             className="w-20 border border-green-300 rounded-md px-2 py-1 text-sm"
//           />
//         </div>

//         <button
//           onClick={() => setSidebarOpen(true)}
//           className="ml-auto bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700 transition shrink-0"
//         >
//           🛒 Bundle
//         </button>
//       </header>

//       <div className="flex flex-1 relative overflow-hidden">
//         <main className="flex-1 overflow-y-auto p-6">
//           {err && <div className="text-red-600 mb-3">{err}</div>}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
//             {filtered.map((p) => {
//               const qty = qtyMap[p.id] || 0;
//               return (
//                 <div
//                   key={p.id}
//                   className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
//                   onClick={() => onProductClick(p)}
//                 >
//                   <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded-lg mb-3" />
//                   <h2 className="text-lg font-bold text-green-800">{p.name}</h2>
//                   <p className="text-sm text-gray-600 mb-1">{p.category}</p>
//                   <div className="mt-2 space-y-1">
//                     <p className="text-sm text-gray-800">
//                       MRP: <span className="font-semibold text-green-700">₹{p.mrp ?? 0}</span>
//                     </p>
//                     <p className="text-sm text-gray-800">
//                       DP: <span className="font-semibold text-green-700">₹{p.dp ?? 0}</span>
//                     </p>
//                   </div>

//                   {/* Quick add controls kept on the card */}
//                   {qty === 0 ? (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleAddFirst(p);
//                       }}
//                       className="mt-3 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
//                     >
//                       Add to Bundle
//                     </button>
//                   ) : (
//                     <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           dec(p);
//                         }}
//                         className="px-3 py-2 text-green-700 hover:bg-green-100 rounded-l-lg"
//                       >
//                         −
//                       </button>
//                       <span className="px-3 py-2 font-semibold text-green-800">{qty}</span>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           inc(p);
//                         }}
//                         className="px-3 py-2 text-green-700 hover:bg-green-100 rounded-r-lg"
//                       >
//                         +
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </main>

//         {sidebarOpen && (
//           <aside className="absolute right-0 top-0 h-full w-80 bg-white border-l border-green-200 shadow-2xl p-5 flex flex-col z-50 animate-slideIn">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-green-800">Your Bundle</h2>
//               <button onClick={() => setSidebarOpen(false)} className="text-red-500 hover:text-red-600 text-lg font-bold">
//                 ×
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto">
//               {items.length === 0 ? (
//                 <p className="text-gray-500 text-sm">No items added yet</p>
//               ) : (
//                 <ul className="space-y-4">
//                   {items.map((i) => (
//                     <li key={i.productId} className="flex justify-between items-start text-sm">
//                       <div className="pr-2">
//                         <p className="font-medium text-green-700">
//                           {i.title} × {i.qty}
//                         </p>
//                         <p className="text-gray-700">
//                           DP: ₹{(i.dp ?? 0).toLocaleString()} • MRP: ₹{(i.mrp ?? 0).toLocaleString()}
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => removeItem(i.productId)}
//                         className="text-red-500 hover:text-red-700 font-bold leading-none"
//                       >
//                         ×
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             {items.length > 0 && (
//               <div className="mt-5 border-t pt-3 space-y-1 text-sm">
//                 <p className="font-semibold text-green-700">Overall DP: ₹{totalDP.toLocaleString()}</p>
//                 <p className="font-semibold text-green-700">Overall MRP: ₹{totalMRP.toLocaleString()}</p>
//                 <p className={`font-semibold ${totalPVRaw > 4000 ? "text-red-600" : "text-green-700"}`}>
//                   Final PV: {totalPV.toLocaleString()} / 4000
//                 </p>
//               </div>
//             )}

//             {items.length > 0 && (
//               <div className="mt-4 space-y-2">
//                 <button
//                   onClick={() => {
//                     setSidebarOpen(false);
//                     setTimeout(() => navigate("/bundle/review"), 300);
//                   }}
//                   className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
//                 >
//                   Review & Submit
//                 </button>
//                 <button
//                   onClick={clearBundle}
//                   className="w-full py-2 border border-green-400 text-green-700 rounded-lg hover:bg-green-50"
//                 >
//                   Clear Bundle
//                 </button>
//               </div>
//             )}
//           </aside>
//         )}
//       </div>

//       {/* Product Detail Modal */}
//       {showModal && selected && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
//           onClick={closeModal}
//         >
//           <div
//             className="bg-white max-w-lg w-[90%] rounded-xl shadow-xl overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="relative">
//               <img src={selected.image} alt={selected.name} className="w-full h-56 object-cover" />
//               <button
//                 onClick={closeModal}
//                 className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-800 rounded-full px-2 py-1"
//                 aria-label="Close"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="p-5">
//               <h3 className="text-xl font-bold text-green-800">{selected.name}</h3>
//               <p className="text-sm text-gray-600 mb-2">{selected.category}</p>

//               <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
//                 <div className="bg-green-50 border border-green-200 rounded p-2">
//                   <div className="text-gray-600">MRP</div>
//                   <div className="font-semibold text-green-700">₹{selected.mrp ?? 0}</div>
//                 </div>
//                 <div className="bg-green-50 border border-green-200 rounded p-2">
//                   <div className="text-gray-600">DP</div>
//                   <div className="font-semibold text-green-700">₹{selected.dp ?? 0}</div>
//                 </div>
//               </div>

//               <p className="mt-3 text-gray-800 text-sm leading-relaxed">{selected.description}</p>

//               <div className="mt-4 flex items-center gap-2">
//                 <button
//                   className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
//                   onClick={() => {
//                     handleAddFirst(selected);
//                     closeModal();
//                     setSidebarOpen(true);
//                   }}
//                 >
//                   Add to Bundle
//                 </button>
//                 <button
//                   className="px-4 py-2 border border-green-400 text-green-700 rounded-lg hover:bg-green-50"
//                   onClick={closeModal}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


//2nd code
// // src/pages/Landing/CatalogStandalone.tsx
// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { fakeApi } from "../../utils/fakeApi";
// import type { Product } from "../../data/sampleProducts";
// import { sampleProducts } from "../../data/sampleProducts";
// import { useBundleStore, type BundleItem } from "../../store/useStore";

// export default function CatalogStandalone() {
//   // Filters
//   const [term, setTerm] = useState("");
//   const [category, setCategory] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const navigate = useNavigate();
//   const { addItem, items, removeItem, clearBundle } = useBundleStore();

//   // Load products from fakeApi
//   const [products, setProducts] = useState<Product[]>([]);
//   const [err, setErr] = useState("");

//   // useEffect(() => {
//   //   let cancel = false;
//   //   (async () => {
//   //     try {
//   //       const data = await fakeApi.getProducts();
//   //       if (cancel) return;
//   //       setProducts(data);
//   //     } catch (e) {
//   //       setErr("Failed to load products");
//   //     }
//   //   })();
//   //   return () => {
//   //     cancel = true;
//   //   };
//   // }, []);
//   useEffect(() => {
//   let cancel = false;
//   (async () => {
//     try {
//       const data = await fakeApi.getProducts();
//       if (cancel) return;
//       setProducts(data);
//     } catch (error: unknown) {
//       const msg =
//         error instanceof Error ? error.message : "Failed to load products";
//       setErr(`Failed to load products: ${msg}`);
//     }
//   })();
//   return () => {
//     cancel = true;
//   };
// }, []);

//   // Categories derived from local sampleProducts (or from products—both work)
//   const categories = useMemo(() => {
//     const set = new Set(sampleProducts.map((p) => p.category));
//     return Array.from(set);
//   }, []);

//   // Derived numeric range
//   const priceRange = useMemo<[number, number]>(() => {
//     const min = parseFloat(minPrice) || 0;
//     const max = parseFloat(maxPrice) || 0;
//     return [min, max];
//   }, [minPrice, maxPrice]);

//   // Filtered list
//   const filtered = useMemo(() => {
//     let list = [...products];
//     if (term) {
//       const t = term.toLowerCase();
//       list = list.filter((p) => p.name.toLowerCase().includes(t));
//     }
//     if (category) list = list.filter((p) => p.category === category);
//     if (priceRange[0] || priceRange[1]) {
//       const [min, max] = priceRange;
//       list = list.filter(
//         (p) => (p.mrp ?? 0) >= min && (p.mrp ?? 0) <= (max || Infinity)
//       );
//     }
//     return list;
//   }, [products, term, category, priceRange]);

//   // qty map
//   const qtyMap = useMemo(() => {
//     const map: Record<string, number> = {};
//     for (const i of items) map[i.productId] = i.qty;
//     return map;
//   }, [items]);

//   // Calculations
//   const lineMRP = (i: BundleItem) => (i.mrp ?? 0) * i.qty;
//   const lineDP = (i: BundleItem) => (i.dp ?? 0) * i.qty;
//   const totalMRP = items.reduce((sum, i) => sum + lineMRP(i), 0);
//   const totalDP = items.reduce((sum, i) => sum + lineDP(i), 0);
//   const totalPVRaw = Math.floor(totalDP / 1000) * 100;
//   const totalPV = Math.min(totalPVRaw, 4000);

//   // Modal state
//   const [selected, setSelected] = useState<Product | null>(null);
//   const [showModal, setShowModal] = useState(false);

//   const onProductClick = (p: Product) => {
//     setSelected(p);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelected(null);
//   };

//   const handleAddFirst = (p: Product) => {
//     addItem({
//       productId: p.id,
//       title: p.name,
//       qty: 1,
//       mrp: p.mrp ?? 0,
//       dp: p.dp ?? 0,
//     });
//   };

//   const inc = (p: Product) => {
//     addItem({
//       productId: p.id,
//       title: p.name,
//       qty: 1,
//       mrp: p.mrp ?? 0,
//       dp: p.dp ?? 0,
//     });
//   };

//   const dec = (p: Product) => {
//     const item = items.find((i) => i.productId === p.id);
//     if (!item) return;
//     if (item.qty <= 1) removeItem(p.id);
//     else {
//       removeItem(p.id);
//       addItem({
//         productId: p.id,
//         title: p.name,
//         qty: item.qty - 1,
//         mrp: p.mrp ?? 0,
//         dp: p.dp ?? 0,
//       });
//     }
//   };

//   // Close modal on Escape
//   useEffect(() => {
//     function onKey(ev: KeyboardEvent) {
//       if (ev.key === "Escape") closeModal();
//     }
//     if (showModal) document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, [showModal]);

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
//       <header className="w-full bg-white shadow-md py-2 px-4 flex items-center gap-3 flex-shrink-0">
//         <form onSubmit={(e) => e.preventDefault()} className="flex-1 flex items-center bg-green-50 rounded-lg shadow-inner">
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={term}
//             onChange={(e) => setTerm(e.target.value)}
//             className="w-full px-3 py-2 bg-transparent outline-none text-gray-700"
//           />
//         </form>

//         <div className="flex items-center gap-2 shrink-0">
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="border border-green-300 rounded-md px-2 py-1 bg-white text-green-700 text-sm"
//           >
//             <option value="">All</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>

//           <input
//             type="number"
//             placeholder="Min"
//             value={minPrice}
//             onChange={(e) => setMinPrice(e.target.value)}
//             className="w-20 border border-green-300 rounded-md px-2 py-1 text-sm"
//           />
//           <input
//             type="number"
//             placeholder="Max"
//             value={maxPrice}
//             onChange={(e) => setMaxPrice(e.target.value)}
//             className="w-20 border border-green-300 rounded-md px-2 py-1 text-sm"
//           />
//         </div>

//         <button
//           onClick={() => setSidebarOpen(true)}
//           className="ml-auto bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700 transition shrink-0"
//         >
//           🛒 Bundle
//         </button>
//       </header>

//       <div className="flex flex-1 relative overflow-hidden">
//         <main className="flex-1 overflow-y-auto p-6">
//           {err && <div className="text-red-600 mb-3">{err}</div>}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
//             {filtered.map((p) => {
//               const qty = qtyMap[p.id] || 0;
//               return (
//                 <div
//                   key={p.id}
//                   className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
//                   onClick={() => onProductClick(p)}
//                 >
//                   <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded-lg mb-3" />
//                   <h2 className="text-lg font-bold text-green-800">{p.name}</h2>
//                   <p className="text-sm text-gray-600 mb-1">{p.category}</p>
//                   <div className="mt-2 space-y-1">
//                     <p className="text-sm text-gray-800">
//                       MRP: <span className="font-semibold text-green-700">₹{p.mrp ?? 0}</span>
//                     </p>
//                     <p className="text-sm text-gray-800">
//                       DP: <span className="font-semibold text-green-700">₹{p.dp ?? 0}</span>
//                     </p>
//                   </div>

//                   {/* Quick add controls kept on the card */}
//                   {qty === 0 ? (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleAddFirst(p);
//                       }}
//                       className="mt-3 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
//                     >
//                       Add to Bundle
//                     </button>
//                   ) : (
//                     <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           dec(p);
//                         }}
//                         className="px-3 py-2 text-green-700 hover:bg-green-100 rounded-l-lg"
//                       >
//                         −
//                       </button>
//                       <span className="px-3 py-2 font-semibold text-green-800">{qty}</span>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           inc(p);
//                         }}
//                         className="px-3 py-2 text-green-700 hover:bg-green-100 rounded-r-lg"
//                       >
//                         +
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </main>

//         {sidebarOpen && (
//           <aside className="absolute right-0 top-0 h-full w-80 bg-white border-l border-green-200 shadow-2xl p-5 flex flex-col z-50 animate-slideIn">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-green-800">Your Bundle</h2>
//               <button onClick={() => setSidebarOpen(false)} className="text-red-500 hover:text-red-600 text-lg font-bold">
//                 ×
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto">
//               {items.length === 0 ? (
//                 <p className="text-gray-500 text-sm">No items added yet</p>
//               ) : (
//                 <ul className="space-y-4">
//                   {items.map((i) => (
//                     <li key={i.productId} className="flex justify-between items-start text-sm">
//                       <div className="pr-2">
//                         <p className="font-medium text-green-700">
//                           {i.title} × {i.qty}
//                         </p>
//                         <p className="text-gray-700">
//                           DP: ₹{(i.dp ?? 0).toLocaleString()} • MRP: ₹{(i.mrp ?? 0).toLocaleString()}
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => removeItem(i.productId)}
//                         className="text-red-500 hover:text-red-700 font-bold leading-none"
//                       >
//                         ×
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             {items.length > 0 && (
//               <div className="mt-5 border-t pt-3 space-y-1 text-sm">
//                 <p className="font-semibold text-green-700">Overall DP: ₹{totalDP.toLocaleString()}</p>
//                 <p className="font-semibold text-green-700">Overall MRP: ₹{totalMRP.toLocaleString()}</p>
//                 <p className={`font-semibold ${totalPVRaw > 4000 ? "text-red-600" : "text-green-700"}`}>
//                   Final PV: {totalPV.toLocaleString()} / 4000
//                 </p>
//               </div>
//             )}

//             {items.length > 0 && (
//               <div className="mt-4 space-y-2">
//                 <button
//                   onClick={() => {
//                     setSidebarOpen(false);
//                     setTimeout(() => navigate("/bundle/review"), 300);
//                   }}
//                   className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
//                 >
//                   Review & Submit
//                 </button>
//                 <button
//                   onClick={clearBundle}
//                   className="w-full py-2 border border-green-400 text-green-700 rounded-lg hover:bg-green-50"
//                 >
//                   Clear Bundle
//                 </button>
//               </div>
//             )}
//           </aside>
//         )}
//       </div>

//       {/* Product Detail Modal */}
//       {showModal && selected && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeModal}>
//           <div className="bg-white max-w-lg w-[90%] rounded-xl shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
//             <div className="relative">
//               <img src={selected.image} alt={selected.name} className="w-full h-56 object-cover" />
//               <button
//                 onClick={closeModal}
//                 className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-800 rounded-full px-2 py-1"
//                 aria-label="Close"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="p-5">
//               <h3 className="text-xl font-bold text-green-800">{selected.name}</h3>
//               <p className="text-sm text-gray-600 mb-2">{selected.category}</p>

//               <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
//                 <div className="bg-green-50 border border-green-200 rounded p-2">
//                   <div className="text-gray-600">MRP</div>
//                   <div className="font-semibold text-green-700">₹{selected.mrp ?? 0}</div>
//                 </div>
//                 <div className="bg-green-50 border border-green-200 rounded p-2">
//                   <div className="text-gray-600">DP</div>
//                   <div className="font-semibold text-green-700">₹{selected.dp ?? 0}</div>
//                 </div>
//               </div>

//               <p className="mt-3 text-gray-800 text-sm leading-relaxed">{selected.description}</p>

//               <div className="mt-4 flex items-center gap-2">
//                 <button
//                   className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
//                   onClick={() => {
//                     handleAddFirst(selected);
//                     closeModal();
//                     setSidebarOpen(true);
//                   }}
//                 >
//                   Add to Bundle
//                 </button>
//                 <button
//                   className="px-4 py-2 border border-green-400 text-green-700 rounded-lg hover:bg-green-50"
//                   onClick={closeModal}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// src/pages/Landing/CatalogStandalone.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fakeApi } from "../../utils/fakeApi";
import type { Product as BaseProduct } from "../../data/sampleProducts";
import { sampleProducts } from "../../data/sampleProducts";
import { useBundleStore, type BundleItem as BaseBundleItem } from "../../store/useStore";

// Extend types locally to include optional PV if present in your data
type Product = BaseProduct & {
  pv?: number; // per-unit PV, optional
};

type BundleItem = BaseBundleItem & {
  pv?: number; // per-unit PV, optional
};

export default function CatalogStandalone() {
  // Filters
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const { addItem, items, removeItem, clearBundle } = useBundleStore();

  // Load products from fakeApi
  const [products, setProducts] = useState<Product[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const data = (await fakeApi.getProducts()) as Product[];
        if (cancel) return;
        setProducts(data);
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Failed to load products";
        setErr(`Failed to load products: ${msg}`);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  // Categories derived from local sampleProducts
  const categories = useMemo(() => {
    const set = new Set(sampleProducts.map((p) => p.category));
    return Array.from(set);
  }, []);

  // Derived numeric range
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
      list = list.filter((p) => (p.mrp ?? 0) >= min && (p.mrp ?? 0) <= (max || Infinity));
    }
    return list;
  }, [products, term, category, priceRange]);

  // qty map
  const qtyMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const i of items) map[i.productId] = i.qty;
    return map;
  }, [items]);

  // Helpers for totals
  const lineMRP = (i: BundleItem) => (i.mrp ?? 0) * i.qty;
  const lineDP = (i: BundleItem) => (i.dp ?? 0) * i.qty;

  const totalMRP = items.reduce((sum, i) => sum + lineMRP(i as BundleItem), 0);
  const totalDP = items.reduce((sum, i) => sum + lineDP(i as BundleItem), 0);

  // PV calculation with per-product override:
  // - Sum explicit PV where available: sum(i.qty * i.pv)
  // - For items without pv, sum their DP and apply standard formula on that DP portion only.
  const { pvExplicit, dpForFormula } = useMemo(() => {
    let pvExplicitSum = 0;
    let dpFormulaSum = 0;
    for (const i of items as BundleItem[]) {
      if (typeof i.pv === "number" && Number.isFinite(i.pv)) {
        pvExplicitSum += i.pv * i.qty;
      } else {
        dpFormulaSum += (i.dp ?? 0) * i.qty;
      }
    }
    return { pvExplicit: pvExplicitSum, dpForFormula: dpFormulaSum };
  }, [items]);

  const pvFromFormulaRaw = Math.floor(dpForFormula / 1000) * 100;
  const totalPVRaw = pvExplicit + pvFromFormulaRaw;
  const totalPV = Math.min(totalPVRaw, 4000);

  // Modal state
  const [selected, setSelected] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  const onProductClick = (p: Product) => {
    setSelected(p);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
  };

  // Add/Inc/Dec must propagate PV if present
  const handleAddFirst = (p: Product) => {
    addItem({
      productId: p.id,
      title: p.name,
      qty: 1,
      mrp: p.mrp ?? 0,
      dp: p.dp ?? 0,
      pv: p.pv, // propagate pv if present
    } as BundleItem);
  };

  const inc = (p: Product) => {
    addItem({
      productId: p.id,
      title: p.name,
      qty: 1,
      mrp: p.mrp ?? 0,
      dp: p.dp ?? 0,
      pv: p.pv,
    } as BundleItem);
  };

  const dec = (p: Product) => {
    const item = items.find((i) => i.productId === p.id) as BundleItem | undefined;
    if (!item) return;
    if (item.qty <= 1) removeItem(p.id);
    else {
      removeItem(p.id);
      addItem({
        productId: p.id,
        title: p.name,
        qty: item.qty - 1,
        mrp: p.mrp ?? 0,
        dp: p.dp ?? 0,
        pv: p.pv,
      } as BundleItem);
    }
  };

  // Close modal on Escape
  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === "Escape") closeModal();
    }
    if (showModal) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showModal]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
      <header className="w-full bg-white shadow-md py-2 px-4 flex items-center gap-3 flex-shrink-0">
        <form onSubmit={(e) => e.preventDefault()} className="flex-1 flex items-center bg-green-50 rounded-lg shadow-inner">
          <input
            type="text"
            placeholder="Search products..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full px-3 py-2 bg-transparent outline-none text-gray-700"
          />
        </form>

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

        <button
          onClick={() => setSidebarOpen(true)}
          className="ml-auto bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700 transition shrink-0"
        >
          🛒 Bundle
        </button>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {err && <div className="text-red-600 mb-3">{err}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
            {filtered.map((p) => {
              const qty = qtyMap[p.id] || 0;
              return (
                <div
                  key={p.id}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                  onClick={() => onProductClick(p)}
                >
                  <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                  <h2 className="text-lg font-bold text-green-800">{p.name}</h2>
                  <p className="text-sm text-gray-600 mb-1">{p.category}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-800">
                      MRP: <span className="font-semibold text-green-700">₹{p.mrp ?? 0}</span>
                    </p>
                    <p className="text-sm text-gray-800">
                      DP: <span className="font-semibold text-green-700">₹{p.dp ?? 0}</span>
                    </p>
                    {typeof p.pv === "number" && (
                      <p className="text-sm text-gray-800">
                        PV: <span className="font-semibold text-green-700">{p.pv}</span>
                      </p>
                    )}
                  </div>

                  {qty === 0 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddFirst(p);
                      }}
                      className="mt-3 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                    >
                      Add to Bundle
                    </button>
                  ) : (
                    <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dec(p);
                        }}
                        className="px-3 py-2 text-green-700 hover:bg-green-100 rounded-l-lg"
                      >
                        −
                      </button>
                      <span className="px-3 py-2 font-semibold text-green-800">{qty}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          inc(p);
                        }}
                        className="px-3 py-2 text-green-700 hover:bg-green-100 rounded-r-lg"
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

        {sidebarOpen && (
          <aside className="absolute right-0 top-0 h-full w-80 bg-white border-l border-green-200 shadow-2xl p-5 flex flex-col z-50 animate-slideIn">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-green-800">Your Bundle</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-red-500 hover:text-red-600 text-lg font-bold">
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-gray-500 text-sm">No items added yet</p>
              ) : (
                <ul className="space-y-4">
                  {(items as BundleItem[]).map((i) => (
                    <li key={i.productId} className="flex justify-between items-start text-sm">
                      <div className="pr-2">
                        <p className="font-medium text-green-700">
                          {i.title} × {i.qty}
                        </p>
                        <p className="text-gray-700">
                          DP: ₹{(i.dp ?? 0).toLocaleString()} • MRP: ₹{(i.mrp ?? 0).toLocaleString()}
                          {typeof i.pv === "number" && (
                            <> • PV: {i.pv}</>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(i.productId)}
                        className="text-red-500 hover:text-red-700 font-bold leading-none"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="mt-5 border-t pt-3 space-y-1 text-sm">
                <p className="font-semibold text-green-700">Overall DP: ₹{totalDP.toLocaleString()}</p>
                <p className="font-semibold text-green-700">Overall MRP: ₹{totalMRP.toLocaleString()}</p>
                <p className={`font-semibold ${totalPVRaw > 4000 ? "text-red-600" : "text-green-700"}`}>
                  Final PV: {totalPV.toLocaleString()} / 4000
                </p>
              </div>
            )}

            {items.length > 0 && (
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    setTimeout(() => navigate("/bundle/review"), 300);
                  }}
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
        )}
      </div>

      {/* Product Detail Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeModal}>
          <div className="bg-white max-w-lg w-[90%] rounded-xl shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img src={selected.image} alt={selected.name} className="w-full h-56 object-cover" />
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-800 rounded-full px-2 py-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold text-green-800">{selected.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{selected.category}</p>

              <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                <div className="bg-green-50 border border-green-200 rounded p-2">
                  <div className="text-gray-600">MRP</div>
                  <div className="font-semibold text-green-700">₹{selected.mrp ?? 0}</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-2">
                  <div className="text-gray-600">DP</div>
                  <div className="font-semibold text-green-700">₹{selected.dp ?? 0}</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-2">
                  <div className="text-gray-600">PV</div>
                  <div className="font-semibold text-green-700">
                    {typeof selected.pv === "number" ? selected.pv : "—"}
                  </div>
                </div>
              </div>

              <p className="mt-3 text-gray-800 text-sm leading-relaxed">{selected.description}</p>

              <div className="mt-4 flex items-center gap-2">
                <button
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  onClick={() => {
                    handleAddFirst(selected);
                    closeModal();
                    setSidebarOpen(true);
                  }}
                >
                  Add to Bundle
                </button>
                <button
                  className="px-4 py-2 border border-green-400 text-green-700 rounded-lg hover:bg-green-50"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
