import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, LogIn, PlayCircle, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { setDemoMode } from "@/lib/demo-mode";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Smart Campus Complaint Portal" },
      {
        name: "description",
        content: "Restricted administration area for campus complaint management staff.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Login — Campus Complaint Portal" },
      { property: "og:description", content: "Restricted area for complaint management staff." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { session, isAdmin, loading, signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session && isAdmin) navigate({ to: "/admin/dashboard", replace: true });
  }, [loading, session, isAdmin, navigate]);

  const openDemo = () => {
    setDemoMode(true);
    toast.success("Demo mode", { description: "Showing sample complaints — no real data." });
    navigate({ to: "/admin/dashboard" });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = z.string().trim().email().max(255).safeParse(form.get("email"));
    const password = z.string().min(6).max(72).safeParse(form.get("password"));
    if (!email.success || !password.success) {
      toast.error("Enter a valid staff email and password");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.data,
      password: password.data,
    });
    setDemoMode(false);
    if (error) {
      setBusy(false);
      return toast.error("Sign in failed", { description: error.message });
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    setBusy(false);
    if (!roles?.some((r) => r.role === "admin")) {
      await supabase.auth.signOut();
      return toast.error("Not an administrator", {
        description: "This account does not have staff access.",
      });
    }
    toast.success("Signed in as administrator");
    navigate({ to: "/admin/dashboard", replace: true });
  };

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-20">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Administration login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This area is separate from the student portal and restricted to authorised staff.
        </p>
        <div className="mt-4 rounded-md bg-primary/10 p-3 text-sm font-medium text-primary">
          <p>Default Login Credentials:</p>
          <p>Email: <strong>principle@gmail.com</strong> | Password: <strong>123456</strong></p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Staff sign in</CardTitle>
          <CardDescription>
            Admin accounts are created by the college administration. Use the credentials you were
            issued — self-registration is not available for staff.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="admin-id">Staff email</Label>
              <Input id="admin-id" name="email" type="email" placeholder="principal@college.edu" defaultValue="principle@gmail.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-pass">Password</Label>
              <Input id="admin-pass" name="password" type="password" placeholder="••••••••" defaultValue="123456" required />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <LogIn className="mr-1 h-4 w-4" />}
              Sign in to dashboard
            </Button>
          </form>

          {session && !isAdmin && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Signed in as a student.{" "}
              <button className="underline" onClick={() => void signOut()}>
                Sign out
              </button>{" "}
              to use a staff account.
            </p>
          )}
          </CardContent>
      </Card>

      <div className="mt-6 rounded-xl border border-dashed bg-muted/40 p-4 text-center">
        <p className="text-sm font-medium">Just want to look around?</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Open the admin dashboard without signing in. It shows sample complaints only — real
          student data always requires a staff login.
        </p>
        <Button variant="outline" className="mt-3 w-full" onClick={openDemo}>
          <PlayCircle className="mr-1 h-4 w-4" /> Open demo dashboard (no login)
        </Button>
      </div>
    </div>
  );
}
