import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "../../utils/api";
import { getApiErrorMessage } from "../../utils/handleApiError";

interface SignupResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    email: string;
    refCode: string;
    referredBy?: string | null;
    ancestors?: string[];
    
  };
}

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [password, setPassword] = useState("");
  
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReferralLocked, setIsReferralLocked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Read referral code from URL if present (e.g. /signup?ref=GROLIFE-A-000001)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const referralFromUrl = queryParams.get("ref");
    if (referralFromUrl) {
      setReferenceId(referralFromUrl.trim().toUpperCase());
      setIsReferralLocked(true); // make field read-only
    }
  }, [location.search]);

  // ✅ Referral ID format check (must match backend pattern)
  const isValidReferralCode = (code: string) => {
    const pattern = /^GROLIFE-[A-Z]+-\d{6}$/;
    return pattern.test(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setMsg("");

    // 🚫 Require referral code
    if (!referenceId) {
      setErr("Referral code is required. Please enter a valid one.");
      setLoading(false);
      return;
    }

    // ⚙️ Validate referral format
    if (!isValidReferralCode(referenceId)) {
      setErr("Invalid referral code format. Example: GROLIFE-A-000001");
      setLoading(false);
      return;
    }

    

    try {
      const res = await axios.post<SignupResponse>("/auth/signup", {
        name,
        email,
        phone: mobile,
        password,
        referralCode: referenceId,
        
      });

      if (res.data.success && res.data.data) {
        const { email, name, refCode } = res.data.data;

        // ✅ Save to localStorage
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            email,
            name,
            refCode,
            
          })
        );

        // ✅ Success message
        setMsg(
          `Signup successful! Your Referral ID: ${refCode}. `
        );

        // Redirect after a short delay
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setErr(res.data.message || "Signup failed. Try again.");
      }
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
            src="/ourlogo.jpeg"
            alt="Logo"
            className="h-20 w-20 mb-3 rounded-full shadow-md bg-white/90 border-4 border-white"
          />
          <h1 className="text-3xl font-extrabold text-green-800 mb-1">
            Sign Up
          </h1>
          <p className="text-green-900 mb-2 text-center font-medium">
            Create your GroLife Supro Imo account using a referral code.
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
            className="block px-4 py-3 w-full rounded-lg border border-green-200 focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="block px-4 py-3 w-full rounded-lg border border-green-200 focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="tel"
            required
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Mobile Number"
            className="block px-4 py-3 w-full rounded-lg border border-green-200 focus:ring-2 focus:ring-yellow-400"
          />

          

          {/* ✅ Referral Code Field (auto-filled if ?ref= provided) */}
          <input
            type="text"
            required
            value={referenceId}
            onChange={(e) =>
              !isReferralLocked &&
              setReferenceId(e.target.value.trim().toUpperCase())
            }
            placeholder="Sponsor ID (e.g., GROLIFE-A-000001)"
            readOnly={isReferralLocked}
            className={`block px-4 py-3 w-full rounded-lg border focus:ring-2 focus:ring-yellow-400 ${
              isReferralLocked
                ? "bg-gray-100 border-gray-300 text-gray-700 cursor-not-allowed"
                : "border-green-200"
            }`}
          />

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="block px-4 py-3 w-full rounded-lg border border-green-200 focus:ring-2 focus:ring-yellow-400"
          />

          {/* Feedback messages */}
          {msg && (
            <div className="text-green-600 text-center font-medium">{msg}</div>
          )}
          {err && (
            <div className="text-red-500 text-center font-medium">{err}</div>
          )}

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className={`w-full py-3 text-lg font-semibold rounded-lg shadow-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-400 via-orange-400 to-green-500 hover:from-orange-400 hover:to-green-600 text-white"
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="flex justify-between mt-5 text-sm">
          <Link to="/login" className="text-green-700 hover:underline">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
