// // src/pages/Static/WelcomeLetter.tsx
// export default function WelcomeLetter() {
//   return (
//     <div className="bg-white border rounded-xl p-4">
//       <h2 className="text-xl font-bold mb-2">Welcome Letter</h2>
//       <p className="text-gray-700">Add your welcome letter content here.</p>
//     </div>
//   );
// }

// // src/pages/Static/ForgotPassword.tsx
// export default function ForgotPassword() {
//   return (
//     <div className="bg-white border rounded-xl p-4">
//       <h2 className="text-xl font-bold mb-2">Forgot Password</h2>
//       <p className="text-gray-700">This page will host the reset logic later.</p>
//     </div>
//   );
// }

// // src/pages/Shop/Orders.tsx
// export default function Orders() {
//   return (
//     <div className="bg-white border rounded-xl p-4">
//       <h2 className="text-xl font-bold mb-2">Orders</h2>
//       <p className="text-gray-700">Show all team members' purchases here.</p>
//     </div>
//   );
// }

// // src/pages/Shop/MyCart.tsx
// import { useNavigate } from "react-router-dom";
// export default function MyCart() {
//   const navigate = useNavigate();
//   return (
//     <div className="bg-white border rounded-xl p-4">
//       <h2 className="text-xl font-bold mb-2">My Cart</h2>
//       <button
//         onClick={() => navigate("/bundle/review")}
//         className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700"
//       >
//         Go to Review Bundle
//       </button>
//     </div>
//   );
// }

// // Team placeholders
// export const TeamAll = () => <Stub title="All Team" />;
// export const TeamTree = () => <Stub title="View Tree" />;
// export const TeamSummary = () => <Stub title="Team Summary" />;
// export const TeamReferral = () => <Stub title="Referral Team" />;
// export const TeamGeneration = () => <Stub title="Generation List" />;

// // Commission placeholders
// export const CommissionDashboard = () => <Stub title="Earning Dashboard" />;
// export const CommissionEarnings = () => <Stub title="My Earnings" />;

// function Stub({ title }: { title: string }) {
//   return (
//     <div className="bg-white border rounded-xl p-4">
//       <h2 className="text-xl font-bold mb-2">{title}</h2>
//       <p className="text-gray-700">To be implemented.</p>
//     </div>
//   );
// }
