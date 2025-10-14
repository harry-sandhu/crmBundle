// src/pages/Dashboard/DashboardHome.tsx
import { useEffect, useState } from "react";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  refCode: string;
  joinedAt?: string;
};

export default function DashboardHome() {
  const [loading, setLoading] = useState(false);

  // Dashboard stats
  const [totalMembers, setTotalMembers] = useState(0);
  const [myReferralJoined, setMyReferralJoined] = useState(0);
  const [totalEarning, setTotalEarning] = useState(0); // Fill later
  const [myPurchases, setMyPurchases] = useState(0);
  const [myRefCode, setMyRefCode] = useState<string>("");

  // Team table (users who joined via my referral code or via my users' referral code)
  const [team, setTeam] = useState<TeamMember[]>([]);

  // TODO: replace with real APIs
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // Example: fetch from /api/me/dashboard
        // const res = await api.get('/api/me/dashboard');
        // const d = res.data;
        // Mocked data for now
        const d = {
          totalMembers: 23,
          myReferralJoined: 7,
          totalEarning: 648,
          myPurchases: 92096,
          myRefCode: "A1001",
          team: [
            { id: "u1", name: "Sakshi Fulargi", email: "sakshi@example.com", phone: "9999999999", refCode: "R1005", joinedAt: "2025-09-10" },
            { id: "u2", name: "Aman Verma", email: "aman@example.com", phone: "8888888888", refCode: "R1006", joinedAt: "2025-09-12" },
          ],
        };
        if (!mounted) return;
        setTotalMembers(d.totalMembers);
        setMyReferralJoined(d.myReferralJoined);
        setTotalEarning(d.totalEarning);
        setMyPurchases(d.myPurchases);
        setMyRefCode(d.myRefCode);
        setTeam(d.team);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-5">Welcome!</h1>

      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card title="Total Registered Members" value={loading ? "..." : totalMembers.toLocaleString()} />
        <Card title="Referred Users Joined" value={loading ? "..." : myReferralJoined.toLocaleString()} />
        <Card title="Total Earning" value={loading ? "..." : `₹${totalEarning.toLocaleString()}`} />
        <Card title="My Purchases" value={loading ? "..." : `₹${myPurchases.toLocaleString()}`} />
      </div>

      {/* Referral code + copy */}
      <div className="mt-5 bg-white border rounded-xl p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">My Referral Code</p>
            <p className="text-lg font-semibold text-green-700">{myRefCode || "-"}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(myRefCode || "")}
              className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Copy Code
            </button>
          </div>
        </div>
      </div>

      {/* Team table */}
      <div className="mt-5 bg-white border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">My Team (via my users’ referral codes)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-left px-3 py-2">Email</th>
                <th className="text-left px-3 py-2">Phone</th>
                <th className="text-left px-3 py-2">Ref Code</th>
                <th className="text-left px-3 py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-3 py-3" colSpan={5}>Loading...</td></tr>
              ) : team.length === 0 ? (
                <tr><td className="px-3 py-3" colSpan={5}>No team members found.</td></tr>
              ) : (
                team.map((m) => (
                  <tr key={m.id} className="border-t">
                    <td className="px-3 py-2">{m.name}</td>
                    <td className="px-3 py-2">{m.email}</td>
                    <td className="px-3 py-2">{m.phone || "-"}</td>
                    <td className="px-3 py-2">{m.refCode}</td>
                    <td className="px-3 py-2">{m.joinedAt || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-green-700 mt-2">{value}</p>
    </div>
  );
}
