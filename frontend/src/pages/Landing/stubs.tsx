import { Link } from "react-router-dom";

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

export function TeamAll() {
  return (
    <Shell title="All Team">
      List all members in your downline with filters, pagination, and export here.
    </Shell>
  );
}

export function TeamTree() {
  return (
    <Shell title="View Tree">
      Visualize your referral hierarchy; integrate with your /api/tree/:refCode endpoint later.
    </Shell>
  );
}

export function TeamSummary() {
  return (
    <Shell title="Team Summary">
      Show aggregates like total team size, active/inactive counts, and growth over time.
    </Shell>
  );
}

export function TeamReferral() {
  return (
    <Shell title="Referral Team">
      Display users directly referred by you with join dates and statuses.
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
