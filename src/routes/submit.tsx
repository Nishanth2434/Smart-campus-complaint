import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ImagePlus, Loader2, Send, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { categories } from "@/lib/portal-data";
import { classifyComplaint } from "@/lib/ai.functions";
import { Typewriter } from "@/components/ui/typewriter";

const searchSchema = z.object({
  location: z.string().max(120).optional(),
  category: z.string().max(40).optional(),
});

export const Route = createFileRoute("/submit")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Submit a Complaint — Smart Campus Complaint Portal" },
      {
        name: "description",
        content:
          "File a campus complaint in under a minute: choose a category, add location, description and photo evidence.",
      },
      { property: "og:title", content: "Submit a Campus Complaint" },
      {
        property: "og:description",
        content: "Choose a category, add details and photos, and get a trackable complaint ID.",
      },
    ],
  }),
  component: SubmitPage,
});

const schema = z.object({
  title: z.string().trim().min(4, "Give your complaint a short title").max(120),
  description: z.string().trim().min(10, "Please describe the issue").max(2000),
  location: z.string().trim().min(2, "Where is the issue?").max(120),
});

function SubmitPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/submit" });
  const { session, profile, loading } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState(
    search.category && categories.some((c) => c.id === search.category) ? search.category : "",
  );
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [anonymous, setAnonymous] = useState(false);
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationValue, setLocationValue] = useState(search.location ?? "");
  const [suggesting, setSuggesting] = useState(false);
  const suggest = useServerFn(classifyComplaint);

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/auth", search: { redirect: "/submit" }, replace: true });
    }
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
      </div>
    );
  }

  const autoCategorise = async () => {
    if (title.trim().length < 4 || description.trim().length < 10) {
      return toast.error("Add a title and description first", {
        description: "The assistant needs a little detail to categorise your issue.",
      });
    }
    setSuggesting(true);
    try {
      const result = await suggest({
        data: {
          title: title.trim(),
          description: description.trim(),
          categories: categories.map((c) => c.name),
        },
      });
      const matched = categories.find((c) => c.name === result.category);
      if (!matched) {
        return toast.error("Couldn't suggest a category", {
          description: "Please pick one manually.",
        });
      }
      setCategory(matched.id);
      if (result.priority) setPriority(result.priority as "Low" | "Medium" | "High");
      toast.success("Suggested for you", {
        description: `${matched.name}${result.priority ? ` · ${result.priority} priority` : ""}`,
      });
    } catch {
      toast.error("Auto-categorise unavailable", {
        description: "Please choose a category manually.",
      });
    } finally {
      setSuggesting(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (!category) {
      toast.error("Please choose a category", {
        description: "Pick the category that best matches your issue.",
      });
      return;
    }
    const parsed = schema.safeParse({
      title: form.get("title"),
      description: form.get("description"),
      location: form.get("location"),
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setBusy(true);
    try {
      const photoPaths: string[] = [];
      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `${session.user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("complaint-photos")
          .upload(path, file, { contentType: file.type });
        if (upErr) throw upErr;
        photoPaths.push(path);
      }

      const categoryName = categories.find((c) => c.id === category)?.name ?? category;
      const { data, error } = await supabase
        .from("complaints")
        .insert({
          user_id: session.user.id,
          title: parsed.data.title,
          description: parsed.data.description,
          category: categoryName,
          location: parsed.data.location,
          priority,
          is_anonymous: anonymous,
          photo_paths: photoPaths,
        })
        .select("reference")
        .single();
      if (error) throw error;

      toast.success("Complaint submitted", {
        description: `Your reference is ${data.reference}.`,
      });
      navigate({ to: "/track" });
    } catch (err) {
      toast.error("Could not submit complaint", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">
        <Typewriter text="Submit a complaint" speed={50} />
      </h1>
      <p className="mt-3 text-muted-foreground">
        Give us the details and you'll receive a complaint ID you can track any time.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Complaint details</CardTitle>
          <CardDescription>Fields marked with * are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={profile?.full_name || session.user.email || ""} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roll">Roll / Staff ID</Label>
                <Input id="roll" value={profile?.roll_id || "—"} readOnly />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Medium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                placeholder="Block B, Room 204"
                value={locationValue}
                onChange={(e) => setLocationValue(e.target.value)}
                required
              />
              {search.location && (
                <p className="text-xs text-muted-foreground">
                  Location filled in from the QR code you scanned.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Complaint title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Projector not turning on"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Describe what's wrong, since when, and anything the staff should know."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={autoCategorise}
                disabled={suggesting}
              >
                {suggesting ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-1 h-4 w-4" />
                )}
                Auto-categorise with AI
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Photo evidence</Label>
              <label
                htmlFor="photo"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-6 py-8 text-center transition-colors hover:bg-muted"
              >
                <ImagePlus className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {file?.name ?? "Click to upload an image (PNG or JPG, up to 5 MB)"}
                </span>
              </label>
              <input
                id="photo"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const picked = e.target.files?.[0];
                  if (!picked) return setFile(null);
                  if (picked.size > 5 * 1024 * 1024) {
                    toast.error("Image too large", {
                      description: "Please upload a file under 5 MB.",
                    });
                    e.target.value = "";
                    setFile(null);
                    return;
                  }
                  setFile(picked);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Photos are private — only campus administrators can open them.
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <Checkbox
                id="anonymous"
                className="mt-0.5"
                checked={anonymous}
                onCheckedChange={(v) => setAnonymous(v === true)}
              />
              <Label htmlFor="anonymous" className="font-normal leading-relaxed">
                Submit anonymously — your name won't be shown to staff handling the complaint.
              </Label>
            </div>

            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={busy}>
              {busy ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-1 h-4 w-4" />
              )}
              Submit complaint
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
