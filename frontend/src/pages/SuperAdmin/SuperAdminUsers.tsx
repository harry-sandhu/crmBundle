
// import { useEffect, useState } from "react";
// import api from "../../utils/api";

// // ✅ Define a User type
// type User = {
//   _id: string;
//   name: string;
//   email: string;
//   isActive: boolean;
// };

// // ✅ Define prop types for this component
// type AdminUsersProps = {
//   onSelectUser: (user: User) => void;
// };

// export default function AdminUsers({ onSelectUser }: AdminUsersProps) {
//   const [users, setUsers] = useState<User[]>([]);
//   const [activeOnly, setActiveOnly] = useState("");

//   useEffect(() => {
//     api
//       .get("/Superadmin/users" + (activeOnly ? `?active=${activeOnly}` : ""))
//       .then((res) => setUsers(res.data));
//   }, [activeOnly]);

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-3">Users</h2>
//       <div>
//         <label>
//           <input
//             type="checkbox"
//             checked={activeOnly === "true"}
//             onChange={() =>
//               setActiveOnly(activeOnly === "true" ? "" : "true")
//             }
//           />{" "}
//           Active
//         </label>
//         <label className="ml-4">
//           <input
//             type="checkbox"
//             checked={activeOnly === "false"}
//             onChange={() =>
//               setActiveOnly(activeOnly === "false" ? "" : "false")
//             }
//           />{" "}
//           Inactive
//         </label>
//       </div>
//       <table className="min-w-full mt-3">
//         <thead>
//           <tr>
//             <th>Name</th><th>Email</th><th>Status</th><th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((u) => (
//             <tr key={u._id} className="border-b">
//               <td>{u.name}</td>
//               <td>{u.email}</td>
//               <td>{u.isActive ? "Active" : "Inactive"}</td>
//               <td>
//                 <button
//                   onClick={() => onSelectUser(u)}
//                   className="underline text-green-700"
//                 >
//                   View
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import api from "../../utils/api";

type User = {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  role?: "user" | "admin";
  mobile?: string;
  address?: string;
};

type AdminUsersProps = {
  onSelectUser?: (user: User) => void; // optional external handler
};

export default function AdminUsers({ onSelectUser }: AdminUsersProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [activeOnly, setActiveOnly] = useState("");
  const [loading, setLoading] = useState(false);

  const [panelOpen, setPanelOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/Superadmin/users" + (activeOnly ? `?active=${activeOnly}` : ""));
      setUsers(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [activeOnly]); // eslint-disable-line

  const totalActive = useMemo(() => users.filter(u => u.isActive).length, [users]);
  const totalInactive = useMemo(() => users.filter(u => !u.isActive).length, [users]);

  const openPanel = (u: User) => {
    setSelected(u);
    setEditForm(u);
    setPanelOpen(true);
    onSelectUser && onSelectUser(u);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setSelected(null);
    setEditForm({});
  };

  const handleUpdate = async () => {
    if (!selected) return;
    await api.put(`/Superadmin/users/${selected._id}`, editForm);
    await fetchUsers();
    closePanel();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/Superadmin/users/${id}`);
    await fetchUsers();
    if (selected?._id === id) closePanel();
  };

  const handleCreate = async () => {
    const name = prompt("Enter name");
    const email = prompt("Enter email");
    if (!name || !email) return;
    await api.post("/Superadmin/users", { name, email, isActive: true, role: "user" });
    await fetchUsers();
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">Users</h2>
        <div className="text-sm text-gray-600">
          Active: {totalActive} • Inactive: {totalInactive} • Total: {users.length}
        </div>
      </div>

      <div className="mb-2">
        <label className="mr-4">
          <input
            type="checkbox"
            checked={activeOnly === "true"}
            onChange={() => setActiveOnly(activeOnly === "true" ? "" : "true")}
          />{" "}
          Active
        </label>
        <label className="mr-4">
          <input
            type="checkbox"
            checked={activeOnly === "false"}
            onChange={() => setActiveOnly(activeOnly === "false" ? "" : "false")}
          />{" "}
          Inactive
        </label>
        <button
          onClick={handleCreate}
          className="ml-4 px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
        >
          + Add User
        </button>
      </div>

      <div className="overflow-auto border rounded">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-3 py-3" colSpan={5}>Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td className="px-3 py-3" colSpan={5}>No users found.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="px-3 py-2">{u.name}</td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2 capitalize">{u.role || "user"}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${u.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => openPanel(u)}
                      className="text-green-700 underline mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-red-600 underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Side Panel / Modal */}
      {panelOpen && selected && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-40">
          <div className="w-full max-w-md h-full bg-white shadow-xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Edit Profile</h3>
              <button onClick={closePanel} className="text-2xl leading-none">&times;</button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-sm text-gray-600">Name</span>
                <input
                  className="mt-1 w-full border rounded p-2"
                  value={editForm.name || ""}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Email</span>
                <input
                  className="mt-1 w-full border rounded p-2"
                  value={editForm.email || ""}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Role</span>
                <select
                  className="mt-1 w-full border rounded p-2"
                  value={(editForm.role as any) || "user"}
                  onChange={e => setEditForm({ ...editForm, role: e.target.value as "user" | "admin" })}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Active</span>
                <select
                  className="mt-1 w-full border rounded p-2"
                  value={String(editForm.isActive ?? selected.isActive)}
                  onChange={e => setEditForm({ ...editForm, isActive: e.target.value === "true" })}
                >
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Mobile</span>
                <input
                  className="mt-1 w-full border rounded p-2"
                  value={editForm.mobile || ""}
                  onChange={e => setEditForm({ ...editForm, mobile: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Address</span>
                <input
                  className="mt-1 w-full border rounded p-2"
                  value={editForm.address || ""}
                  onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                />
              </label>

              <div className="flex gap-3 pt-3">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => handleDelete(selected._id)}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={closePanel}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
