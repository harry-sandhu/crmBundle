// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "../../utils/api";

// export default function Register() {
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setErr("");
//     try {
//       await axios.post("/auth/signup", { name, email, password });
//       navigate("/");
//     } catch (error: any) {
//       setErr(error.response?.data?.message || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//       <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded max-w-md w-full space-y-6">
//         <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
//         <input type="text" required value={name} onChange={e=>setName(e.target.value)}
//           placeholder="Name" className="input input-bordered w-full" />
//         <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
//           placeholder="Email" className="input input-bordered w-full" />
//         <input type="password" required value={password} onChange={e=>setPassword(e.target.value)}
//           placeholder="Password" className="input input-bordered w-full" />
//         {err && <div className="text-red-500">{err}</div>}
//         <button disabled={loading} type="submit" className="btn w-full bg-blue-500 text-white">
//           {loading ? "Signing up..." : "Sign Up"}
//         </button>
//         <div className="flex justify-between mt-3">
//           <Link to="/login" className="text-blue-700 hover:underline">Already have account?</Link>
//         </div>
//       </form>
//     </div>
//   );
// }


import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../utils/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      await axios.post("/auth/signup", { name, email, password });
      navigate("/");
    } catch (error: any) {
      setErr(error.response?.data?.message || "Signup failed");
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
            Sign Up
          </h1>
          <p className="text-green-900 mb-2 text-center font-medium">
            Create your sunrise account and start building better bundles.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
            className="block px-4 py-3 w-full rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="block px-4 py-3 w-full rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="block px-4 py-3 w-full rounded-lg border border-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          {err && <div className="text-red-500 text-center">{err}</div>}
          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-yellow-400 via-orange-400 to-green-500 hover:from-orange-400 hover:to-green-600 text-white rounded-lg shadow-lg transition"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="flex justify-between mt-5 text-sm">
          <Link to="/" className="text-green-700 hover:underline">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
