// import { useEffect, useState } from "react";
// import api from "../../utils/api";

// export default function BundleTable() {
//   const [bundles, setBundles] = useState([]);
//   useEffect(() => {
//     api.get("/admin/bundles").then(res => setBundles(res.data));
//   }, []);

//   return (
//     <div>
//       <h3 className="text-lg font-bold mb-3">Submitted Bundles</h3>
//       <table className="min-w-full">
//         <thead>
//           <tr>
//             <th>Owner</th>
//             <th>Price</th>
//             <th>Items</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bundles.map(b => (
//             <tr key={b._id} className="border-b">
//               <td>{b.owner?.name} ({b.owner?.email})</td>
//               <td>{b.items.map(i=>i.productId.price*i.qty).reduce((a,b)=>a+b,0)}</td>
//               <td>
//                 {b.items.map(i => (
//                   <span key={i.productId._id}>{i.productId.name} (x{i.qty}), </span>
//                 ))}
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

// ✅ Define types for bundle and related data
type Product = {
  _id: string;
  name: string;
  price: number;
};

type BundleItem = {
  productId: Product;
  qty: number;
};

type Owner = {
  _id: string;
  name: string;
  email: string;
};

type Bundle = {
  _id: string;
  owner: Owner;
  items: BundleItem[];
};

export default function BundleTable() {
  const [bundles, setBundles] = useState<Bundle[]>([]);

  useEffect(() => {
    api.get("/Superadmin/bundles").then((res) => setBundles(res.data));
  }, []);

  return (
    <div>
      <h3 className="text-lg font-bold mb-3">Submitted Bundles</h3>
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Owner</th>
            <th>Price</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {bundles.map((b) => (
            <tr key={b._id} className="border-b">
              <td>
                {b.owner?.name} ({b.owner?.email})
              </td>
              <td>
                {b.items
                  .map((i) => i.productId.price * i.qty)
                  .reduce((a, c) => a + c, 0)
                  .toFixed(2)}
              </td>
              <td>
                {b.items.map((i) => (
                  <span key={i.productId._id}>
                    {i.productId.name} (x{i.qty}),{" "}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
