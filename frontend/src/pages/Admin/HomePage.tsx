// frontend/src/pages/Admin/HomePage.tsx

import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600">
        Welcome to the Admin Home Page. Here you can manage users, products, and reports.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded-xl text-center">
          <h2 className="font-semibold text-lg mb-2">Users</h2>
          <p>View and manage user accounts.</p>
        </div>

        <div className="p-4 bg-white shadow rounded-xl text-center">
          <h2 className="font-semibold text-lg mb-2">Products</h2>
          <p>Monitor and update product listings.</p>
        </div>

        <div className="p-4 bg-white shadow rounded-xl text-center">
          <h2 className="font-semibold text-lg mb-2">Reports</h2>
          <p>Analyze business performance and growth.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
