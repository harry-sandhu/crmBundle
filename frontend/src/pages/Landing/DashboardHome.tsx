import { useEffect, useState } from "react";
import api from "../../utils/api";

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

  const [totalUsers, setTotalUsers] = useState(0);          // NEW: global
  const [totalMembers, setTotalMembers] = useState(0);      // descendants
  const [myReferralJoined, setMyReferralJoined] = useState(0);
  const [totalEarning, setTotalEarning] = useState(0);
  const [myPurchases, setMyPurchases] = useState(0);
  const [myRefCode, setMyRefCode] = useState<string>("");

  const [team, setTeam] = useState<TeamMember[]>([]);

 useEffect(() => {
  let mounted = true;
  (async () => {
    setLoading(true);
    try {
      // STEP 1: Fetch basic dashboard + team
      const [statsRes, teamRes] = await Promise.all([
        api.get("/api/me/dashboard"),
        api.get("/api/me/team?mode=descendants"),
      ]);

      if (!mounted) return;

      const sd = statsRes.data?.data || {};
      setTotalUsers(sd.totalUsers ?? 0);
      setTotalMembers(sd.totalMembers ?? 0);
      setMyReferralJoined(sd.myReferralJoined ?? 0);
      setMyPurchases(sd.myPurchases ?? 0);
      setMyRefCode(sd.myRefCode ?? "");
      setTeam(teamRes.data?.data ?? []);

      // STEP 2: Fetch total earnings using refCode (if available)
      if (sd.myRefCode) {
        const earnRes = await api.get(`/api/earnings/dashboard/${sd.myRefCode}`);
        const totals = earnRes.data?.data?.totals || {};
        const totalEarningValue =
          (totals.pvCommission || 0) +
          (totals.directIncome || 0) +
          (totals.matchingIncome || 0);
        setTotalEarning(totalEarningValue);
      }
    } catch (e) {
      console.error("Dashboard load error:", e);
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card title="All Registered Users" value={loading ? "..." : totalUsers.toLocaleString()} />      {/* NEW */}
        <Card title="Total In My Network" value={loading ? "..." : totalMembers.toLocaleString()} />
        <Card title="Referred Users Joined" value={loading ? "..." : myReferralJoined.toLocaleString()} />
        <Card title="Total Earning" value={loading ? "..." : `₹${totalEarning.toLocaleString()}`} />
        <Card title="My Purchases" value={loading ? "..." : `₹${myPurchases.toLocaleString()}`} />
      </div>

      {/* Referral code + copy */}
      <div className="mt-5 bg-white border rounded-xl p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">My Sponsor ID</p>
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
          <h2 className="text-lg font-bold text-gray-800">My Team (via my Sponsor ID)</h2>
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
