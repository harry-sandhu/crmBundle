import { IOrder } from "../models/Order";

// 1 PV = ₹1.2 conversion rate
export const PV_RATE = 1.2;

// Direct referral rates: 12% → 6% → 3% → 2% fallback for deeper ancestors
export const REFERRAL_RATES = [0.12, 0.06, 0.03];
export const REFERRAL_FALLBACK_RATE = 0.02;

/**
 * 🔹 calculatePV(order)
 * Buyer earns PV based on total DP (₹1000 DP = 100 PV = ₹120)
 */
export function calculatePV(order: IOrder) {
  const totalDP = order.items.reduce((sum, i) => sum + i.dp * i.qty, 0);
  const pv = Math.floor(totalDP / 1000) * 100; // round down to nearest 100 PV
  const amount = pv * PV_RATE; // convert PV → money
  return { totalDP, pv, amount };
}

/**
 * 🔹 calculateDirectIncome(order)
 * Parent (referredBy) gets 12% of child’s first order DP
 */
export function calculateDirectIncome(order: IOrder) {
  const totalDP = order.items.reduce((sum, i) => sum + i.dp * i.qty, 0);
  const income = totalDP * 0.12;
  return income;
}

/**
 * 🔹 calculateMatchingIncome(order, ancestors)
 * Every ancestor earns based on level:
 *   - 1st level (parent) → 12%
 *   - 2nd level (grandparent) → 6%
 *   - 3rd level → 3%
 *   - 4th+ → 2%
 */
export function calculateMatchingIncome(order: IOrder, ancestors: string[]) {
  const totalDP = order.items.reduce((sum, i) => sum + i.dp * i.qty, 0);

  // Distribute earnings to each ancestor level
  const matches = ancestors.map((ref, i) => {
    const percent = REFERRAL_RATES[i] ?? REFERRAL_FALLBACK_RATE;
    const income = totalDP * percent;
    return {
      ref,       // ancestor refCode
      level: i + 1,
      percent,
      income,
    };
  });

  return matches;
}
