import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Download, FileText, Timer, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

import { categories } from "@/lib/portal-data";
import { fetchAllComplaints, statusStyles, STATUS_FLOW } from "@/lib/complaints";
import { useAuth } from "@/lib/auth";
import { demoComplaints, useDemoMode, isDemoMode } from "@/lib/demo-mode";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — Campus Complaint Admin" },
      {
        name: "description",
        content:
          "Complaint analytics for campus staff: status split, category hotspots, weekly trends and resolution performance.",
      },
      { property: "og:title", content: "Reports & Analytics — Campus Complaints" },
      {
        property: "og:description",
        content: "Status split, category hotspots, weekly trends and resolution performance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage,
});

const statusColors: Record<string, string> = {
  Pending: "var(--warning)",
  Assigned: "var(--accent)",
  "In Progress": "var(--info)",
  Resolved: "var(--success)",
};

function ReportsPage() {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAuth();
  const demo = useDemoMode();

  useEffect(() => {
    if (!demo && !isDemoMode() && !loading && (!session || !isAdmin))
      navigate({ to: "/admin/login", replace: true });
  }, [demo, loading, session, isAdmin, navigate]);

  const complaintsQuery = useQuery({
    queryKey: ["all-complaints"],
    queryFn: fetchAllComplaints,
    enabled: !demo && !!session && isAdmin,
  });

  const source = demo ? demoComplaints : (complaintsQuery.data ?? []);
  const complaints = source.map((c) => ({
    id: c.reference,
    title: c.title,
    category: c.category,
    location: c.location,
    status: c.status,
    priority: c.priority,
    submitted: new Date(c.created_at).toLocaleDateString(),
    assignedTo: c.assigned_to ?? "Unassigned",
  }));
  const total = Math.max(complaints.length, 1);

  const statusData = STATUS_FLOW.map((s) => ({
    name: s,
    value: complaints.filter((c) => c.status === s).length,
  }));

  const categoryData = categories
    .map((c) => ({ name: c.name, count: complaints.filter((x) => x.category === c.name).length }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  const trendData = [
    { week: "Wk 1", received: 4, resolved: 3 },
    { week: "Wk 2", received: 6, resolved: 4 },
    { week: "Wk 3", received: 5, resolved: 5 },
    { week: "Wk 4", received: complaints.length, resolved: statusData[2].value },
  ];

  const resolved = statusData[2].value;
  const rate = Math.round((resolved / total) * 100);

  const kpis = [
    { label: "Complaints logged", value: complaints.length, hint: "this month", icon: BarChart3 },
    { label: "Resolution rate", value: `${rate}%`, hint: `${resolved} closed`, icon: TrendingUp },
    { label: "Avg. resolution time", value: "2.4 days", hint: "target 3 days", icon: Timer },
    { label: "Open backlog", value: complaints.length - resolved, hint: "pending + in progress", icon: BarChart3 },
  ];

  const download = () => {
    const rows = [
      ["ID", "Title", "Category", "Location", "Status", "Priority", "Submitted", "Assigned to"],
      ...complaints.map((c) => [
        c.id, c.title, c.category, c.location, c.status, c.priority, c.submitted, c.assignedTo,
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "campus-complaints-report.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded", { description: "campus-complaints-report.csv" });
  };

  const downloadPdf = async () => {
    const [{ jsPDF }, autoTableMod] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);
    const autoTable = autoTableMod.default;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const generated = new Date().toLocaleString();

    doc.setFontSize(18);
    doc.text("Smart Campus Complaint Portal", 40, 50);
    doc.setFontSize(13);
    doc.text("Reports & Analytics Summary", 40, 70);
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Generated ${generated}`, 40, 86);
    doc.setTextColor(0);
    doc.setDrawColor(200);
    doc.line(40, 96, pageWidth - 40, 96);

    autoTable(doc, {
      startY: 112,
      head: [["Key metric", "Value", "Note"]],
      body: kpis.map((k) => [k.label, String(k.value), k.hint]),
      headStyles: { fillColor: [15, 118, 110] },
      styles: { fontSize: 10, cellPadding: 6 },
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 24,
      head: [["Status", "Complaints", "Share"]],
      body: statusData.map((s) => [
        s.name,
        String(s.value),
        `${Math.round((s.value / total) * 100)}%`,
      ]),
      headStyles: { fillColor: [15, 118, 110] },
      styles: { fontSize: 10, cellPadding: 6 },
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 24,
      head: [["Category", "Complaints"]],
      body: categoryData.map((c) => [c.name, String(c.count)]),
      headStyles: { fillColor: [15, 118, 110] },
      styles: { fontSize: 10, cellPadding: 6 },
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 24,
      head: [["Week", "Received", "Resolved"]],
      body: trendData.map((t) => [t.week, String(t.received), String(t.resolved)]),
      headStyles: { fillColor: [15, 118, 110] },
      styles: { fontSize: 10, cellPadding: 6 },
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 24,
      head: [["ID", "Complaint", "Category", "Location", "Priority", "Submitted", "Status"]],
      body: complaints.map((c) => [
        c.id, c.title, c.category, c.location, c.priority, c.submitted, c.status,
      ]),
      headStyles: { fillColor: [15, 118, 110] },
      styles: { fontSize: 8, cellPadding: 4, overflow: "linebreak" },
      columnStyles: { 1: { cellWidth: 150 } },
    });

    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(140);
      doc.text(
        `Page ${i} of ${pages} · Confidential — for campus administration`,
        40,
        doc.internal.pageSize.getHeight() - 24,
      );
    }

    doc.save("campus-complaints-report.pdf");
    toast.success("PDF report generated", { description: "campus-complaints-report.pdf" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Reports &amp; analytics</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
            Live analytics generated from complaints submitted by students.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Button variant="outline" asChild className="col-span-2 sm:col-span-1">
            <Link to="/admin/dashboard">Back to dashboard</Link>
          </Button>
          <Button onClick={download}>
            <Download className="mr-1 h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={downloadPdf}>
            <FileText className="mr-1 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="flex items-center justify-between gap-2 p-4 pt-4 sm:pt-6">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground sm:text-sm">{k.label}</p>
                <p className="mt-1 text-2xl font-semibold sm:text-3xl">{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.hint}</p>
              </div>
              <k.icon className="h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Status breakdown</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95}>
                  {statusData.map((s) => (
                    <Cell key={s.name} fill={statusColors[s.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Complaints by category</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} fontSize={11} />
                <YAxis allowDecimals={false} fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Weekly trend — received vs resolved</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="received" stroke="var(--primary)" strokeWidth={2} />
                <Line type="monotone" dataKey="resolved" stroke="var(--success)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle className="text-base">Detailed report</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.id}</TableCell>
                  <TableCell>{c.category}</TableCell>
                  <TableCell className="text-muted-foreground">{c.location}</TableCell>
                  <TableCell>{c.priority}</TableCell>
                  <TableCell className="text-muted-foreground">{c.submitted}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusStyles[c.status]}>{c.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
