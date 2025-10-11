// import { useState } from "react";
// import axios from "../../utils/api";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [msg, setMsg] = useState("");
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMsg("");
//     setErr("");
//     try {
//       await axios.post("/auth/forgot-password", { email });
//       setMsg("Password reset instructions sent to your email");
//     } catch (error: any) {
//       setErr(error.response?.data?.message || "Problem sending email");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//       <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded max-w-md w-full space-y-6">
//         <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
//         <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
//           placeholder="Email" className="input input-bordered w-full" />
//         {msg && <div className="text-green-500">{msg}</div>}
//         {err && <div className="text-red-500">{err}</div>}
//         <button disabled={loading} type="submit" className="btn w-full bg-blue-500 text-white">
//           {loading ? "Sending..." : "Send Reset Instructions"}
//         </button>
//       </form>
//     </div>
//   );
// }


import { useState } from "react";
import axios from "../../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setErr("");
    try {
      await axios.post("/auth/forgot-password", { email });
      setMsg("Password reset instructions sent to your email");
    } catch (error: any) {
      setErr(error.response?.data?.message || "Problem sending email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-50 to-green-100">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl p-10 border border-green-100">
        <div className="mb-6 flex flex-col items-center">
          <img
            src="/finallogo.jpg"
            alt="Logo"
            className="h-20 w-20 mb-3 rounded-full shadow-md bg-white/90 border-4 border-white"
          />
          <h1 className="text-3xl font-extrabold text-green-800 mb-1">
            Forgot Password
          </h1>
          <p className="text-green-900 mb-2 text-center font-medium">
            Enter your email to receive password reset instructions.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="block px-4 py-3 w-full rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          {msg && <div className="text-green-500 text-center">{msg}</div>}
          {err && <div className="text-red-500 text-center">{err}</div>}
          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-yellow-400 via-orange-400 to-green-500 hover:from-orange-400 hover:to-green-600 text-white rounded-lg shadow-lg transition"
          >
            {loading ? "Sending..." : "Send Reset Instructions"}
          </button>
        </form>
      </div>
    </div>
  );
}
