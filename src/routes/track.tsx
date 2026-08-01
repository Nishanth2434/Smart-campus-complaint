import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, Loader2, Search, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  fetchMyComplaints,
  statusStyles,
  STATUS_FLOW,
  type ComplaintRow,
} from "@/lib/complaints";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Complaint Status — Smart Campus Complaint Portal" },
      {
        name: "description",
        content:
          "Look up a complaint by ID or keyword and see whether it is Pending, In Progress or Resolved.",
      },
      { property: "og:title", content: "Track Your Campus Complaint" },
      {
        property: "og:description",
        content: "Search by complaint ID and follow progress from Pending to Resolved.",
      },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [feedbackFor, setFeedbackFor] = useState<ComplaintRow | null>(null);
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/auth", search: { redirect: "/track" }, replace: true });
    }
  }, [loading, session, navigate]);

  const complaintsQuery = useQuery({
    queryKey: ["my-complaints"],
    queryFn: fetchMyComplaints,
    enabled: !!session,
  });

  const notificationsQuery = useQuery({
    queryKey: ["my-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, message, created_at, is_read")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!session,
  });

  const removeMutation = useMutation({
    mutationFn: async (c: ComplaintRow) => {
      if (c.photo_paths.length) {
        await supabase.storage.from("complaint-photos").remove(c.photo_paths);
      }
      const { error } = await supabase.from("complaints").delete().eq("id", c.id);
      if (error) throw error;
      return c;
    },
    onSuccess: (c) => {
      toast.success("Complaint deleted", { description: `${c.reference} was withdrawn.` });
      qc.invalidateQueries({ queryKey: ["my-complaints"] });
    },
    onError: (e: Error) => toast.error("Could not delete", { description: e.message }),
  });

  const feedbackMutation = useMutation({
    mutationFn: async ({ c, comment }: { c: ComplaintRow; comment: string }) => {
      const { error } = await supabase.from("complaint_feedback").insert({
        complaint_id: c.id,
        user_id: c.user_id,
        rating,
        comment: comment.slice(0, 500),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Thanks for your feedback");
      setFeedbackFor(null);
      setRating(5);
    },
    onError: (e: Error) => toast.error("Could not send feedback", { description: e.message }),
  });

  if (loading || !session) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
      </div>
    );
  }

  const items = complaintsQuery.data ?? [];
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const q = normalize(query);
  const results = q
    ? items.filter((c) =>
        [c.reference, c.title, c.category, c.location, c.status].some((f) =>
          normalize(f).includes(q),
        ),
      )
    : items;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Track your complaints</h1>
      <p className="mt-3 text-muted-foreground">
        Search by complaint ID, title or category to see the latest status.
      </p>

      {(notificationsQuery.data?.length ?? 0) > 0 && (
        <Card className="mt-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-primary" /> Recent updates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {notificationsQuery.data?.map((n) => (
              <p key={n.id}>
                {n.message}{" "}
                <span className="text-xs">
                  · {new Date(n.created_at).toLocaleDateString()}
                </span>
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="mt-8 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="e.g. CMP-10423 or Wi-Fi"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search complaints"
          />
        </div>
        <Button variant="secondary" onClick={() => setQuery("")}>
          Clear
        </Button>
      </div>

      <div className="mt-8 space-y-4">
        {complaintsQuery.isLoading && (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            Loading your complaints…
          </p>
        )}

        {results.map((c) => (
          <Card key={c.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-base">{c.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={statusStyles[c.status]}>
                    {c.status}
                  </Badge>
                  {c.status === "Resolved" && (
                    <Button variant="ghost" size="sm" onClick={() => setFeedbackFor(c)}>
                      <Star className="mr-1 h-4 w-4" /> Feedback
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        aria-label={`Delete complaint ${c.reference}`}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this complaint?</AlertDialogTitle>
                        <AlertDialogDescription>
                          {c.reference} — “{c.title}” will be withdrawn and removed from your
                          tracking list. This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => removeMutation.mutate(c)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-4">
              <p><span className="text-foreground">ID:</span> {c.reference}</p>
              <p><span className="text-foreground">Category:</span> {c.category}</p>
              <p><span className="text-foreground">Location:</span> {c.location}</p>
              <p>
                <span className="text-foreground">Filed:</span>{" "}
                {new Date(c.created_at).toLocaleDateString()}
              </p>
              <div className="sm:col-span-4">
                <ol className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  {STATUS_FLOW.map((s, i) => {
                    const reached = STATUS_FLOW.indexOf(c.status) >= i;
                    return (
                      <li key={s} className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${reached ? "bg-primary" : "bg-border"}`}
                        />
                        <span className={reached ? "text-foreground" : ""}>{s}</span>
                        {i < STATUS_FLOW.length - 1 && (
                          <span className="h-px w-6 bg-border" aria-hidden />
                        )}
                      </li>
                    );
                  })}
                </ol>
                {c.assigned_to && (
                  <p className="mt-2">
                    <span className="text-foreground">Handled by:</span> {c.assigned_to}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {!complaintsQuery.isLoading && results.length === 0 && items.length > 0 && (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No complaints match “{query}”.
          </p>
        )}
        {!complaintsQuery.isLoading && items.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            <p>You have no complaints yet.</p>
            <Button asChild className="mt-4">
              <Link to="/submit">Report an issue</Link>
            </Button>
          </div>
        )}
      </div>

      <Dialog open={!!feedbackFor} onOpenChange={(open) => !open && setFeedbackFor(null)}>
        <DialogContent>
          {feedbackFor && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const comment = String(new FormData(e.currentTarget).get("comment") ?? "");
                feedbackMutation.mutate({ c: feedbackFor, comment });
              }}
              className="space-y-4"
            >
              <DialogHeader>
                <DialogTitle>How was the resolution?</DialogTitle>
                <DialogDescription>
                  {feedbackFor.reference} — {feedbackFor.title}
                </DialogDescription>
              </DialogHeader>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`Rate ${n} out of 5`}
                    onClick={() => setRating(n)}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                    />
                  </button>
                ))}
              </div>

              <Textarea name="comment" rows={4} placeholder="Anything else we should know?" />

              <Button type="submit" disabled={feedbackMutation.isPending}>
                Send feedback
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
