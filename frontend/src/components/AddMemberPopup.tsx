// import React, { useState } from "react";
// import axios from "../utils/api";
// import { getApiErrorMessage } from "../utils/handleApiError";

// interface SignupResponse {
//   success: boolean;
//   message: string;
//   data?: {
//     id: string;
//     name: string;
//     email: string;
//     refCode: string;
//     regamount?: number;
//   };
// }

// interface AddMemberPopupProps {
//   refCode: string;
//   onClose: () => void;
//   onAdded?: () => void; // optional callback for refreshing TeamSummary
// }

// export default function AddMemberPopup({ refCode, onClose, onAdded }: AddMemberPopupProps) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [regamount, setRegAmount] = useState<number | "">("");
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [generatedPass, setGeneratedPass] = useState("");
//   const [showConfirm, setShowConfirm] = useState(false);

//   // ✅ Auto-generate password like "name@1234"
//   const generatePassword = (name: string) => {
//     const rand = Math.floor(1000 + Math.random() * 9000);
//     const safeName = name.trim().split(" ")[0] || "user";
//     return `${safeName}@${rand}`;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErr("");
//     setLoading(true);

//     if (!refCode) {
//       setErr("Referral code missing.");
//       setLoading(false);
//       return;
//     }

//     if (!regamount || regamount <= 0) {
//       setErr("Please enter a valid registration amount.");
//       setLoading(false);
//       return;
//     }

//     const password = generatePassword(name);
//     setGeneratedPass(password);

//     try {
//       const res = await axios.post<SignupResponse>("/auth/signup", {
//         name,
//         email,
//         phone: mobile,
//         password,
//         referralCode: refCode,
//         regamount,
//       });

//       if (res.data.success && res.data.data) {
//         setShowConfirm(true); // ✅ Show confirmation popup
//       } else {
//         setErr(res.data.message || "Failed to add member.");
//       }
//     } catch (error) {
//       setErr(getApiErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirm = () => {
//     setShowConfirm(false);
//     if (onAdded) onAdded(); // ✅ Refresh table in TeamSummary
//     onClose(); // ✅ Close popup
//   };

//   return (
//     <>
//       {/* 🌿 Add Member Popup */}
//       <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-40">
//         <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
//           <h2 className="text-xl font-bold text-green-700 mb-2 text-center">
//             ➕ Add New Team Member
//           </h2>
//           <p className="text-sm text-center text-gray-600 mb-4">
//             Referred by{" "}
//             <span className="font-mono text-green-700">{refCode}</span>
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-3">
//             <input
//               type="text"
//               required
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Full Name"
//               className="w-full px-4 py-2 border border-green-300 rounded focus:ring-2 focus:ring-green-400"
//             />
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Email Address"
//               className="w-full px-4 py-2 border border-green-300 rounded focus:ring-2 focus:ring-green-400"
//             />
//             <input
//               type="tel"
//               required
//               value={mobile}
//               onChange={(e) => setMobile(e.target.value)}
//               placeholder="Mobile Number"
//               className="w-full px-4 py-2 border border-green-300 rounded focus:ring-2 focus:ring-green-400"
//             />
//             <input
//               type="number"
//               required
//               value={regamount}
//               onChange={(e) =>
//                 setRegAmount(e.target.value === "" ? "" : Number(e.target.value))
//               }
//               placeholder="Registration Amount"
//               className="w-full px-4 py-2 border border-green-300 rounded focus:ring-2 focus:ring-green-400"
//             />

//             <p className="text-xs text-gray-500 mt-1">
//               🔐 Password will be auto-generated (e.g. <b>name@1234</b>).  
//               You can reset it later via “Forgot Password”.
//             </p>

//             {err && <p className="text-red-600 text-center">{err}</p>}

//             <div className="flex gap-3 pt-2">
//               <button
//                 disabled={loading}
//                 type="submit"
//                 className={`flex-1 py-2 rounded-lg font-semibold transition ${
//                   loading
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-green-600 hover:bg-green-700 text-white"
//                 }`}
//               >
//                 {loading ? "Adding..." : "Add Member"}
//               </button>

