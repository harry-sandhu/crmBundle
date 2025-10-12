// import { useEffect, useState } from "react";
// import api from "../../utils/api";

// export default function AdminUsers({ onSelectUser }) {
//   const [users, setUsers] = useState([]);
//   const [activeOnly, setActiveOnly] = useState("");

//   useEffect(() => {
//     api.get("/admin/users" + (activeOnly ? `?active=${activeOnly}` : ""))
//       .then(res => setUsers(res.data));
//   }, [activeOnly]);

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-3">Users</h2>
//       <div>
//         <label>
//           <input type="checkbox" checked={activeOnly === "true"} onChange={() => setActiveOnly(activeOnly === "true" ? "" : "true")} /> Active
//         </label>
//         <label className="ml-4">
//           <input type="checkbox" checked={activeOnly === "false"} onChange={() => setActiveOnly(activeOnly === "false" ? "" : "false")} /> Inactive
//         </label>
//       </div>
//       <table className="min-w-full mt-3">
//         <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
//         <tbody>
//           {users.map(u => (
//             <tr key={u._id} className="border-b">
//               <td>{u.name}</td>
//               <td>{u.email}</td>
//               <td>{u.isActive ? "Active" : "Inactive"}</td>
//               <td>
//                 <button onClick={() => onSelectUser(u)} className="underline text-green-700">View</button>
//                 {/* edit/delete buttons as needed */}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import api from "../../utils/api";

// ✅ Define a User type
type User = {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
};

// ✅ Define prop types for this component
type AdminUsersProps = {
  onSelectUser: (user: User) => void;
};

export default function AdminUsers({ onSelectUser }: AdminUsersProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [activeOnly, setActiveOnly] = useState("");

  useEffect(() => {
    api
      .get("/admin/users" + (activeOnly ? `?active=${activeOnly}` : ""))
      .then((res) => setUsers(res.data));
  }, [activeOnly]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Users</h2>
      <div>
        <label>
          <input
            type="checkbox"
            checked={activeOnly === "true"}
            onChange={() =>
              setActiveOnly(activeOnly === "true" ? "" : "true")
            }
          />{" "}
          Active
        </label>
        <label className="ml-4">
          <input
            type="checkbox"
            checked={activeOnly === "false"}
            onChange={() =>
              setActiveOnly(activeOnly === "false" ? "" : "false")
            }
          />{" "}
          Inactive
        </label>
      </div>
      <table className="min-w-full mt-3">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b">
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.isActive ? "Active" : "Inactive"}</td>
              <td>
                <button
                  onClick={() => onSelectUser(u)}
                  className="underline text-green-700"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
