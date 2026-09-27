import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/* Tables the CMS is allowed to touch. Anything else is rejected. */
export const ADMIN_TABLES = [
  "profile",
  "site_settings",
  "sections",
  "nav_items",
  "about_cards",
  "skill_categories",
  "skills",
  "education",
  "experience",
  "projects",
  "certifications",
  "achievements",
  "services",
  "social_links",
  "contact_info",
  "resumes",
  "contact_messages",
] as const;

export type AdminTable = (typeof ADMIN_TABLES)[number];

const tableSchema = z.enum(ADMIN_TABLES);
/* eslint-disable @typescript-eslint/no-explicit-any */

async function assertAdmin(supabase: any) {
  const { data, error } = await supabase.rpc("is_admin");
  if (error || data !== true) throw new Error("Not authorised");
}

function orderColumn(table: AdminTable) {
  if (table === "contact_messages") return { column: "created_at", ascending: false };
  if (table === "resumes") return { column: "created_at", ascending: false };
  if (table === "profile" || table === "site_settings" || table === "contact_info")
    return { column: "updated_at", ascending: false };
  return { column: "sort_order", ascending: true };
}

/** Whether the signed-in user is an administrator. */
export const getAdminSession = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ isAdmin: boolean; email: string | null }> => {
    const { data } = await (context.supabase as any).rpc("is_admin");
    const claims = context.claims as { email?: string } | null;
    return { isAdmin: data === true, email: claims?.email ?? null };
  });

export const listRows = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { table: AdminTable }) =>
    z.object({ table: tableSchema }).parse(input),
  )
  .handler(async ({ data, context }): Promise<Record<string, unknown>[]> => {
    const supabase = context.supabase as any;
    await assertAdmin(supabase);
    const order = orderColumn(data.table);
    const { data: rows, error } = await supabase
      .from(data.table)
      .select("*")
      .order(order.column, { ascending: order.ascending });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const saveRow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { table: AdminTable; id?: string; values: Record<string, unknown> }) =>
    z
      .object({
        table: tableSchema,
        id: z.string().uuid().optional(),
        values: z.record(z.string(), z.unknown()),
      })
      .parse(input),
  )
  .handler(async ({ data, context }): Promise<Record<string, unknown>> => {
    const supabase = context.supabase as any;
    await assertAdmin(supabase);

    const values = { ...data.values };
    delete values["id"];
    delete values["created_at"];
    delete values["updated_at"];

    const query = data.id
      ? supabase.from(data.table).update(values).eq("id", data.id).select("*").single()
      : supabase.from(data.table).insert(values).select("*").single();

    const { data: row, error } = await query;
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteRow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { table: AdminTable; id: string }) =>
    z.object({ table: tableSchema, id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const supabase = context.supabase as any;
    await assertAdmin(supabase);
    const { error } = await supabase.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderRows = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { table: AdminTable; ids: string[] }) =>
    z.object({ table: tableSchema, ids: z.array(z.string().uuid()).max(500) }).parse(input),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const supabase = context.supabase as any;
    await assertAdmin(supabase);
    for (const [index, id] of data.ids.entries()) {
      const { error } = await supabase
        .from(data.table)
        .update({ sort_order: index + 1 })
        .eq("id", id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const setActiveResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const supabase = context.supabase as any;
    await assertAdmin(supabase);
    await supabase.from("resumes").update({ is_active: false }).neq("id", data.id);
    const { error } = await supabase.from("resumes").update({ is_active: true }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export type DashboardStats = {
  counts: Record<string, number>;
  unreadMessages: number;
  recentMessages: Array<{
    id: string;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    created_at: string;
    is_read: boolean;
  }>;
};

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DashboardStats> => {
    const supabase = context.supabase as any;
    await assertAdmin(supabase);

    const countable = [
      "projects",
      "experience",
      "education",
      "skills",
      "certifications",
      "achievements",
      "services",
      "contact_messages",
    ] as const;

    const counts: Record<string, number> = {};
    await Promise.all(
      countable.map(async (table) => {
        const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
        counts[table] = count ?? 0;
      }),
    );

    const { count: unread } = await supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);

    const { data: recent } = await supabase
      .from("contact_messages")
      .select("id,name,email,subject,message,created_at,is_read")
      .order("created_at", { ascending: false })
      .limit(5);

    return { counts, unreadMessages: unread ?? 0, recentMessages: recent ?? [] };
  });

/** Signed upload URL for the private media bucket. */
export const createUploadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { folder: string; filename: string }) =>
    z
      .object({
        folder: z
          .string()
          .regex(/^[a-z0-9-]{1,40}$/, "Invalid folder")
          .default("uploads"),
        filename: z.string().min(1).max(160),
      })
      .parse(input),
  )
  .handler(
    async ({ data, context }): Promise<{ uploadUrl: string; token: string; path: string }> => {
      const supabase = context.supabase as any;
      await assertAdmin(supabase);

      const safeName = data.filename
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, "-")
        .slice(-120);
      const path = `${data.folder}/${Date.now()}-${safeName}`;

      const { data: signed, error } = await supabase.storage
        .from("media")
        .createSignedUploadUrl(path);
      if (error || !signed) throw new Error(error?.message ?? "Unable to prepare upload");

      return { uploadUrl: signed.signedUrl, token: signed.token, path };
    },
  );
