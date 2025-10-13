import User from "../models/User";

/**
 * Generate a structured unique referral code.
 * Supports millions of users under GroLife Supro Imo.
 *
 * Format: GROLIFE-<SERIES>-<SEQUENCE>
 * Example: GROLIFE-A-000001
 */
export async function generateRefCode(parentRef?: string): Promise<string> {
  const COMPANY_PREFIX = "GROLIFE";

  // If no parent — this is company root
  if (!parentRef) return `${COMPANY_PREFIX}-ROOT-000000`;

  // Determine series prefix from parent
  let series = "X"; // default
  const parent = await User.findOne({ refCode: parentRef });

  if (parent) {
    if (parent.refCode.includes("-A-")) series = "A";
    else if (parent.refCode.includes("-B-")) series = "B";
    else if (parent.refCode.includes("-C-")) series = "C";
    else if (parent.refCode.includes("ROOT")) series = String.fromCharCode(65 + Math.floor(Math.random() * 3)); // A/B/C random for top children
    else {
      // inherit parent’s prefix
      const match = parent.refCode.match(/GROLIFE-([A-Z])-?/);
      if (match && match[1]) series = match[1];
    }
  }

  // Get count of users under this series
  const count = await User.countDocuments({ refCode: { $regex: `^${COMPANY_PREFIX}-${series}-` } });

  const seqNum = String(count + 1).padStart(6, "0");
  return `${COMPANY_PREFIX}-${series}-${seqNum}`;
}
