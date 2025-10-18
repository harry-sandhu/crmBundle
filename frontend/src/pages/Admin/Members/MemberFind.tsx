// src/pages/Admin/Members/MemberFind.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../../utils/api";
import axios, { AxiosError } from "axios";

type MemberLite = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  refCode: string;
  isVerified: boolean;
  regamount: number | null;
  referredBy: string | null;
  createdAt: string;
};

type MemberDetail = MemberLite & {
  // put any extra fields here if your detail route returns more
};

type SearchResponse = {
  ok: boolean;
  data: MemberLite[];
};

type DetailResponse = {
  ok: boolean;
  data: MemberDetail;
};

type ApiError = {
  ok?: boolean;
  message?: string;
  status?: number;
  errors?: string[];
};

export default function MemberFind() {
  const [term, setTerm] = useState("");
  const [list, setList] = useState<MemberLite[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [selected, setSelected] = useState<MemberDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailErr, setDetailErr] = useState("");

  const boxRef = useRef<HTMLDivElement | null>(null);

  // Debounce search term
  const [debounced, setDebounced] = useState(term);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(term), 300);
    return () => clearTimeout(t);
  }, [term]);

  // Fetch list on term change
  useEffect(() => {
    let cancelled = false;
    async function run() {
      setErr("");
      setList([]);
      setSelected(null);
      if (!debounced.trim()) return;
      try {
        setLoading(true);
        // q matches name, refCode, or phone on server
        const res = await api.get<SearchResponse>("/admin/members/search", { params: { q: debounced } });
        if (cancelled) return;
        if (res.data.ok) {
          setList(res.data.data);
        } else {
          setErr("No results");
        }
      } catch (error: unknown) {
        if (cancelled) return;
        if (axios.isAxiosError(error)) {
          const axErr = error as AxiosError<ApiError>;
          const status = axErr.response?.status ?? "network";
          const message = axErr.response?.data?.message ?? axErr.message ?? "Request failed";
          setErr(`Search failed (${status}): ${message}`);
        } else {
          setErr("Search failed");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  async function openDetail(id: string) {
    try {
      setDetailErr("");
      setLoadingDetail(true);
      const res = await api.get<DetailResponse>(`/admin/members/${id}`);
      if (res.data.ok) {
        setSelected(res.data.data);
      } else {
        setDetailErr("Failed to load member details");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axErr = error as AxiosError<ApiError>;
        const status = axErr.response?.status ?? "network";
        const message = axErr.response?.data?.message ?? axErr.message ?? "Request failed";
        setDetailErr(`Failed to load member (${status}): ${message}`);
      } else {
        setDetailErr("Failed to load member details");
      }
    } finally {
      setLoadingDetail(false);
    }
  }

  const refined = useMemo(() => {
    // Optional local refinement: filter name contains term if server returns broad list
    const t = debounced.trim().toLowerCase();
    if (!t) return list;
    return list.filter((m) => m.name.toLowerCase().includes(t) || m.refCode.toLowerCase().includes(t) || (m.phone || "").toLowerCase().includes(t));
  }, [list, debounced]);

  // Close detail card when clicking outside
  useEffect(() => {
    function onDocClick(ev: MouseEvent) {
      if (!boxRef.current) return;
      const target = ev.target as Node;
      if (!boxRef.current.contains(target)) {
        setSelected(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative" ref={boxRef}>
      <div className="mb-4 flex items-center gap-2">
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search by name, refCode, or phone"
          className="border rounded px-3 py-2 w-full max-w-xl"
        />
        {loading && <span className="text-sm text-gray-500">Searching…</span>}
      </div>

      {err && <div className="text-red-600 mb-3">{err}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Results list */}
        <div className="border rounded bg-white" style={{ minHeight: "50vh" }}>
          <div className="px-3 py-2 border-b text-sm text-gray-600">Results</div>
          {refined.length === 0 ? (
            <div className="p-4 text-gray-500">No matches</div>
          ) : (
            <ul className="divide-y">
              {refined.map((m) => (
                <li
                  key={m.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => openDetail(m.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{m.name}</div>
                      <div className="text-sm text-gray-600">{m.email}</div>
                      <div className="text-xs text-gray-500">
                        Ref: {m.refCode}
                        {m.phone ? ` • ${m.phone}` : ""}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        m.isVerified ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {m.isVerified ? "active" : "inactive"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detail card */}
        <div className="border rounded bg-white" style={{ minHeight: "50vh" }}>
          <div className="px-3 py-2 border-b text-sm text-gray-600">Member Info</div>
          {loadingDetail ? (
            <div className="p-4">Loading member…</div>
          ) : detailErr ? (
            <div className="p-4 text-red-600">{detailErr}</div>
          ) : !selected ? (
            <div className="p-4 text-gray-500">Select a member to view details</div>
          ) : (
            <div className="p-4">
              <div className="text-xl font-semibold text-gray-900">{selected.name}</div>
              <div className="text-gray-700">{selected.email}</div>
              {selected.phone && <div className="text-gray-700">{selected.phone}</div>}

              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    selected.isVerified ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {selected.isVerified ? "active" : "inactive"}
                </span>
                <span className="text-xs text-gray-500">
                  Joined {new Date(selected.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <Info label="Ref Code" value={selected.refCode} />
                <Info label="Referred By" value={selected.referredBy ?? "—"} />
                <Info label="Reg Amount" value={typeof selected.regamount === "number" ? `₹${selected.regamount}` : "—"} />
                <Info label="Member ID" value={selected.id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded border p-3">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-gray-900">{value}</div>
    </div>
  );
}
