import { useEffect, useState } from "react";
import axios from "../../utils/api";

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/user/profile");
        setProfile(res.data.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading)
    return <div className="text-center mt-20 text-green-700">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Welcome, {profile?.name} 👋</h1>

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold text-green-800 mb-2">Profile Info</h2>
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Role:</strong> {profile?.role}</p>
      </div>

      <div className="border-t mt-6 pt-4">
        <h2 className="text-xl font-semibold text-green-800 mb-3">Your Recent Bundles</h2>
        <div className="text-gray-500">No bundles yet — start creating one!</div>
      </div>
    </div>
  );
}
