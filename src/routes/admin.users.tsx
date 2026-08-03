import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck, ShieldMinus, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createAdminAccount, listPortalUsers, setUserRole } from "@/lib/admin.functions";
import type { PortalUser } from "@/lib/admin.functions";
import { useAuth } from "@/lib/auth";
import { demoProfiles, isDemoMode, useDemoMode } from "@/lib/demo-mode";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "Manage Users — Campus Complaint Administration" },
      {
        name: "description",
        content: "Review registered portal accounts and grant or remove administrator access.",
      },
      { property: "og:title", content: "Manage Portal Users" },
      { property: "og:description", content: "Grant or revoke admin access for campus staff." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { session, isAdmin, loading } = useAuth();
  const demo = useDemoMode();
  const fetchUsers = useServerFn(listPortalUsers);
  const changeRole = useServerFn(setUserRole);
  const createAdmin = useServerFn(createAdminAccount);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    department: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    if (!demo && !isDemoMode() && !loading && (!session || !isAdmin))
      navigate({ to: "/admin/login", replace: true });
  }, [demo, loading, session, isAdmin, navigate]);

  const usersQuery = useQuery({
    queryKey: ["portal-users"],
    queryFn: () => fetchUsers({ data: undefined }),
    enabled: !demo && !!session && isAdmin,
  });

  const roleMutation = useMutation({
    mutationFn: (vars: { userId: string; action: "grant" | "revoke" }) =>
      changeRole({ data: { userId: vars.userId, role: "admin" as const, action: vars.action } }),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ["portal-users"] });
      toast.success(vars.action === "grant" ? "Admin access granted" : "Admin access removed");
    },
    onError: (err) =>
      toast.error("Could not update role", {
        description: err instanceof Error ? err.message : "Please try again.",
      }),
  });

  const demoUsers: PortalUser[] = demoProfiles.map((p, i) => ({
    ...p,
    department: i === 0 ? "Administration" : "Student",
    phone: "—",
    created_at: new Date(Date.now() - (i + 1) * 86_400_000).toISOString(),
    roles: [i === 0 ? "admin" : "student"],
  }));
  const users = demo ? demoUsers : (usersQuery.data ?? []);

  const createMutation = useMutation({
    mutationFn: (vars: typeof form) => createAdmin({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portal-users"] });
      toast.success("Admin account created", {
        description: "Share the email and password with the staff member.",
      });
      setForm({ fullName: "", email: "", department: "", phone: "", password: "" });
    },
    onError: (err) =>
      toast.error("Could not create admin account", {
        description: err instanceof Error ? err.message : "Please try again.",
      }),
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
        <Users className="h-7 w-7 text-primary" /> Portal users
      </h1>
      <p className="mt-3 text-muted-foreground">
        Everyone registered on the portal. Admin accounts are created here by the administration —
        students can never register as admins or change their own role.
      </p>

      {demo && (
        <p className="mt-4 rounded-lg border border-border bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Demo mode.</span> These are sample accounts
          — creating accounts and changing roles is disabled until you sign in.
        </p>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="h-5 w-5 text-primary" /> Create admin account
          </CardTitle>
          <CardDescription>
            The account is activated immediately. Hand the credentials to the staff member — they
            sign in at the staff login page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate(form);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="new-name">Full name</Label>
              <Input
                id="new-name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Principal"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="principal@college.edu"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-dept">Department</Label>
              <Input
                id="new-dept"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="Administration"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-phone">Phone number</Label>
              <Input
                id="new-phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 90000 00000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pass">Temporary password</Label>
              <Input
                id="new-pass"
                type="password"
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 8 characters"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value="Admin" readOnly disabled />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={demo || createMutation.isPending}>
                <UserPlus className="mr-1 h-4 w-4" />
                {createMutation.isPending ? "Creating…" : "Create admin account"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Accounts ({users.length})</CardTitle>
          <CardDescription>Grant or remove administrator access.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Roll / Staff ID</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const admin = u.roles.includes("admin");
                  return (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.full_name || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell className="text-muted-foreground">{u.department || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{u.phone || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{u.roll_id || "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {u.roles.length === 0 && <span className="text-muted-foreground">—</span>}
                          {u.roles.map((r) => (
                            <Badge key={r} variant={r === "admin" ? "default" : "outline"}>
                              {r}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(u.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={admin ? "outline" : "default"}
                          disabled={demo || roleMutation.isPending || u.id === session?.user.id}
                          onClick={() =>
                            roleMutation.mutate({
                              userId: u.id,
                              action: admin ? "revoke" : "grant",
                            })
                          }
                        >
                          {admin ? (
                            <>
                              <ShieldMinus className="mr-1 h-4 w-4" /> Remove admin
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="mr-1 h-4 w-4" /> Make admin
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {usersQuery.isLoading && (
            <p className="py-8 text-center text-muted-foreground">Loading accounts…</p>
          )}
          {!usersQuery.isLoading && users.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">No accounts yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
