// frontend/src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import ReferralTree from "../../components/ReferralTree"; // ✅ Import your tree component

interface UserProfile {
  name: string;
  email: string;
  refCode: string;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showTree, setShowTree] = useState(false);

  useEffect(() => {
    // ✅ Load user data from localStorage
    const stored = localStorage.getItem("userInfo");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProfile({
          name: parsed.name || "User",
          email: parsed.email || "N/A",
          refCode: parsed.refCode || "N/A",
        });
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
  }, []);

  if (!profile)
    return (
      <div className="text-center mt-20 text-red-500">
        ⚠️ No user data found. Please sign up or log in first.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-6">
      {/* ✅ Header */}
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        Welcome, {profile.name} 👋
      </h1>

      {/* ✅ Profile Info */}
      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold text-green-800 mb-2">
          Profile Info
        </h2>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p className="mt-2 text-green-700 font-semibold">
          <strong>Referral ID:</strong>{" "}
          <span className="font-mono bg-green-50 border border-green-200 rounded px-2 py-1">
            {profile.refCode}
          </span>
        </p>

        {/* ✅ Tree Toggle Button */}
        <button
          onClick={() => setShowTree((prev) => !prev)}
          className={`mt-5 px-5 py-2 rounded-lg text-white font-semibold shadow-md transition ${
            showTree
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gradient-to-r from-yellow-400 via-orange-400 to-green-500 hover:from-orange-400 hover:to-green-600"
          }`}
        >
          {showTree ? "Hide Tree 🌳" : "View My Tree 🌿"}
        </button>
      </div>

      {/* ✅ Optional: Some placeholder */}
      <div className="border-t mt-6 pt-4">
        <h2 className="text-xl font-semibold text-green-800 mb-3">
          Your Recent Bundles
        </h2>
        <div className="text-gray-500">
          No bundles yet — start creating one!
        </div>
      </div>

      {/* ✅ Conditional Tree Display */}
      {showTree && (
        <div className="mt-10">
          <ReferralTree />
        </div>
      )}
    </div>
  );
}
