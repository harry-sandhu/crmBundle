// // frontend/src/pages/Dashboard.tsx
// import { useEffect, useState } from "react";
// import ReferralTree from "../../components/ReferralTree"; // ✅ Import your tree component

// interface UserProfile {
//   name: string;
//   email: string;
//   refCode: string;
// }

// export default function Dashboard() {
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [showTree, setShowTree] = useState(false);

//   useEffect(() => {
//     // ✅ Load user data from localStorage
//     const stored = localStorage.getItem("userInfo");
//     if (stored) {
//       try {
//         const parsed = JSON.parse(stored);
//         setProfile({
//           name: parsed.name || "User",
//           email: parsed.email || "N/A",
//           refCode: parsed.refCode || "N/A",
//         });
//       } catch (error) {
//         console.error("Error parsing localStorage data:", error);
//       }
//     }
//   }, []);

//   if (!profile)
//     return (
//       <div className="text-center mt-20 text-red-500">
//         ⚠️ No user data found. Please sign up or log in first.
//       </div>
//     );

//   return (
//     <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-6">
//       {/* ✅ Header */}
//       <h1 className="text-3xl font-bold text-green-700 mb-4">
//         Welcome, {profile.name} 👋
//       </h1>

//       {/* ✅ Profile Info */}
//       <div className="border-t pt-4">
//         <h2 className="text-xl font-semibold text-green-800 mb-2">
//           Profile Info
//         </h2>
//         <p>
//           <strong>Email:</strong> {profile.email}
//         </p>
//         <p className="mt-2 text-green-700 font-semibold">
//           <strong>Referral ID:</strong>{" "}
//           <span className="font-mono bg-green-50 border border-green-200 rounded px-2 py-1">
//             {profile.refCode}
//           </span>
//         </p>

//         {/* ✅ Tree Toggle Button */}
//         <button
//           onClick={() => setShowTree((prev) => !prev)}
//           className={`mt-5 px-5 py-2 rounded-lg text-white font-semibold shadow-md transition ${
//             showTree
//               ? "bg-red-500 hover:bg-red-600"
//               : "bg-gradient-to-r from-yellow-400 via-orange-400 to-green-500 hover:from-orange-400 hover:to-green-600"
//           }`}
//         >
//           {showTree ? "Hide Tree 🌳" : "View My Tree 🌿"}
//         </button>
//       </div>

      


//       {/* ✅ Conditional Tree Display */}
//       {showTree && (
//         <div className="mt-10">
//           <ReferralTree />
//         </div>
//       )}
//     </div>
//   );
// }
// frontend/src/pages/User/Profile.tsx (or your current Dashboard.tsx renamed to a proper Profile page)

import { useEffect, useState } from "react";
import api from "../../utils/api";
import ReferralTree from "../../components/ReferralTree";

type UserProfile = {
  name: string;
  email: string;
  phone?: string | null;
  isVerified: boolean;
  refCode: string;
  referredBy?: string | null;
  referrerName?: string | null;
  regamount?: number | null;
  createdAt?: string | null;
  ancestors?: string[];
};

function InfoCard({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow transition">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-slate-800 ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTree, setShowTree] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const resp = await api.get("/api/me/profile");
        if (!mounted) return;
        setProfile(resp.data?.data as UserProfile);
      } catch {
        // Optionally toast error
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading && !profile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse h-6 w-40 bg-slate-200 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center mt-16 text-red-500">
        No profile found. Please re-login.
      </div>
    );
  }

  const joined =
    profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—";

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl md:text-3xl font-bold text-green-700">
          My Profile
        </h1>
        <p className="text-slate-500">Personal details </p>
      </div>

      {/* Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard label="Name" value={profile.name} />
        <InfoCard label="Email" value={profile.email} />
        <InfoCard label="Phone" value={profile.phone || "—"} />
        <InfoCard label="Verified" value={profile.isVerified ? "Yes" : "No"} />
        <InfoCard label="My Referral ID" value={profile.refCode} mono />
        <InfoCard label="Referred By (ID)" value={profile.referredBy || "—"} mono />
        <InfoCard label="Referrer Name" value={profile.referrerName || "—"} />
        <InfoCard
          label="Registration Amount"
          value={
            profile.regamount != null ? `₹${profile.regamount.toLocaleString()}` : "—"
          }
        />
        <InfoCard label="Joined On" value={joined} />
      </div>

      {/* Upline IDs */}
      {profile.ancestors?.length ? (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Upline IDs</h2>
          <div className="flex flex-wrap gap-2">
            {profile.ancestors.map((code) => (
              <span
                key={code}
                className="font-mono text-xs bg-green-50 border border-green-200 rounded px-2 py-1 text-green-800"
              >
                {code}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Tree CTA + Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-green-800">My Team Tree</h2>
          <button
            onClick={() => setShowTree((v) => !v)}
            className={`px-4 py-2 rounded-lg text-white font-semibold shadow-md transition ${
              showTree
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {showTree ? "Hide Tree" : "View My Tree"}
          </button>
        </div>

        {showTree && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <ReferralTree />
          </div>
        )}
      </div>
    </div>
  );
}
