import { supabase } from "@/integrations/supabase/client";

export type ComplaintStatus = "Pending" | "Assigned" | "In Progress" | "Resolved";

export const STATUS_FLOW: ComplaintStatus[] = ["Pending", "Assigned", "In Progress", "Resolved"];

export type StatusHistoryRow = {
  id: string;
  complaint_id: string;
  old_status: ComplaintStatus | null;
  new_status: ComplaintStatus;
  note: string;
  created_at: string;
};
export type ComplaintPriority = "Low" | "Medium" | "High";

export type ComplaintRow = {
  id: string;
  reference: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  priority: ComplaintPriority;
  location: string;
  status: ComplaintStatus;
  assigned_to: string | null;
  is_anonymous: boolean;
  photo_paths: string[];
  resolved_at: string | null;
  created_at: string;
};

export const STAFF_OPTIONS = [
  "Maintenance Team",
  "Electrical Dept.",
  "Plumbing Dept.",
  "Housekeeping",
  "IT Support",
  "Transport Office",
  "Hostel Warden",
  "Library Desk",
  "Security Office",
];

export async function fetchMyComplaints() {
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ComplaintRow[];
}

export async function fetchAllComplaints() {
  return fetchMyComplaints(); // RLS returns every row for admins
}

export async function signedPhotoUrls(paths: string[]) {
  if (!paths.length) return [];
  const { data, error } = await supabase.storage
    .from("complaint-photos")
    .createSignedUrls(paths, 60 * 10);
  if (error) throw error;
  return (data ?? []).map((d) => d.signedUrl).filter(Boolean) as string[];
}

export async function fetchStatusHistory(complaintId: string) {
  const { data, error } = await supabase
    .from("complaint_status_history")
    .select("id, complaint_id, old_status, new_status, note, created_at")
    .eq("complaint_id", complaintId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as StatusHistoryRow[];
}

export const statusStyles: Record<ComplaintStatus, string> = {
  Pending: "bg-warning/15 text-warning-foreground border-warning/30",
  Assigned: "bg-accent/30 text-accent-foreground border-accent/50",
  "In Progress": "bg-info/15 text-info border-info/30",
  Resolved: "bg-success/15 text-success border-success/30",
};
