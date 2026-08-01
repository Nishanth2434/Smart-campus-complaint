import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type PortalUser = {
  id: string;
  full_name: string;
  roll_id: string;
  email: string;
  department: string;
  phone: string;
  created_at: string;
  roles: string[];
};

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden");
}

export const listPortalUsers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PortalUser[]> => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [{ data: profiles, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("id, full_name, roll_id, email, department, phone, created_at")
        .order("created_at", { ascending: false }),
      supabaseAdmin.from("user_roles").select("user_id, role"),
    ]);
    if (pErr) throw pErr;
    if (rErr) throw rErr;

    return (profiles ?? []).map((p) => ({
      ...p,
      roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role as string),
    }));
  });

const roleInput = z.object({
  userId: z.string().uuid(),
  role: z.enum(["admin", "student"]),
  action: z.enum(["grant", "revoke"]),
});

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => roleInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.action === "revoke" && data.userId === context.userId && data.role === "admin") {
      throw new Error("You cannot remove your own admin access");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.action === "grant") {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
      if (error) throw error;
    }
    return { ok: true };
  });

const createAdminInput = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  department: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(20),
  password: z.string().min(8).max(72),
});

export const createAdminAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createAdminInput.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.fullName,
        department: data.department,
        phone: data.phone,
      },
    });
    if (error) throw new Error(error.message);
    const userId = created.user?.id;
    if (!userId) throw new Error("Account could not be created");

    await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: userId,
          full_name: data.fullName,
          email: data.email,
          department: data.department,
          phone: data.phone,
        },
        { onConflict: "id" },
      );

    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
    if (roleErr) throw roleErr;

    return { ok: true, userId };
  });