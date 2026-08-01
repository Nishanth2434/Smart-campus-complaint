import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Eye,
  ListChecks,
  Loader2,
  Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  fetchAllComplaints,
  fetchStatusHistory,
  signedPhotoUrls,
  statusStyles,
  STAFF_OPTIONS,
  STATUS_FLOW,
  type ComplaintRow,
  type ComplaintStatus,
} from "@/lib/complaints";
import { categories } from "@/lib/portal-data";
import {
  demoComplaints,
  demoHistory,
  demoProfiles,
  setDemoMode,
  useDemoMode, isDemoMode,
} from "@/lib/demo-mode";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Smart Campus Complaint Portal" },
      {
        name: "description",
        content:
          "Overview of campus complaints: totals by status, category hotspots and a filterable complaint table.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Dashboard — Campus Complaints" },
      {
        property: "og:description",
        content: "Totals by status, category hotspots and a filterable complaint table.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { session, isAdmin, loading } = useAuth();
  const demo = useDemoMode();
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<ComplaintRow | null>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [demoRows, setDemoRows] = useState<ComplaintRow[]>(demoComplaints);

  useEffect(() => {
    if (!demo && !isDemoMode() && !loading && (!session || !isAdmin))
      navigate({ to: "/admin/login", replace: true });
  }, [demo, loading, session, isAdmin, navigate]);

  const complaintsQuery = useQuery({
    queryKey: ["all-complaints"],
    queryFn: fetchAllComplaints,
    enabled: !demo && !!session && isAdmin,
  });

  const profilesQuery = useQuery({
    queryKey: ["all-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id, full_name, roll_id, email");
      return data ?? [];
    },
    enabled: !demo && !!session && isAdmin,
  });

  const historyQuery = useQuery({
    queryKey: ["complaint-history", selected?.id],
    queryFn: () => fetchStatusHistory(selected!.id),
    enabled: !demo && !!selected,
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      c,
      patch,
    }: {
      c: ComplaintRow;
      patch: Partial<Pick<ComplaintRow, "status" | "assigned_to">>;
    }) => {
      if (demo) return { c, patch };
      const { error } = await supabase.from("complaints").update(patch).eq("id", c.id);
      if (error) throw error;
      return { c, patch };
    },
    onSuccess: ({ c, patch }) => {
      if (demo) {
        setDemoRows((prev) => prev.map((r) => (r.id === c.id ? { ...r, ...patch } : r)));
      }
      qc.invalidateQueries({ queryKey: ["all-complaints"] });
      qc.invalidateQueries({ queryKey: ["complaint-history", c.id] });
      setSelected((prev) => (prev && prev.id === c.id ? { ...prev, ...patch } : prev));
      toast.success(
        patch.status ? `${c.reference} → ${patch.status}` : `${c.reference} assigned`,
        { description: c.title },
      );
    },
    onError: (e: Error) => toast.error("Update failed", { description: e.message }),
  });

  useEffect(() => {
    let active = true;
    if (!selected || selected.photo_paths.length === 0) {
      setPhotoUrls([]);
      return;
    }
    void signedPhotoUrls(selected.photo_paths).then((urls) => {
      if (active) setPhotoUrls(urls);
    });
    return () => {
      active = false;
    };
  }, [selected]);

  if (!demo && (loading || !session || !isAdmin)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Checking access…
      </div>
    );
  }

  const items = demo ? demoRows : (complaintsQuery.data ?? []);
  const profileList = demo ? demoProfiles : (profilesQuery.data ?? []);
  const profileFor = (id: string) => profileList.find((p) => p.id === id);
  const historyRows =
    demo && selected ? demoHistory(selected) : (historyQuery.data ?? []);
  const reporterOf = (c: ComplaintRow) => {
    if (c.is_anonymous) return "Anonymous";
    const p = profileFor(c.user_id);
    if (!p) return "Student";
    return p.roll_id ? `${p.full_name} (${p.roll_id})` : p.full_name || p.email;
  };

  const rows = items.filter(
    (c) =>
      (status === "all" || c.status === status) &&
      (category === "all" || c.category === category),
  );

  const stats = [
    { label: "Total complaints", value: items.length, icon: ListChecks },
    { label: "Pending", value: items.filter((c) => c.status === "Pending").length, icon: AlertTriangle },
    {
      label: "Assigned / in progress",
      value: items.filter((c) => c.status === "Assigned" || c.status === "In Progress").length,
      icon: Clock,
    },
    { label: "Resolved", value: items.filter((c) => c.status === "Resolved").length, icon: CheckCircle2 },
  ];

  const byCategory = categories
    .map((c) => ({ name: c.name, count: items.filter((x) => x.category === c.name).length }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);
  const max = Math.max(...byCategory.map((c) => c.count), 1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-16">
      {demo && (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-dashed bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Demo mode.</span> These are sample
            complaints — real student data requires a staff sign in.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDemoMode(false);
              navigate({ to: "/admin/login", replace: true });
            }}
          >
            Exit demo
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Admin dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
            Live complaints from students — updates are saved instantly.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link to="/admin/reports">
            <BarChart3 className="mr-1 h-4 w-4" /> Reports &amp; analytics
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center justify-between gap-2 p-4 pt-4 sm:pt-6">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground sm:text-sm">{s.label}</p>
                <p className="mt-1 text-2xl font-semibold sm:text-3xl">{s.value}</p>
              </div>
              <s.icon className="h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Complaints by category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {byCategory.length === 0 && (
              <p className="text-sm text-muted-foreground">No complaints yet.</p>
            )}
            {byCategory.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-sm">
                  <span>{c.name}</span>
                  <span className="text-muted-foreground">{c.count}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(c.count / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">All complaints</CardTitle>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {STATUS_FLOW.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            {/* Mobile: stacked cards */}
            <div className="space-y-3 md:hidden">
              {rows.map((c) => (
                <div key={c.id} className="rounded-xl border border-border p-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{c.title}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {c.reference} · {c.category} · {c.location}
                      </p>
                    </div>
                    <Badge variant="outline" className={`shrink-0 ${statusStyles[c.status]}`}>
                      {c.status}
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Select
                      value={c.assigned_to ?? "unassigned"}
                      onValueChange={(v) =>
                        updateMutation.mutate({
                          c,
                          patch: { assigned_to: v === "unassigned" ? null : v },
                        })
                      }
                    >
                      <SelectTrigger className="h-9 w-full text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {STAFF_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={c.status}
                      onValueChange={(v) =>
                        updateMutation.mutate({ c, patch: { status: v as ComplaintStatus } })
                      }
                    >
                      <SelectTrigger className="h-9 w-full text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUS_FLOW.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setSelected(c)}>
                      <Eye className="mr-1 h-4 w-4" /> View
                    </Button>
                    {c.status === "Resolved" ? (
                      <span className="self-center text-center text-xs text-muted-foreground">
                        Closed
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateMutation.mutate({ c, patch: { status: "Resolved" } })}
                      >
                        <CheckCircle2 className="mr-1 h-4 w-4" /> Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {rows.length === 0 && (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  {complaintsQuery.isLoading
                    ? "Loading complaints…"
                    : "No complaints match these filters."}
                </p>
              )}
            </div>

            <div className="hidden overflow-x-auto md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Complaint</TableHead>
                  <TableHead>Assigned to</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.reference}</TableCell>
                    <TableCell>
                      <span className="block">{c.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {c.category} · {c.location}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={c.assigned_to ?? "unassigned"}
                        onValueChange={(v) =>
                          updateMutation.mutate({
                            c,
                            patch: { assigned_to: v === "unassigned" ? null : v },
                          })
                        }
                      >
                        <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {STAFF_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={c.status}
                        onValueChange={(v) =>
                          updateMutation.mutate({ c, patch: { status: v as ComplaintStatus } })
                        }
                      >
                        <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUS_FLOW.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setSelected(c)}>
                          <Eye className="mr-1 h-4 w-4" /> View
                        </Button>
                        {c.status === "Resolved" ? (
                          <span className="self-center text-xs text-muted-foreground">Closed</span>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateMutation.mutate({ c, patch: { status: "Resolved" } })}
                          >
                            <CheckCircle2 className="mr-1 h-4 w-4" /> Mark resolved
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      {complaintsQuery.isLoading
                        ? "Loading complaints…"
                        : "No complaints match these filters."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-6">{selected.title}</DialogTitle>
                <DialogDescription>
                  {selected.reference} · {selected.category} · {selected.location} · submitted{" "}
                  {new Date(selected.created_at).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={statusStyles[selected.status]}>
                  {selected.status}
                </Badge>
                <Badge variant="secondary">Priority: {selected.priority}</Badge>
                <Badge variant="secondary">
                  Assigned: {selected.assigned_to ?? "Unassigned"}
                </Badge>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-medium">Reported by</h4>
                <p className="text-sm text-muted-foreground">{reporterOf(selected)}</p>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-medium">Complaint details</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {selected.description}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="h-4 w-4 text-muted-foreground" /> Photo evidence
                  <span className="text-xs font-normal text-muted-foreground">
                    (visible to admins only)
                  </span>
                </h4>
                {selected.photo_paths.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {photoUrls.map((src, i) => (
                      <img
                        key={src}
                        src={src}
                        alt={`Evidence ${i + 1} for complaint ${selected.reference}`}
                        loading="lazy"
                        className="h-44 w-full rounded-lg border border-border object-cover"
                      />
                    ))}
                    {photoUrls.length === 0 && (
                      <p className="text-sm text-muted-foreground">Loading photos…</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No photos were attached.</p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Status history</h4>
                <ol className="space-y-3 border-l border-border pl-4">
                  {historyRows.map((h) => (
                    <li key={h.id} className="relative text-sm">
                      <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                      <span className="font-medium">
                        {h.old_status ? `${h.old_status} → ${h.new_status}` : h.new_status}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {new Date(h.created_at).toLocaleString()}
                        {h.note ? ` · ${h.note}` : ""}
                      </span>
                    </li>
                  ))}
                  {historyRows.length === 0 && (
                    <li className="text-sm text-muted-foreground">
                      {historyQuery.isLoading ? "Loading history…" : "No recorded changes yet."}
                    </li>
                  )}
                </ol>
              </div>

              {selected.status !== "Resolved" && (
                <Button
                  onClick={() => updateMutation.mutate({ c: selected, patch: { status: "Resolved" } })}
                >
                  <CheckCircle2 className="mr-1 h-4 w-4" /> Mark resolved
                </Button>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
