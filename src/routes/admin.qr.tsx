import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, Plus, QrCode, Trash2 } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { isDemoMode, useDemoMode } from "@/lib/demo-mode";
import { categories } from "@/lib/portal-data";

export const Route = createFileRoute("/admin/qr")({
  head: () => ({
    meta: [
      { title: "Location QR Codes — Campus Complaint Administration" },
      {
        name: "description",
        content:
          "Generate printable QR codes so students can report an issue from any campus location instantly.",
      },
      { property: "og:title", content: "Campus Location QR Codes" },
      {
        property: "og:description",
        content: "Print QR posters that open a pre-filled complaint form for that location.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminQrPage,
});

type Poster = { id: string; location: string; category: string; dataUrl: string; url: string };

function AdminQrPage() {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAuth();
  const demo = useDemoMode();
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [posters, setPosters] = useState<Poster[]>([]);

  useEffect(() => {
    if (!demo && !isDemoMode() && !loading && (!session || !isAdmin))
      navigate({ to: "/admin/login", replace: true });
  }, [demo, loading, session, isAdmin, navigate]);

  const generate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = location.trim();
    if (trimmed.length < 2) return toast.error("Enter the campus location");

    const params = new URLSearchParams({ location: trimmed });
    if (category) params.set("category", category);
    const url = `${window.location.origin}/submit?${params.toString()}`;

    try {
      const dataUrl = await QRCode.toDataURL(url, { width: 512, margin: 1 });
      setPosters((prev) => [
        { id: crypto.randomUUID(), location: trimmed, category, dataUrl, url },
        ...prev,
      ]);
      setLocation("");
      toast.success("QR code ready", { description: "Download and print it for that location." });
    } catch {
      toast.error("Could not generate the QR code");
    }
  };

  const download = (p: Poster) => {
    const a = document.createElement("a");
    a.href = p.dataUrl;
    a.download = `campus-qr-${p.location.replace(/\s+/g, "-").toLowerCase()}.png`;
    a.click();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
        <QrCode className="h-7 w-7 text-primary" /> Location QR codes
      </h1>
      <p className="mt-3 text-muted-foreground">
        Print these near classrooms, washrooms or hostels. Scanning opens the complaint form with the
        location (and category) already filled in.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Create a QR poster</CardTitle>
          <CardDescription>One code per physical spot works best.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end" onSubmit={generate}>
            <div className="space-y-2">
              <Label htmlFor="qr-location">Location</Label>
              <Input
                id="qr-location"
                placeholder="Block B, Room 204"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qr-category">Default category (optional)</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="qr-category">
                  <SelectValue placeholder="No default" />
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
            <Button type="submit">
              <Plus className="mr-1 h-4 w-4" /> Generate
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posters.map((p) => (
          <Card key={p.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{p.location}</CardTitle>
              <CardDescription className="truncate">
                {categories.find((c) => c.id === p.category)?.name ?? "Any category"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <img
                src={p.dataUrl}
                alt={`QR code that opens a complaint form for ${p.location}`}
                className="mx-auto h-40 w-40 rounded-lg border border-border bg-background"
              />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => download(p)}>
                  <Download className="mr-1 h-4 w-4" /> PNG
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setPosters((prev) => prev.filter((x) => x.id !== p.id))}
                  aria-label={`Remove QR code for ${p.location}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posters.length === 0 && (
        <p className="mt-8 rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No QR codes yet — generate one above.
        </p>
      )}
    </div>
  );
}