//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* 🎉 Confirmation Popup */}
//       {showConfirm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
//           <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-sm text-center">
//             <h3 className="text-xl font-bold text-green-700 mb-3">
//               🎉 Member Added Successfully!
//             </h3>
//             <p className="text-gray-700 mb-2">
//               New member <b>{name}</b> has been registered.
//             </p>
//             <p className="text-sm text-green-800 bg-green-50 border border-green-200 p-3 rounded-md mb-4">
//               Temporary Password: <b>{generatedPass}</b>
//             </p>
//             <p className="text-xs text-gray-500 mb-5">
//               Please share this password with the user.  
//               They can reset it later via “Forgot Password”.
//             </p>
//             <button
//               onClick={handleConfirm}
//               className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md transition"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

import React, { useState } from "react";
import axios from "../utils/api";
import { getApiErrorMessage } from "../utils/handleApiError";

interface SignupResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    email: string;
    refCode: string;
  };
}

interface AddMemberPopupProps {
  refCode: string;
  onClose: () => void;
  onAdded?: () => void; // optional callback for refreshing TeamSummary
}

export default function AddMemberPopup({ refCode, onClose, onAdded }: AddMemberPopupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedPass, setGeneratedPass] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ Auto-generate password like "name@1234"
  const generatePassword = (name: string) => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    const safeName = name.trim().split(" ")[0] || "user";
    return `${safeName}@${rand}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    if (!refCode) {
      setErr("Referral code missing.");
      setLoading(false);
      return;
    }

    const password = generatePassword(name);
    setGeneratedPass(password);

    try {
      const res = await axios.post<SignupResponse>("/auth/signup", {
        name,
        email,
        phone: mobile,
        password,
        referralCode: refCode,
      });

      if (res.data.success && res.data.data) {
        setShowConfirm(true); // ✅ Show confirmation popup
      } else {
        setErr(res.data.message || "Failed to add member.");
      }
    } catch (error) {
      setErr(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    if (onAdded) onAdded(); // ✅ Refresh table in TeamSummary
    onClose(); // ✅ Close popup
  };

  return (
    <>
      {/* 🌿 Add Member Popup */}
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-40">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
          <h2 className="text-xl font-bold text-green-700 mb-2 text-center">
            ➕ Add New Team Member
          </h2>
          <p className="text-sm text-center text-gray-600 mb-4">
            Referred by{" "}
            <span className="font-mono text-green-700">{refCode}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-2 border border-green-300 rounded focus:ring-2 focus:ring-green-400"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full px-4 py-2 border border-green-300 rounded focus:ring-2 focus:ring-green-400"
            />
            <input
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Mobile Number"
              className="w-full px-4 py-2 border border-green-300 rounded focus:ring-2 focus:ring-green-400"
            />

            <p className="text-xs text-gray-500 mt-1">
              🔐 Password will be auto-generated (e.g. <b>name@1234</b>).  
              You can reset it later via “Forgot Password”.
            </p>

            {err && <p className="text-red-600 text-center">{err}</p>}

            <div className="flex gap-3 pt-2">
              <button
                disabled={loading}
                type="submit"
                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {loading ? "Adding..." : "Add Member"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 🎉 Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-sm text-center">
            <h3 className="text-xl font-bold text-green-700 mb-3">
              🎉 Member Added Successfully!
            </h3>
            <p className="text-gray-700 mb-2">
              New member <b>{name}</b> has been registered.
            </p>
            <p className="text-sm text-green-800 bg-green-50 border border-green-200 p-3 rounded-md mb-4">
              Temporary Password: <b>{generatedPass}</b>
            </p>
            <p className="text-xs text-gray-500 mb-5">
              Please share this password with the user.  
              They can reset it later via “Forgot Password”.
            </p>
            <button
              onClick={handleConfirm}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
