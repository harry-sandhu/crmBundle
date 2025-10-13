// import { useState, useEffect } from "react";
// import api from "../../utils/api";

// export default function ProductCRUD() {
//   const [products, setProducts] = useState([]);
//   const [form, setForm] = useState({ name: "", description: "", price: "", category: "" });
//   const [editId, setEditId] = useState(null);

//   useEffect(() => { refresh(); }, []);
//   const refresh = () =>
//     api.get("/admin/products").then(res => setProducts(res.data));

//   const handleSubmit = async e => {
//     e.preventDefault();
//     if (editId) await api.put(`/admin/products/${editId}`, form);
//     else await api.post("/admin/products", form);
//     setForm({ name: "", description: "", price: "", category: "" });
//     setEditId(null);
//     refresh();
//   };

//   const handleEdit = p => {
//     setEditId(p._id);
//     setForm({ ...p });
//   };

//   const handleDelete = async id => {
//     if (window.confirm("Delete product?")) {
//       await api.delete(`/admin/products/${id}`);
//       refresh();
//     }
//   };

//   return (
//     <div>
//       <h3 className="text-lg font-bold mb-3">Product Management</h3>
//       <form onSubmit={handleSubmit} className="space-y-2 mb-5">
//         <input value={form.name} required onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" className="border p-2" />
//         <input value={form.description} required onChange={e=>setForm({...form, description:e.target.value})} placeholder="Desc" className="border p-2" />
//         <input value={form.price} required type="number" onChange={e=>setForm({...form, price:e.target.value})} placeholder="Price" className="border p-2" />
//         <input value={form.category} required onChange={e=>setForm({...form, category:e.target.value})} placeholder="Category" className="border p-2" />
//         <button className="btn bg-green-700 text-white">{editId ? "Update" : "Add Product"}</button>
//       </form>
//       <table className="min-w-full">
//         <thead><tr><th>Name</th><th>Price</th><th>Category</th><th></th></tr></thead>
//         <tbody>
//           {products.map(p => (
//             <tr key={p._id} className="border-b">
//               <td>{p.name}</td>
//               <td>{p.price}</td>
//               <td>{p.category}</td>
//               <td>
//                 <button onClick={()=>handleEdit(p)} className="mr-2 text-yellow-600">Edit</button>
//                 <button onClick={()=>handleDelete(p._id)} className="text-red-600">Del</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import { useState, useEffect, } from "react";
import type { FormEvent, ChangeEvent } from "react";
import api from "../../utils/api";

// ✅ Define Product type
type Product = {
  _id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
};

export default function ProductCRUD() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    api.get("/admin/products").then((res) => setProducts(res.data));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editId) await api.put(`/admin/products/${editId}`, form);
    else await api.post("/admin/products", form);
    setForm({ name: "", description: "", price: "", category: "" });
    setEditId(null);
    refresh();
  };

  const handleEdit = (p: Product) => {
    setEditId(p._id || null);
    setForm({ ...p });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete product?")) {
      await api.delete(`/Superadmin/products/${id}`);
      refresh();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-3">Product Management</h3>

      <form onSubmit={handleSubmit} className="space-y-2 mb-5">
        <input
          name="name"
          value={form.name}
          required
          onChange={handleChange}
          placeholder="Name"
          className="border p-2"
        />
        <input
          name="description"
          value={form.description}
          required
          onChange={handleChange}
          placeholder="Desc"
          className="border p-2"
        />
        <input
          name="price"
          value={form.price}
          required
          type="number"
          onChange={handleChange}
          placeholder="Price"
          className="border p-2"
        />
        <input
          name="category"
          value={form.category}
          required
          onChange={handleChange}
          placeholder="Category"
          className="border p-2"
        />
        <button className="btn bg-green-700 text-white">
          {editId ? "Update" : "Add Product"}
        </button>
      </form>

      <table className="min-w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b">
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.category}</td>
              <td>
                <button
                  onClick={() => handleEdit(p)}
                  className="mr-2 text-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id!)}
                  className="text-red-600"
                >
                  Del
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
