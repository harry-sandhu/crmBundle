// src/layouts/UserLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import BundleSidebar from "../components/BundleSidebar";

export default function UserLayout() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50">
      <Navbar
        onSearch={setSearchTerm}
        onCategoryChange={setCategory}
        onPriceChange={setPriceRange}
      />
      <div className="flex flex-1">
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet context={{ searchTerm, category, priceRange }} />
        </main>
        <BundleSidebar />
      </div>
    </div>
  );
}
