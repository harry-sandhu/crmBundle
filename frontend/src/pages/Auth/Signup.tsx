import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../utils/api";
import { getApiErrorMessage } from "../../utils/handleApiError"; // ✅ centralized error helper

interface SignupResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    role: "user" | "admin";
  };
}

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user"); // ✅ Optional role selector
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setMsg("");

    try {
      const res = await axios.post<SignupResponse>("/auth/signup", {
        name,
        email,
        password,
        role,
      });

      setMsg(res.data.message || "Signup successful! Please verify your email.");
      setTimeout(() => navigate("/verify-otp"), 1500);
    } catch (error) {
      setErr(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-50 to-green-100">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl p-10 border border-green-100">
        {/* Header Section */}
        <div className="mb-6 flex flex-col items-center">
          <img
            src="/finallogo.jpg"
            alt="Logo"
            className="h-20 w-20 mb-3 rounded-full shadow-md bg-white/90 border-4 border-white"
          />
          <h1 className="text-3xl font-extrabold text-green-800 mb-1">
            Sign Up
          </h1>
          <p className="text-green-900 mb-2 text-center font-medium">
            Create your account and start building better bundles.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="block px-4 py-3 w-full rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="block px-4 py-3 w-full rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="block px-4 py-3 w-full rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />

          {/* ✅ Role Selector (Optional) */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "user" | "admin")}
            className="block w-full px-4 py-3 rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition bg-white"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* ✅ Feedback messages */}
          {msg && <div className="text-green-600 text-center font-medium">{msg}</div>}
          {err && <div className="text-red-500 text-center font-medium">{err}</div>}

          {/* ✅ Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className={`w-full py-3 text-lg font-semibold rounded-lg shadow-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-400 via-orange-400 to-green-500 hover:from-orange-400 hover:to-green-600 text-white"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="flex justify-between mt-5 text-sm">
          <Link to="/" className="text-green-700 hover:underline">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
