// src/pages/Admin/Members/MemberAdd.tsx
import { useState } from "react";
import axios from "../../../utils/api";

export default function MemberAdd() {
  const [form, setForm] = useState({ name: "", email: "", password: "", status: "active" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  function update<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      await axios.post("/admin/members", form);
      setMsg("Member added");
      setForm({ name: "", email: "", password: "", status: "active" });
    } catch {
      setErr("Failed to add member");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-md">
      <input className="border rounded px-3 py-2 w-full" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Name" />
      <input className="border rounded px-3 py-2 w-full" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="Email" />
      <input className="border rounded px-3 py-2 w-full" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Password" />
      <select className="border rounded px-3 py-2 w-full" value={form.status} onChange={(e) => update("status", e.target.value)}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <button className="px-4 py-2 bg-green-600 text-white rounded">Add Member</button>
      {msg && <div className="text-green-600">{msg}</div>}
      {err && <div className="text-red-600">{err}</div>}
    </form>
  );
}
