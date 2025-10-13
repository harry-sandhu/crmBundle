// // import { useState } from "react";
// // import AdminUsers from "./AdminUsers";
// // import UserProfile from "./UserProfile";
// // import ProductCRUD from "./ProductCRUD";
// // import BundleTable from "./BundleTable";

// // export default function AdminPanel() {
// //   const [selectedUser, setSelectedUser] = useState(null);

// //   return (
// //     <div className="space-y-8 p-8">
// //       <h1 className="text-3xl font-extrabold mb-4">Admin Dashboard</h1>
// //       <div className="grid md:grid-cols-2 gap-8">
// //         <div>
// //           <AdminUsers onSelectUser={setSelectedUser} />
// //           {selectedUser && <UserProfile user={selectedUser} onClose={()=>setSelectedUser(null)} />}
// //         </div>
// //         <ProductCRUD />
// //       </div>
// //       <BundleTable />
// //     </div>
// //   );
// // }


// import { useState } from "react";
// import AdminUsers from "./AdminUsers";
// import UserProfile from "./UserProfile";
// import ProductCRUD from "./ProductCRUD";
// import BundleTable from "./BundleTable";

// // ✅ Define User type for typing props
// type User = {
//   _id: string;
//   name: string;
//   email: string;
//   isActive: boolean;
//   role?: string;
// };

// export default function AdminPanel() {
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);

//   return (
//     <div className="space-y-8 p-8">
//       <h1 className="text-3xl font-extrabold mb-4">Admin Dashboard</h1>
//       <div className="grid md:grid-cols-2 gap-8">
//         <div>
//           <AdminUsers onSelectUser={setSelectedUser} />
//           {selectedUser && (
//             <UserProfile
//               user={selectedUser}
//               onClose={() => setSelectedUser(null)}
//             />
//           )}
//         </div>
//         <ProductCRUD />
//       </div>
//       <BundleTable />
//     </div>
//   );
// }

import { useState } from "react";
import AdminUsers from "./SuperAdminUsers";
import UserProfile from "./UserProfile";
import ProductCRUD from "./ProductCRUD";
import BundleTable from "./BundleTable";

type User = {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  role?: string;
};

export default function AdminPanel() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-extrabold mb-4">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {/* ✅ Make sure you pass this prop */}
          <AdminUsers onSelectUser={setSelectedUser} />

          {selectedUser && (
            <UserProfile
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          )}
        </div>

        <ProductCRUD />
      </div>

      <BundleTable />
    </div>
  );
}
