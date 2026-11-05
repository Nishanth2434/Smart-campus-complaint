import type { ComplaintStatus } from "../data/mockData";

const styles: Record<ComplaintStatus, string> = {
  Resolved: "bg-status-resolved-bg text-status-resolved border-status-resolved/30",
  Pending: "bg-status-pending-bg text-status-pending border-status-pending/30",
  "In Progress": "bg-status-progress-bg text-status-progress border-status-progress/30",
};

const dotStyles: Record<ComplaintStatus, string> = {
  Resolved: "bg-status-resolved",
  Pending: "bg-status-pending",
  "In Progress": "bg-status-progress",
};

export default function StatusBadge({ status }: { status: ComplaintStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[status]}`} />
      {status}
    </span>
  );
}
