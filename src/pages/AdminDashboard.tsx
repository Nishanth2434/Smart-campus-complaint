import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { allCategories, type Complaint, type ComplaintStatus } from "../data/mockData";
import StatusBadge from "../components/StatusBadge";
import { Reveal } from "../components/Reveal";

// Enhanced initial complaint data for the admin dashboard
const initialComplaints: (Complaint & { priority: "High" | "Medium" | "Low"; location: string; description: string; reporter: string })[] = [
  {
    id: "CMP-1042",
    title: "Projector not working — Room B-204",
    status: "In Progress",
    category: "Classroom",
    location: "Academic Block B, Room 204",
    submittedAt: "2026-07-28",
    priority: "High",
    description: "HDMI port is faulty and the bulb does not turn on. Lectures cannot be projected.",
    reporter: "Prof. R. Menon (CSE Dept)",
  },
  {
    id: "CMP-1041",
    title: "No water on 2nd floor washroom",
    status: "Pending",
    category: "Water Supply",
    location: "Hostel Block 3, 2nd Floor",
    submittedAt: "2026-07-28",
    priority: "High",
    description: "Main overhead tank pipeline leaking, no water supply in washrooms since morning.",
    reporter: "Siddharth K. (Roll 24CS109)",
  },
  {
    id: "CMP-1038",
    title: "Wi-Fi dead zone near central library",
    status: "Resolved",
    category: "Wi-Fi / Internet",
    location: "Central Library, 1st Floor Study Hall",
    submittedAt: "2026-07-26",
    priority: "Medium",
    description: "Access point AP-LIB-04 was rebooted and firmware re-flashed. Signal strength restored.",
    reporter: "Ananya S. (Roll 23EC044)",
  },
  {
    id: "CMP-1035",
    title: "Broken bench in Lecture Hall 1",
    status: "Pending",
    category: "Furniture",
    location: "Lecture Hall Complex 1",
    submittedAt: "2026-07-25",
    priority: "Low",
    description: "Right bench wood support cracked. Needs carpentry inspection.",
    reporter: "Karan Verma (Roll 25ME031)",
  },
  {
    id: "CMP-1032",
    title: "Flickering lights in corridor",
    status: "In Progress",
    category: "Electrical",
    location: "Science Block, Corridor C",
    submittedAt: "2026-07-24",
    priority: "Medium",
    description: "Ballast failure in fluorescent tube light causing continuous flicker.",
    reporter: "Lab Assistant Mohan",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [complaints, setComplaints] = useState(initialComplaints);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedComplaint, setSelectedComplaint] = useState<typeof initialComplaints[0] | null>(null);

  // Statistics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "Pending").length;
  const inProgressCount = complaints.filter((c) => c.status === "In Progress").length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;

  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || c.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  function updateStatus(id: string, newStatus: ComplaintStatus) {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    if (selectedComplaint?.id === id) {
      setSelectedComplaint((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  }

  function handleSignOut() {
    logout();
    navigate("/admin/login");
  }

  return (
    <section className="min-h-[calc(100vh-72px)] bg-paper py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <Reveal>
          <div className="flex flex-col justify-between gap-4 border-b-2 border-ink-950 pb-6 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-ink-950 bg-brand-500 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-ink-950">
                  Staff Control Panel
                </span>
                <span className="font-mono text-xs text-ink-500">
                  Logged in as <strong className="text-ink-950">{user?.name || "Admin (Demo Mode)"}</strong>
                </span>
              </div>
              <h1 className="mt-2 font-display text-3xl font-bold text-ink-950 sm:text-4xl">
                Campus Complaints Management
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/submit"
                className="rounded-md border-2 border-ink-950 bg-paper-alt px-4 py-2 text-xs font-bold text-ink-950 transition-colors hover:bg-brand-100"
              >
                + New Complaint
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-md border-2 border-ink-950 bg-brand-500 px-4 py-2 text-xs font-bold text-ink-950 shadow-[3px_3px_0_0_#14110d] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#14110d]"
              >
                Sign Out
              </button>
            </div>
          </div>
        </Reveal>

        {/* Analytics Counters */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Reveal delay={0.05}>
            <div className="rounded-xl border-2 border-ink-950 bg-card p-5 shadow-[4px_4px_0_0_#14110d]">
              <p className="font-mono text-xs font-semibold uppercase text-ink-500">Total Logged</p>
              <p className="mt-2 font-display text-3xl font-black text-ink-950">{totalCount}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-xl border-2 border-ink-950 bg-status-pending-bg p-5 shadow-[4px_4px_0_0_#14110d]">
              <p className="font-mono text-xs font-semibold uppercase text-status-pending">Pending Review</p>
              <p className="mt-2 font-display text-3xl font-black text-status-pending">{pendingCount}</p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-xl border-2 border-ink-950 bg-status-progress-bg p-5 shadow-[4px_4px_0_0_#14110d]">
              <p className="font-mono text-xs font-semibold uppercase text-status-progress">In Progress</p>
              <p className="mt-2 font-display text-3xl font-black text-status-progress">{inProgressCount}</p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="rounded-xl border-2 border-ink-950 bg-status-resolved-bg p-5 shadow-[4px_4px_0_0_#14110d]">
              <p className="font-mono text-xs font-semibold uppercase text-status-resolved">Resolved</p>
              <p className="mt-2 font-display text-3xl font-black text-status-resolved">{resolvedCount}</p>
            </div>
          </Reveal>
        </div>

        {/* Filters and Search */}
        <div className="mt-8 flex flex-col gap-4 rounded-xl border-2 border-ink-950 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-bold uppercase text-ink-700">Filter Status:</span>
            {["all", "Pending", "In Progress", "Resolved"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`rounded-md border border-ink-950 px-3 py-1.5 text-xs font-bold transition-all ${
                  statusFilter === s
                    ? "bg-ink-950 text-paper"
                    : "bg-paper-alt text-ink-800 hover:bg-brand-100"
                }`}
              >
                {s === "all" ? "All Statuses" : s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="cat-filter" className="font-mono text-xs font-bold uppercase text-ink-700">
              Category:
            </label>
            <select
              id="cat-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border border-ink-950 bg-paper-alt px-3 py-1.5 text-xs font-bold text-ink-950 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Complaints Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border-2 border-ink-950 bg-card shadow-[6px_6px_0_0_#14110d]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-ink-950 bg-paper-alt font-mono text-xs uppercase tracking-wider text-ink-700">
                  <th className="px-5 py-3.5">ID & Date</th>
                  <th className="px-5 py-3.5">Complaint Title</th>
                  <th className="px-5 py-3.5">Category & Location</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y border-ink-950/15 text-sm">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center font-mono text-sm text-ink-500">
                      No complaints found matching selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c) => (
                    <tr key={c.id} className="transition-colors hover:bg-brand-50/60">
                      <td className="px-5 py-4 font-mono">
                        <span className="font-bold text-ink-950">{c.id}</span>
                        <span className="block text-xs text-ink-400">{c.submittedAt}</span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-ink-950">{c.title}</p>
                        <p className="text-xs text-ink-500 line-clamp-1">{c.description}</p>
                      </td>
                      <td className="px-5 py-4 text-xs">
                        <span className="font-semibold text-ink-950">{c.category}</span>
                        <span className="block text-ink-500">{c.location}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded px-2 py-0.5 font-mono text-[11px] font-bold ${
                            c.priority === "High"
                              ? "bg-red-100 text-red-800"
                              : c.priority === "Medium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedComplaint(c)}
                            className="rounded border border-ink-950 bg-paper-alt px-2.5 py-1 text-xs font-bold text-ink-950 hover:bg-brand-200"
                          >
                            Details
                          </button>
                          {c.status !== "Resolved" ? (
                            <button
                              type="button"
                              onClick={() => updateStatus(c.id, "Resolved")}
                              className="rounded border border-ink-950 bg-status-resolved-bg px-2.5 py-1 text-xs font-bold text-status-resolved hover:opacity-80"
                            >
                              ✓ Resolve
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => updateStatus(c.id, "In Progress")}
                              className="rounded border border-ink-950 bg-status-progress-bg px-2.5 py-1 text-xs font-bold text-status-progress hover:opacity-80"
                            >
                              Re-open
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal / Details Drawer */}
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border-2 border-ink-950 bg-card p-6 shadow-[8px_8px_0_0_#14110d] sm:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold uppercase text-brand-600">
                    {selectedComplaint.id} · {selectedComplaint.category}
                  </span>
                  <h3 className="mt-1 font-display text-xl font-bold text-ink-950">
                    {selectedComplaint.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="rounded-md border border-ink-950 p-1 text-ink-600 hover:bg-ink-100"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge status={selectedComplaint.status} />
                <span className="rounded bg-paper-alt px-2 py-0.5 text-xs font-medium text-ink-700">
                  Priority: <strong>{selectedComplaint.priority}</strong>
                </span>
                <span className="rounded bg-paper-alt px-2 py-0.5 text-xs font-medium text-ink-700">
                  Location: <strong>{selectedComplaint.location}</strong>
                </span>
              </div>

              <div className="mt-4 space-y-3 rounded-lg border border-ink-950/15 bg-paper-alt p-4 text-xs">
                <div>
                  <span className="font-mono font-bold text-ink-500">Reported By:</span>
                  <p className="font-semibold text-ink-950">{selectedComplaint.reporter}</p>
                </div>
                <div>
                  <span className="font-mono font-bold text-ink-500">Description:</span>
                  <p className="mt-0.5 text-ink-800">{selectedComplaint.description}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-ink-950/15 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink-700">Change Status:</span>
                  {(["Pending", "In Progress", "Resolved"] as ComplaintStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateStatus(selectedComplaint.id, st)}
                      className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${
                        selectedComplaint.status === st
                          ? "border border-ink-950 bg-ink-950 text-paper"
                          : "border border-ink-950/30 bg-card text-ink-700 hover:bg-brand-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="rounded border border-ink-950 bg-brand-500 px-4 py-1.5 text-xs font-bold text-ink-950"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
