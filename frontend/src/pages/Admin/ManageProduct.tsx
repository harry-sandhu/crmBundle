
// src/pages/Admin/Products/ManageProduct.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../utils/api";
import axios, { AxiosError } from "axios";

type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  mrp: number;
  dp: number;
  price?: number;
};

type ProductsResponse = {
  ok: boolean;
  data: Product[];
  message?: string;
};

type ApiOk<T> = { ok: true; data: T; message?: string };
type ApiFail = { ok: false; message: string };

type UpdateProductResponse = ApiOk<Product> | ApiFail;
type DeleteProductResponse = ApiOk<{ id: string }> | ApiFail;

export default function ManageProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [showEdit, setShowEdit] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [mrp, setMrp] = useState<string>("");
  const [dp, setDp] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const [preview, setPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get<ProductsResponse>("/products");
        if (cancel) return;
        if (res.data.ok) setProducts(res.data.data);
        else setErr(res.data.message || "Failed to load products");
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const ax = error as AxiosError<{ message?: string }>;
          const status = ax.response?.status ?? "network";
          const message = ax.response?.data?.message ?? ax.message ?? "Request failed";
          setErr(`Failed to load products (${status}): ${message}`);
        } else if (error instanceof Error) {
          setErr(`Failed to load products: ${error.message}`);
        } else {
          setErr("Failed to load products");
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return Array.from(set);
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(t) || p.category.toLowerCase().includes(t));
    }
    if (cat) list = list.filter((p) => p.category === cat);
    return list;
  }, [products, q, cat]);

  function openEdit(p: Product) {
    setEditing(p);
    setName(p.name);
    setDesc(p.description);
    setCategory(p.category);
    setMrp(String(p.mrp ?? ""));
    setDp(String(p.dp ?? ""));
    setPrice(String(p.price ?? ""));
    setImageUrl(p.image);
    setPreview("");
    setSelectedFile(null);
    setSelectedFileName("");
    setShowEdit(true);
  }

  function closeEdit() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    setSelectedFile(null);
    setSelectedFileName("");
    setShowEdit(false);
    setEditing(null);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (f) {
      setSelectedFile(f);
      setSelectedFileName(f.name);
      if (preview) URL.revokeObjectURL(preview);
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      clearFile();
    }
  }

  function clearFile() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    setSelectedFile(null);
    setSelectedFileName("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function saveEdit() {
    if (!editing) return;
    try {
      setErr("");
      const id = editing.id;

      if (selectedFile) {
        const form = new FormData();
        form.append("name", name.trim());
        form.append("description", desc.trim());
        form.append("category", category.trim());
        form.append("mrp", mrp || "0");
        form.append("dp", dp || "0");
        form.append("price", price || "0");
        form.append("imageFile", selectedFile);

        const res = await api.put<UpdateProductResponse>(`/api/admin/products/${id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const payload = res.data;
        if (!payload.ok) {
          setErr(payload.message || "Update failed");
          return;
        }
        setProducts((prev) => prev.map((p) => (p.id === id ? payload.data : p)));
      } else {
        const body = {
          name: name.trim(),
          description: desc.trim(),
          category: category.trim(),
          mrp: Number(mrp || 0),
          dp: Number(dp || 0),
          price: Number(price || 0),
          image: imageUrl,
        };
        const res = await api.put<UpdateProductResponse>(`/api/admin/products/${editing.id}`, body);
        const payload = res.data;
        if (!payload.ok) {
          setErr(payload.message || "Update failed");
          return;
        }
        setProducts((prev) => prev.map((p) => (p.id === editing.id ? payload.data : p)));
      }

      closeEdit();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const ax = error as AxiosError<ApiFail>;
        const status = ax.response?.status ?? "network";
        const message = ax.response?.data?.message ?? ax.message ?? "Request failed";
        setErr(`Failed to update (${status}): ${message}`);
      } else if (error instanceof Error) {
        setErr(`Failed to update: ${error.message}`);
      } else {
        setErr("Failed to update");
      }
    }
  }

  async function remove(id: string) {
    const ok = window.confirm("Delete this product? This action cannot be undone.");
    if (!ok) return;
    try {
      const res = await api.delete<DeleteProductResponse>(`/api/admin/products/${id}`);
      const payload = res.data;
      if (!payload.ok) {
        setErr(payload.message || "Delete failed");
        return;
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const ax = error as AxiosError<ApiFail>;
        const status = ax.response?.status ?? "network";
        const message = ax.response?.data?.message ?? ax.message ?? "Request failed";
        setErr(`Failed to delete (${status}): ${message}`);
      } else if (error instanceof Error) {
        setErr(`Failed to delete: ${error.message}`);
      } else {
        setErr("Failed to delete");
      }
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or category"
          className="border rounded px-3 py-2 w-full max-w-md"
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="border rounded px-2 py-2"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {err && <div className="mb-3 text-red-600">{err}</div>}

      <div className="overflow-x-auto bg-white border rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-green-50 text-green-800">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-right">MRP</th>
              <th className="px-4 py-3 text-right">DP</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                  Loading products…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                  No products found
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img src={p.image} alt={p.name} className="h-12 w-12 rounded object-cover border" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{p.name}</div>
                    <div className="text-gray-500 truncate max-w-[360px]">{p.description}</div>
                  </td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3 text-right">₹{(p.mrp ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">₹{(p.dp ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showEdit && editing && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={closeEdit} />
          <div className="w-full max-w-xl bg-white h-full shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Edit Product</h2>
              <button
                onClick={closeEdit}
                className="text-gray-500 hover:text-gray-700 text-lg"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">MRP</label>
                  <input
                    type="number"
                    step="0.01"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">DP</label>
                  <input
                    type="number"
                    step="0.01"
                    value={dp}
                    onChange={(e) => setDp(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Category</label>
                <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Current Image</label>
                <img src={preview || imageUrl} alt="Current" className="h-32 w-32 rounded border object-cover" />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Replace Image</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition shadow-sm"
                  >
                    Choose Image
                  </button>
                  <div className="text-sm text-gray-700 truncate max-w-[300px]">
                    {selectedFileName || "No file selected"}
                  </div>
                  {selectedFileName && (
                    <button
                      type="button"
                      onClick={clearFile}
                      className="text-red-600 hover:text-red-700 text-sm underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save Changes
                </button>
                <button
                  onClick={closeEdit}
                  className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>

              {err && <div className="text-red-600">{err}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
