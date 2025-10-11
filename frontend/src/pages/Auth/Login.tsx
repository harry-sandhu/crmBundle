// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "../../utils/api";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setErr("");
//     try {
//       const res = await axios.post("/auth/login", { email, password });
//       localStorage.setItem("token", res.data.data.token);
//       navigate("/catalog");
//     } catch (error: any) {
//       setErr(error.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//       <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded max-w-md w-full space-y-6">
//         <h1 className="text-2xl font-bold mb-4">Login</h1>
//         <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
//           placeholder="Email" className="input input-bordered w-full" />
//         <input type="password" required value={password} onChange={e=>setPassword(e.target.value)}
//           placeholder="Password" className="input input-bordered w-full" />
//         {err && <div className="text-red-500">{err}</div>}
//         <button disabled={loading} type="submit" className="btn w-full bg-blue-500 text-white">
//           {loading ? "Logging in..." : "Login"}
//         </button>
//         <div className="flex justify-between mt-3">
//           <Link to="/register" className="text-blue-700 hover:underline">Sign up</Link>
//           <Link to="/forgot-password" className="text-blue-700 hover:underline">Forgot password?</Link>
//         </div>
//       </form>
//     </div>
//   );
// }


// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "../../utils/api";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setErr("");
//     try {
//       const res = await axios.post("/auth/login", { email, password });
//       localStorage.setItem("token", res.data.data.token);
//       navigate("/catalog");
//     } catch (error: any) {
//       setErr(error.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
//       <div className="flex w-full max-w-4xl shadow-2xl rounded-lg overflow-hidden bg-white">
//         {/* Left Side - Brand/Illustration */}
//         <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-indigo-500 to-blue-600 text-white items-center justify-center p-10 relative">
//           <div>
//             <img src="/logo.svg" alt="Logo" className="h-16 w-16 mx-auto mb-8 drop-shadow-lg" />
//             <h2 className="text-3xl font-bold mb-3 ml-12">GrowLifeSuprimo</h2>
//             <p className="mb-6 text-lg opacity-80">
//             Buy Latest products and bundles with ease!
//             </p>
//             <div className="absolute bottom-5 left-0 w-full text-center opacity-80 text-xs">
//               © {new Date().getFullYear()} BunldeMaker
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Login Form */}
//         <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
//           <form
//             onSubmit={handleSubmit}
//             className="space-y-5"
//             autoComplete="off"
//           >
//             <h1 className="text-3xl font-bold text-indigo-700 text-center mb-5">Login</h1>
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//               placeholder="Email"
//               className="block px-4 py-3 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
//             />
//             <input
//               type="password"
//               required
//               value={password}
//               onChange={e => setPassword(e.target.value)}
//               placeholder="Password"
//               className="block px-4 py-3 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
//             />
//             {err && <div className="text-red-500 text-center">{err}</div>}
//             <button
//               disabled={loading}
//               type="submit"
//               className="w-full py-3 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition"
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>
//             <div className="flex justify-between mt-2 text-sm">
//               <Link to="/register" className="text-indigo-600 hover:text-indigo-800 underline">
//                 Sign up
//               </Link>
//               <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-800 underline">
//                 Forgot password?
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.data.token);
      navigate("/catalog");
    } catch (error: any) {
      setErr(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-50 to-green-100">
      <div className="flex w-full max-w-4xl shadow-2xl rounded-lg overflow-hidden bg-white">
        {/* Left Side - Logo & Message */}
        <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center bg-gradient-to-br from-yellow-400 via-orange-300 to-green-300 relative">
          <img
            src="../../assets/finallogo.png"
            alt="Logo"
            className="h-28 w-auto mb-8 drop-shadow-xl rounded-full border-4 border-white bg-white/90"
            style={{ boxShadow: '0 6px 32px 0 rgba(60,180,75,0.22)' }}
          />
          <h2 className="text-3xl font-extrabold mb-3 text-green-800 drop-shadow">
            Welcome Back!
          </h2>
          <p className="text-green-900 text-base text-center px-6 opacity-90">
            Log in to build your dream bundles with the fresh spirit of a new day.
          </p>
          <div className="absolute bottom-4 left-0 w-full text-center text-green-800 opacity-80 text-xs">
            © {new Date().getFullYear()} BundleMaker
          </div>
        </div>
        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            autoComplete="off"
          >
            <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
              Log In
            </h1>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="block px-4 py-3 w-full rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
            />
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="block px-4 py-3 w-full rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
            />
            {err && <div className="text-red-500 text-center">{err}</div>}
            <button
              disabled={loading}
              type="submit"
              className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-yellow-400 via-orange-400 to-green-500 hover:from-orange-400 hover:to-green-600 text-white rounded-lg shadow-lg transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
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
