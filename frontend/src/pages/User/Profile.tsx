
// frontend/src/pages/User/Profile.tsx (or your current Dashboard.tsx renamed to a proper Profile page)

import { useEffect, useState } from "react";
import api from "../../utils/api";


type UserProfile = {
  name: string;
  email: string;
  phone?: string | null;
  isVerified: boolean;
  refCode: string;
  referredBy?: string | null;
  referrerName?: string | null;
 
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
        <InfoCard label="My Sponsor ID" value={profile.refCode} mono />
        <InfoCard label="Referred By (ID)" value={profile.referredBy || "—"} mono />
        <InfoCard label="Referrer Name" value={profile.referrerName || "—"} />
        
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

     
    </div>
  );
}
