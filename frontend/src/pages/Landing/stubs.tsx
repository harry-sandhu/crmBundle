import { Link } from "react-router-dom";
import ReferralTree from "../../components/ReferralTree";
import MyReferralTree from "../../components/MyReferralTree";
import TeamSummaryPage from "../../components/TeamSummary"; 
import MyTeamSummaryPage from "../../components/MyTeamSummary";

function Shell({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <Link to="/dashboard" className="text-sm text-green-700 underline">
          Back to Dashboard
        </Link>
      </div>
      <div className="mt-3 text-gray-700">{children ?? "To be implemented."}</div>
    </div>
  );
}

// ✅ Binary Tree View (ReferralTree)
export function TeamAll() {
  return (
    <Shell title="All Team">
      <ReferralTree />
    </Shell>
  );
}

// ✅ Original API Tree View (MyReferralTree)
export function TeamTree() {
  return (
    <Shell title="View Tree">
      <MyReferralTree />
    </Shell>
  );
}

// ✅ Team Summary Page (Table View)
export function TeamSummary() {
  return (
    <Shell title="Team Summary">
      <TeamSummaryPage />
    </Shell>
  );
}

// ✅ Referral Team — Now shows same TeamSummaryPage table
export function TeamReferral() {
  return (
    <Shell title="Referral Team">
      <MyTeamSummaryPage />
    </Shell>
  );
}

export function TeamGeneration() {
  return (
    <Shell title="Generation List">
      Group members by generation levels (L1, L2, L3...) with counts and totals.
    </Shell>
  );
}

export function CommissionDashboard() {
  return (
    <Shell title="Earning Dashboard">
      Charts and KPIs for earnings; hook up to wallet/commissions endpoints later.
    </Shell>
  );
}

export function CommissionEarnings() {
  return (
    <Shell title="My Earnings">
      Tabular earnings with filters and downloadable statements.
    </Shell>
  );
}
