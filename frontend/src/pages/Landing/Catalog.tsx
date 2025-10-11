// src/pages/Landing/Catalog.tsx
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { fakeApi } from "../../utils/fakeApi";
import type { Product } from "../../data/sampleProducts";
import { useBundleStore } from "../../store/useStore";

interface UserLayoutContext {
  searchTerm: string;
  category: string;
  priceRange: [number, number];
}

export default function Catalog() {
  const { searchTerm, category, priceRange } =
    useOutletContext<UserLayoutContext>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const { addItem } = useBundleStore();

  useEffect(() => {
    fakeApi.getProducts().then((data) => {
      setProducts(data);
      setFiltered(data);
    });
  }, []);

  useEffect(() => {
    let list = [...products];
    if (searchTerm)
      list = list.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (category)
      list = list.filter((p) => p.category === category);
    if (priceRange[0] || priceRange[1])
      list = list.filter(
        (p) =>
          p.price >= priceRange[0] &&
          p.price <= (priceRange[1] || Infinity)
      );
    setFiltered(list);
  }, [searchTerm, category, priceRange, products]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filtered.map((p) => (
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
          <p className="font-semibold text-green-700 mt-2">₹{p.price}</p>
          <button
            onClick={() =>
              addItem({ productId: p.id, title: p.name, qty: 1, price: p.price })
            }
            className="mt-3 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
          >
            Add to Bundle
          </button>
        </div>
      ))}
    </div>
  );
}
