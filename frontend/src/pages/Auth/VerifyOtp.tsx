import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/api";
import { getApiErrorMessage } from "../../utils/handleApiError";

interface ApiResponse {
  success: boolean;
  message: string;
}

export default function VerifyOtp() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-fill email if stored from signup
  useEffect(() => {
    const stored = localStorage.getItem("pendingSignup");
    if (stored) {
      const { email } = JSON.parse(stored);
      setEmail(email);
    }
  }, []);

  // ✅ Verify OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setErr("");

    try {
      const stored = localStorage.getItem("pendingSignup");
      if (!stored) {
        setErr("Signup details missing. Please sign up again.");
        return;
      }

      const { name, role, hashedPassword, email: storedEmail } = JSON.parse(stored);

      const res = await axios.post<ApiResponse>("/auth/verify-otp", {
        email: storedEmail,
        code,
        name,
        hashedPassword,
        role,
      });

      if (res.data.success) {
        setMsg(res.data.message || "Email verified successfully!");
        localStorage.removeItem("pendingSignup");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setErr(res.data.message || "Verification failed. Try again.");
      }
    } catch (error) {
      setErr(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Resend OTP (optional)
  const handleResendOtp = async () => {
    if (!email) {
      setErr("Enter your email first");
      return;
    }
    setErr("");
    setMsg("");
    try {
      const res = await axios.post<ApiResponse>("/otp/send", { email });
      setMsg(res.data.message || "OTP resent successfully!");
    } catch (error) {
      setErr(getApiErrorMessage(error));
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
            Verify Email
          </h1>
          <p className="text-green-900 text-center font-medium">
            Enter the OTP sent to your email.
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="block px-4 py-3 w-full rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="6-digit OTP"
            className="block px-4 py-3 w-full rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition tracking-widest text-center"
            maxLength={6}
          />

          {msg && <div className="text-green-500 text-center font-medium">{msg}</div>}
          {err && <div className="text-red-500 text-center font-medium">{err}</div>}

          <button
            disabled={loading}
            type="submit"
            className={`w-full py-3 text-lg font-semibold rounded-lg shadow-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-400 via-orange-400 to-green-500 hover:from-orange-400 hover:to-green-600 text-white"
            }`}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <button
            onClick={handleResendOtp}
            className="text-green-700 hover:underline font-medium"
          >
            Resend OTP
          </button>
          <button
            onClick={() => navigate("/")}
            className="text-green-700 hover:underline font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
