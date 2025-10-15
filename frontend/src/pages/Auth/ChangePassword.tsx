
// import { useState } from "react";
// import api from "../../utils/api";
// import { useNavigate } from "react-router-dom";

// type ApiError = {
//   response?: { data?: { message?: string } };
//   message?: string;
// };

// function getErrMessage(e: unknown): string {
//   const err = e as ApiError;
//   return err?.response?.data?.message || err?.message || "Failed to change password";
// }

// export default function ChangePassword() {
//   const navigate = useNavigate();
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const canSubmit =
//     oldPassword.trim().length >= 1 &&
//     newPassword.trim().length >= 1 &&
//     newPassword === confirmNewPassword;

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!canSubmit) return;
//     setSubmitting(true);
//     try {
//       const resp = await api.post("/auth/change-password", {
//         oldPassword,
//         newPassword,
//       });
//       if (!resp.data?.success) {
//         throw new Error(resp.data?.message || "Change password failed");
//       }
//       alert("Password changed successfully. Please login again.");
//       localStorage.removeItem("token");
//       navigate("/login");
//     } catch (err: unknown) {
//       alert(getErrMessage(err));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
//       <h1 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h1>
//       <form onSubmit={onSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm text-gray-600 mb-1">Old password</label>
//           <input
//             type="password"
//             value={oldPassword}
//             onChange={(e) => setOldPassword(e.target.value)}
//             className="w-full border rounded px-3 py-2"
//             required
//             autoComplete="current-password"
//           />
//         </div>

//         <div>
//           <label className="block text-sm text-gray-600 mb-1">New password</label>
//           <input
//             type="password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             className="w-full border rounded px-3 py-2"
//             required
//             autoComplete="new-password"
//           />
//         </div>

//         <div>
//           <label className="block text-sm text-gray-600 mb-1">Re-enter new password</label>
//           <input
//             type="password"
//             value={confirmNewPassword}
//             onChange={(e) => setConfirmNewPassword(e.target.value)}
//             className="w-full border rounded px-3 py-2"
//             required
//             autoComplete="new-password"
//           />
//           {newPassword && confirmNewPassword && newPassword !== confirmNewPassword && (
//             <p className="text-xs text-red-600 mt-1">New passwords do not match.</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={!canSubmit || submitting}
//           className="w-full py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
//         >
//           {submitting ? "Updating..." : "Update Password"}
//         </button>
//       </form>
//     </div>
//   );
// }


import { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

type ApiError = {
  response?: { data?: { message?: string } };
  message?: string;
};

function getErrMessage(e: unknown): string {
  const err = e as ApiError;
  return err?.response?.data?.message || err?.message || "Failed to change password";
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    oldPassword.trim().length >= 1 &&
    newPassword.trim().length >= 1 &&
    newPassword === confirmNewPassword;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const resp = await api.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });
      if (!resp.data?.success) {
        throw new Error(resp.data?.message || "Change password failed");
      }
      alert("Password changed successfully. Please login again.");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err: unknown) {
      alert(getErrMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Change Password
        </h1>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Old Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none"
              required
              autoComplete="current-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none"
              required
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none"
              required
              autoComplete="new-password"
            />
            {newPassword &&
              confirmNewPassword &&
              newPassword !== confirmNewPassword && (
                <p className="text-xs text-red-600 mt-1">
                  New passwords do not match.
                </p>
              )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className={`w-full py-2.5 text-white font-medium rounded-lg transition-all duration-200
              ${canSubmit && !submitting
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-300 cursor-not-allowed"}
            `}
          >
            {submitting ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <span
            onClick={() => navigate(-1)}
            className="text-green-600 hover:underline cursor-pointer"
          >
            ← Go Back
          </span>
        </p>
      </div>
    </div>
  );
}
