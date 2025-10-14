// frontend/src/pages/auth/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../utils/api";
import { getApiErrorMessage } from "../../utils/handleApiError";

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: "user" | "admin";
      refCode: string; // ✅ added
    };
  };
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const res = await axios.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      if (!res.data.success) {
        setErr(res.data.message || "Login failed");
        setLoading(false);
        return;
      }

      const { token, user } = res.data.data;

      // ✅ Store the JWT token for authenticated requests
      localStorage.setItem("token", token);

      // ✅ Store user info (including refCode)
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          refCode: user.refCode, // 👈 this will be used by Dashboard & Tree
        })
      );

      setMsg("Login successful!");

      // ✅ Role-based redirect (including SuperAdmin check)
      setTimeout(() => {
        const userRole = user.role?.toLowerCase() || "user";
        const userEmail = user.email?.toLowerCase();

        if (userEmail === "growlifesupremo2025@gmail.com" && userRole === "admin") {
          navigate("/Superadmin", { replace: true });
        }
         else {
          navigate("/dashboard", { replace: true });
        }
      }, 1000);
    } catch (error) {
      setErr(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-50 to-green-100">
      <div className="flex w-full max-w-4xl shadow-2xl rounded-lg overflow-hidden bg-white">
        {/* Left Side */}
        <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-yellow-400 via-orange-300 to-green-300 relative">
          <img
            src="/finallogo.png"
            alt="Logo"
            className="h-28 w-auto mb-8 drop-shadow-xl rounded-full border-4 border-white bg-white/90"
            style={{ boxShadow: "0 6px 32px 0 rgba(60,180,75,0.22)" }}
          />
          <h2 className="text-3xl font-extrabold mb-3 text-green-800 drop-shadow">
            Welcome Back!
          </h2>
          <p className="text-green-900 text-base text-center px-6 opacity-90">
            Log in to continue building your GroLife Supro Imo network.
          </p>
          <div className="absolute bottom-4 left-0 w-full text-center text-green-800 opacity-80 text-xs">
            © {new Date().getFullYear()} GroLife Supro Imo
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
              Log In
            </h1>

            {/* Email Field */}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="block px-4 py-3 w-full rounded-lg border border-green-200 focus:ring-2 focus:ring-orange-300 transition"
            />

            {/* Password Field */}
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="block px-4 py-3 w-full rounded-lg border border-green-200 focus:ring-2 focus:ring-orange-300 transition"
            />

            {/* Feedback */}
            {msg && <div className="text-green-600 text-center font-medium">{msg}</div>}
            {err && <div className="text-red-500 text-center font-medium">{err}</div>}

            {/* Submit */}
            <button
              disabled={loading}
              type="submit"
              className={`w-full py-3 text-lg font-semibold rounded-lg shadow-lg transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-400 via-orange-400 to-green-500 hover:from-orange-400 hover:to-green-600 text-white"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Links */}
            <div className="flex justify-between mt-2 text-sm">
              <Link to="/register" className="text-green-700 hover:underline">
                Sign up
              </Link>
              <Link to="/forgot-password" className="text-green-700 hover:underline">
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
