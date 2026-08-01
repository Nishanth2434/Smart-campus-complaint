import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Choose a New Password — Campus Complaint Portal" },
      {
        name: "description",
        content: "Set a new password for your Smart Campus Complaint Portal student account.",
      },
      { property: "og:title", content: "Reset Password — Campus Complaint Portal" },
      { property: "og:description", content: "Set a new password for your student account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(72);

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = passwordSchema.safeParse(form.get("password"));
    if (!password.success) return toast.error(password.error.issues[0].message);
    if (password.data !== String(form.get("confirm") ?? "")) {
      return toast.error("Passwords do not match");
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: password.data });
    setBusy(false);
    if (error) return toast.error("Could not update password", { description: error.message });
    toast.success("Password updated", { description: "You're signed in with your new password." });
    navigate({ to: "/track", replace: true });
  };

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-center text-3xl font-bold tracking-tight">Choose a new password</h1>
      <p className="mt-3 text-center text-muted-foreground">
        Pick something you haven&apos;t used before.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">New password</CardTitle>
          <CardDescription>
            {ready
              ? "Enter and confirm your new password."
              : "Open this page from the reset link in your email to continue."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="rp-pass">New password</Label>
              <Input
                id="rp-pass"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                required
                disabled={!ready}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rp-confirm">Confirm password</Label>
              <Input
                id="rp-confirm"
                name="confirm"
                type="password"
                placeholder="Repeat password"
                required
                disabled={!ready}
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy || !ready}>
              <KeyRound className="mr-1 h-4 w-4" /> Update password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}