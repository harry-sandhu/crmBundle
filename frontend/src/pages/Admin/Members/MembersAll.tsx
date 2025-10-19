import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../../utils/api";
import axios, { AxiosError } from "axios";

type Member = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isVerified: boolean;
  refCode: string;
  referredBy: string | null;
  regamount: number | null;
  joinedAt: string;
  status: "active" | "inactive";
};

type ApiResponse = {
  ok: boolean;
  data: Member[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type ApiError = {
  ok?: boolean;
  message?: string;
  status?: number;
  errors?: string[];
};

type HoverCardState = {
  visible: boolean;
  x: number;
  y: number;
  member: Member | null;
};

export default function MembersAll() {
  const [q, setQ] = useState("");
  const [data, setData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [total, setTotal] = useState(0);

  const [hover, setHover] = useState<HoverCardState>({
    visible: false,
    x: 0,
    y: 0,
    member: null,
  });
  const boxRef = useRef<HTMLDivElement | null>(null);

  // Fetch members (server-side search + pagination)
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get<ApiResponse>("/admin/members", {
          params: { q, page, limit },
        });
        if (cancel) return;
        if (res.data.ok) {
          setData(res.data.data);
          setTotal(res.data.total);
          setErr("");
        } else {
          setErr("Failed to load members");
        }
      } catch (error: unknown) {
        if (cancel) return;
        if (axios.isAxiosError(error)) {
          const axErr = error as AxiosError<ApiError>;
          const status = axErr.response?.status ?? "network";
          const message =
            axErr.response?.data?.message ?? axErr.message ?? "Request failed";
          setErr(`Failed to load members (${status}): ${message}`);
        } else {
          setErr("Failed to load members");
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [q, page, limit]);

  // Optional client refinement
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return data;
    return data.filter(
      (m) =>
        m.name.toLowerCase().includes(t) ||
        m.email.toLowerCase().includes(t) ||
        (m.status || "").toLowerCase().includes(t) ||
        (m.refCode || "").toLowerCase().includes(t)
    );
  }, [q, data]);

  function onQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQ(e.target.value);
    setPage(1);
  }

  // Toggle hover card
  function toggleCard(e: React.MouseEvent, m: Member) {
    const offset = 12;
    setHover((h) => {
      const same = h.visible && h.member?.id === m.id;
      return same
        ? { visible: false, x: 0, y: 0, member: null }
        : { visible: true, x: e.clientX + offset, y: e.clientY + offset, member: m };
    });
  }

  function hideCard() {
    setHover({ visible: false, x: 0, y: 0, member: null });
  }

  // Close card events
  useEffect(() => {
    function onEsc(ev: KeyboardEvent) {
      if (ev.key === "Escape") hideCard();
    }
    function onDocClick(ev: MouseEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(ev.target as Node)) hideCard();
    }
    document.addEventListener("keydown", onEsc);
    document.addEventListener("mousedown", onDocClick);
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.removeEventListener("mousedown", onDocClick);
    };
  }, []);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const onScroll = () => hideCard();
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  // ✅ Toggle Active/Inactive
  const handleToggleActive = async (m: Member) => {
    const newStatus = m.status === "active" ? false : true;
    try {
      await api.patch(`/api/users/${m.refCode}/active`, { active: newStatus });
      setData((prev) =>
        prev.map((u) =>
          u.id === m.id ? { ...u, status: newStatus ? "active" : "inactive" } : u
        )
      );
    } catch (error) {
      console.error("Failed to update user status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  return (
    <div className="relative">
      {/* Controls */}
      <div className="mb-3 flex items-center gap-3">
        <input
          value={q}
          onChange={onQueryChange}
          placeholder="Search by name, email, status, refCode"
          className="border rounded px-3 py-2 w-full max-w-lg"
        />
        <div className="text-sm text-gray-600">
          {loading ? "Loading…" : `${filtered.length} of ${total} members`}
        </div>
      </div>

      {err && <div className="text-red-600 mb-3">{err}</div>}

      {/* Scrollable list */}
      <div
        ref={boxRef}
        className="border rounded bg-white"
        style={{ height: "65vh", overflowY: "auto" }}
      >
        {loading ? (
          <div className="p-6">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-gray-500">No members found</div>
        ) : (
          <ul className="divide-y">
            {filtered.map((m) => (
              <li
                key={m.id}
                className="p-3 hover:bg-gray-50 cursor-pointer"
                onClick={(e) => toggleCard(e, m)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{m.name}</div>
                    <div className="text-sm text-gray-600">{m.email}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* ✅ Toggle Active/Inactive Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(m);
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        m.status === "active"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {m.status === "active" ? "Active" : "Inactive"}
                    </button>
                    <span className="text-xs text-gray-500">
                      Joined {new Date(m.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Ref: {m.refCode}
                  {m.referredBy ? ` • Parent: ${m.referredBy}` : ""}
                  {typeof m.regamount === "number"
                    ? ` • Reg ₹${m.regamount}`
                    : ""}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-3 flex items-center gap-2">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <div className="text-sm text-gray-700">
          Page {page} / {totalPages}
        </div>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>

      {/* Hover Profile Card */}
      {hover.visible && hover.member && (
        <div
          className="fixed z-50 w-80 rounded-lg border bg-white shadow-lg p-3"
          style={{ left: hover.x, top: hover.y }}
        >
          <div className="text-sm text-gray-500 mb-1">Member Profile</div>
          <div className="font-semibold text-gray-900">{hover.member.name}</div>
          <div className="text-gray-700">{hover.member.email}</div>
          {hover.member.phone && (
            <div className="text-gray-700">{hover.member.phone}</div>
          )}
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded text-xs ${
                hover.member.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {hover.member.status}
            </span>
            <span className="text-xs text-gray-500">
              Joined {new Date(hover.member.joinedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            RefCode: {hover.member.refCode}
            {hover.member.referredBy ? ` • Parent: ${hover.member.referredBy}` : ""}
            {typeof hover.member.regamount === "number"
              ? ` • Reg ₹${hover.member.regamount}`
              : ""}
          </div>
          <div className="mt-3 flex justify-end">
            <button className="text-sm text-gray-600 hover:text-gray-900" onClick={hideCard}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
