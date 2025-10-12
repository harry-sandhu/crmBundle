// src/components/Navbar.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sampleProducts } from "../data/sampleProducts";

interface NavbarProps {
  onSearch: (term: string) => void;
  onCategoryChange: (category: string) => void;
  onPriceChange: (range: [number, number]) => void;
}

export default function Navbar({
  onSearch,
  onCategoryChange,
  onPriceChange,
}: NavbarProps) {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(term);
  };

  const handlePriceUpdate = () => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || 0;
    onPriceChange([min, max]);
  };
  const categorySet = new Set(sampleProducts.map(p => p.category));
  const categories = Array.from(categorySet);

  return (
    <header className="w-full bg-white shadow-md py-3 px-6 flex flex-wrap items-center justify-between">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/catalog")}
      >
        <img src="/finallogo.jpg" alt="Logo" className="h-10 w-10 rounded-full" />
        <h1 className="text-lg font-extrabold text-green-700">BundleMaker</h1>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex-1 mx-6 flex items-center bg-green-50 rounded-lg shadow-inner"
      >
        <input
          type="text"
          placeholder="Search products..."
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            onSearch(e.target.value);
          }}
          className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-700"
        />
      </form>

      {/* Filters */}
      <div className="flex items-center gap-3 text-sm">
        {/* <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            onCategoryChange(e.target.value);
          }}
          className="border border-green-300 rounded-md px-3 py-1 bg-white text-green-700"
        >
          <option value="">All Categories</option>
          <option value="Fruits">Fruits</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Grains">Grains</option>
        </select> */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            onCategoryChange(e.target.value);
          }}
          className="border border-green-300 rounded-md px-3 py-1 bg-white text-green-700"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
    </select>

        <input
          type="number"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          onBlur={handlePriceUpdate}
          className="w-20 border border-green-300 rounded-md px-2 py-1 text-sm"
        />
        <input
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          onBlur={handlePriceUpdate}
          className="w-20 border border-green-300 rounded-md px-2 py-1 text-sm"
        />

        <button
          onClick={() => navigate("/bundle/review")}
          className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition"
        >
          🛒 Bundle
        </button>
      </div>
    </header>
  );
}
