import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, LogIn, Mail, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Student Sign In — Smart Campus Complaint Portal" },
      {
        name: "description",
        content: "Sign in or create a student account to submit and track campus complaints.",
      },
      { property: "og:title", content: "Student Sign In — Campus Complaint Portal" },
      {
        property: "og:description",
        content: "Create an account to report and track campus issues.",
      },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(72);

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });
  const { session, isAdmin, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);

  const target =
    redirect && redirect.startsWith("/") ? redirect : isAdmin ? "/admin/dashboard" : "/";

  useEffect(() => {
    if (!loading && session) navigate({ to: target, replace: true });
  }, [loading, session, target, navigate]);

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = emailSchema.safeParse(form.get("email"));
    const password = passwordSchema.safeParse(form.get("password"));
    if (!email.success) return toast.error(email.error.issues[0].message);
    if (!password.success) return toast.error(password.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.data,
      password: password.data,
    });
    setBusy(false);
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return toast.error("Invalid email or password", {
          description: "Please check your credentials and try again.",
        });
      }
      return toast.error("Could not sign in", { description: error.message });
    }
    toast.success("Welcome back");
    navigate({ to: target, replace: true });
  };

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = emailSchema.safeParse(form.get("email"));
    const password = passwordSchema.safeParse(form.get("password"));
    const fullName = z
      .string()
      .trim()
      .min(1, "Enter your name")
      .max(100)
      .safeParse(form.get("full_name"));
    if (!fullName.success) return toast.error(fullName.error.issues[0].message);
    if (!email.success) return toast.error(email.error.issues[0].message);
    if (!password.success) return toast.error(password.error.issues[0].message);

    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: email.data,
      password: password.data,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName.data,
          roll_id: String(form.get("roll_id") ?? "")
            .trim()
            .slice(0, 40),
        },
      },
    });
    setBusy(false);
    if (error) return toast.error("Could not sign up", { description: error.message });
    toast.success("Account created", { description: "You can start reporting issues right away." });
    navigate({ to: target, replace: true });
  };

  const sendReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = emailSchema.safeParse(form.get("email"));
    if (!email.success) return toast.error(email.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error("Could not send reset link", { description: error.message });
    toast.success("Check your inbox", {
      description: "If that email has an account, a password reset link is on its way.",
    });
    setForgot(false);
  };

  if (forgot) {
    return (
      <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
        <h1 className="text-center text-3xl font-bold tracking-tight">Reset your password</h1>
        <p className="mt-3 text-center text-muted-foreground">
          We&apos;ll email you a secure link to choose a new password.
        </p>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Forgot password</CardTitle>
            <CardDescription>Enter the email you signed up with.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={sendReset}>
              <div className="space-y-2">
                <Label htmlFor="fp-email">Email</Label>
                <Input
                  id="fp-email"
                  name="email"
                  type="email"
                  placeholder="yourname@gmail.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                <Mail className="mr-1 h-4 w-4" /> Send reset link
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setForgot(false)}
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Back to sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-center text-3xl font-bold tracking-tight">Student portal access</h1>
      <p className="mt-3 text-center text-muted-foreground">
        Sign in to submit complaints and follow their progress.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Welcome</CardTitle>
          <CardDescription>{"\n"}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form className="space-y-4 pt-4" onSubmit={signIn}>
                <div className="space-y-2">
                  <Label htmlFor="in-email">Email</Label>
                  <Input
                    id="in-email"
                    name="email"
                    type="email"
                    placeholder="yourname@gmail.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="in-pass">Password</Label>
                  <Input
                    id="in-pass"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  <LogIn className="mr-1 h-4 w-4" /> Sign in
                </Button>
                <button
                  type="button"
                  className="w-full text-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  onClick={() => setForgot(true)}
                >
                  Forgot your password?
                </button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form className="space-y-4 pt-4" onSubmit={signUp}>
                <div className="space-y-2">
                  <Label htmlFor="up-name">Full name</Label>
                  <Input id="up-name" name="full_name" placeholder="Aarav Sharma" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="up-roll">Roll / Staff ID</Label>
                  <Input id="up-roll" name="roll_id" placeholder="21CS045" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="up-email">Email</Label>
                  <Input
                    id="up-email"
                    name="email"
                    type="email"
                    placeholder="yourname@gmail.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="up-pass">Password</Label>
                  <Input
                    id="up-pass"
                    name="password"
                    type="password"
                    placeholder="At least 6 characters"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  <UserPlus className="mr-1 h-4 w-4" /> Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
