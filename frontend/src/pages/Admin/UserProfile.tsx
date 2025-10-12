// import api from "../../utils/api";
// import { useState } from "react";

// export default function UserProfile({ user, onClose }) {
//   const [editMode, setEditMode] = useState(false);
//   const [form, setForm] = useState(user);

//   const handleUpdate = async () => {
//     await api.put(`/admin/users/${user._id}`, form);
//     setEditMode(false);
//     alert("User updated!");
//   };

//   return (
//     <div className="p-4 border rounded shadow-xl bg-white w-full max-w-lg">
//       <button onClick={onClose} className="float-right text-xl">&times;</button>
//       <h3 className="text-lg font-bold mb-2">User Profile</h3>
//       {editMode ? (
//         <div className="space-y-2">
//           <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="border p-2 w-full" />
//           <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="border p-2 w-full" />
//           {/* Add more fields as needed */}
//           <button onClick={handleUpdate} className="btn bg-green-600 text-white mt-2">Save</button>
//         </div>
//       ) : (
//         <div>
//           <div>Name: {user.name}</div>
//           <div>Email: {user.email}</div>
//           <div>Status: {user.isActive ? "Active" : "Inactive"}</div>
//           <button onClick={() => setEditMode(true)} className="btn bg-yellow-500 text-white mt-2">Edit</button>
//         </div>
//       )}
//     </div>
//   );
// }
import api from "../../utils/api";
import { useState } from "react";

// ✅ Reuse the same User type
type User = {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
};

// ✅ Define props for this component
type UserProfileProps = {
  user: User;
  onClose: () => void;
};

export default function UserProfile({ user, onClose }: UserProfileProps) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<User>(user);

  const handleUpdate = async () => {
    await api.put(`/admin/users/${user._id}`, form);
    setEditMode(false);
    alert("User updated!");
  };

  return (
    <div className="p-4 border rounded shadow-xl bg-white w-full max-w-lg">
      <button onClick={onClose} className="float-right text-xl">
        &times;
      </button>
      <h3 className="text-lg font-bold mb-2">User Profile</h3>

      {editMode ? (
        <div className="space-y-2">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 w-full"
          />
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-2 w-full"
          />
          {/* Add more fields as needed */}
          <button
            onClick={handleUpdate}
            className="btn bg-green-600 text-white mt-2"
          >
            Save
          </button>
        </div>
      ) : (
        <div>
          <div>Name: {user.name}</div>
          <div>Email: {user.email}</div>
          <div>Status: {user.isActive ? "Active" : "Inactive"}</div>
          <button
            onClick={() => setEditMode(true)}
            className="btn bg-yellow-500 text-white mt-2"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
