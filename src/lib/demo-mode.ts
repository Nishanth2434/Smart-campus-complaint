import { useEffect, useState } from "react";

import type { ComplaintRow, StatusHistoryRow } from "@/lib/complaints";

const KEY = "campus-admin-demo";

export function isDemoMode() {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(KEY) === "1";
}

export function setDemoMode(on: boolean) {
  if (typeof window === "undefined") return;
  if (on) window.sessionStorage.setItem(KEY, "1");
  else window.sessionStorage.removeItem(KEY);
  window.dispatchEvent(new Event("demo-mode-change"));
}

export function useDemoMode() {
  const [demo, setDemo] = useState(false);
  useEffect(() => {
    const sync = () => setDemo(isDemoMode());
    sync();
    window.addEventListener("demo-mode-change", sync);
    return () => window.removeEventListener("demo-mode-change", sync);
  }, []);
  return demo;
}

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

export const demoComplaints: ComplaintRow[] = [
  {
    id: "demo-1",
    reference: "CMP0001",
    user_id: "demo-student-1",
    title: "Projector not working in Room 204",
    description:
      "The ceiling projector in Room 204 does not power on. Lectures are being delayed every morning.",
    category: "Classroom",
    priority: "High",
    location: "Academic Block A · Room 204",
    status: "In Progress",
    assigned_to: "Maintenance Team",
    is_anonymous: false,
    photo_paths: [],
    resolved_at: null,
    created_at: daysAgo(2),
  },
  {
    id: "demo-2",
    reference: "CMP0002",
    user_id: "demo-student-2",
    title: "Water cooler leaking on ground floor",
    description: "Continuous leakage near the ground floor water cooler making the floor slippery.",
    category: "Water Supply",
    priority: "Medium",
    location: "Academic Block B · Ground floor",
    status: "Assigned",
    assigned_to: "Plumbing Dept.",
    is_anonymous: false,
    photo_paths: [],
    resolved_at: null,
    created_at: daysAgo(4),
  },
  {
    id: "demo-3",
    reference: "CMP0003",
    user_id: "demo-student-3",
    title: "Wi-Fi drops in the library reading hall",
    description: "Connection disconnects every few minutes in the first-floor reading hall.",
    category: "Wi-Fi / Internet",
    priority: "Medium",
    location: "Central Library · First floor",
    status: "Pending",
    assigned_to: null,
    is_anonymous: true,
    photo_paths: [],
    resolved_at: null,
    created_at: daysAgo(1),
  },
  {
    id: "demo-4",
    reference: "CMP0004",
    user_id: "demo-student-4",
    title: "Corridor lights not switching on",
    description: "Two tube lights in the hostel corridor have been dead for a week.",
    category: "Electrical",
    priority: "High",
    location: "Boys Hostel · Block C",
    status: "Resolved",
    assigned_to: "Electrical Dept.",
    is_anonymous: false,
    photo_paths: [],
    resolved_at: daysAgo(3),
    created_at: daysAgo(8),
  },
  {
    id: "demo-5",
    reference: "CMP0005",
    user_id: "demo-student-5",
    title: "Campus bus arriving late in the evening",
    description: "Route 4 bus has been leaving 25 minutes behind schedule for the past two weeks.",
    category: "Transport",
    priority: "Low",
    location: "Main Gate · Bus bay",
    status: "Pending",
    assigned_to: null,
    is_anonymous: false,
    photo_paths: [],
    resolved_at: null,
    created_at: daysAgo(6),
  },
  {
    id: "demo-6",
    reference: "CMP0006",
    user_id: "demo-student-6",
    title: "Washrooms not cleaned near the canteen",
    description: "Washrooms beside the canteen were not cleaned for two consecutive days.",
    category: "Cleanliness",
    priority: "Medium",
    location: "Canteen Block",
    status: "Resolved",
    assigned_to: "Housekeeping",
    is_anonymous: true,
    photo_paths: [],
    resolved_at: daysAgo(1),
    created_at: daysAgo(5),
  },
];

export const demoProfiles = [
  {
    id: "demo-student-1",
    full_name: "Aarav Menon",
    roll_id: "21CS045",
    email: "aarav@college.edu",
  },
  { id: "demo-student-2", full_name: "Divya Rao", roll_id: "22EC112", email: "divya@college.edu" },
  {
    id: "demo-student-3",
    full_name: "Karthik S",
    roll_id: "21ME008",
    email: "karthik@college.edu",
  },
  {
    id: "demo-student-4",
    full_name: "Nisha Verma",
    roll_id: "23IT076",
    email: "nisha@college.edu",
  },
  { id: "demo-student-5", full_name: "Rahul Iyer", roll_id: "22CS130", email: "rahul@college.edu" },
  {
    id: "demo-student-6",
    full_name: "Sneha Pillai",
    roll_id: "21EE054",
    email: "sneha@college.edu",
  },
];

export function demoHistory(c: ComplaintRow): StatusHistoryRow[] {
  const rows: StatusHistoryRow[] = [
    {
      id: `${c.id}-h0`,
      complaint_id: c.id,
      old_status: null,
      new_status: "Pending",
      note: "Complaint submitted",
      created_at: c.created_at,
    },
  ];
  if (c.status !== "Pending") {
    rows.push({
      id: `${c.id}-h1`,
      complaint_id: c.id,
      old_status: "Pending",
      new_status: c.status,
      note: c.assigned_to ? `Assigned to ${c.assigned_to}` : "",
      created_at: c.resolved_at ?? c.created_at,
    });
  }
  return rows;
}
