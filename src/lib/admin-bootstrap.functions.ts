import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Only this address may claim the single admin account. */
export const ALLOWED_ADMIN_EMAIL = "drvishalpandey@gmail.com";

/** Whether the first-time admin setup still needs to run. */
export const getBootstrapState = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ needsBootstrap: boolean; allowedEmail: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("admins")
      .select("user_id", { count: "exact", head: true });
    return { needsBootstrap: (count ?? 0) === 0, allowedEmail: ALLOWED_ADMIN_EMAIL };
  },
);

/**
 * One-time setup: creates the single administrator account. Refuses to run once
 * an administrator exists, and only accepts the allowed email address.
 */
export const bootstrapAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string; password: string }) =>
    z
      .object({
        email: z.string().trim().toLowerCase().email(),
        password: z.string().min(10, "Use at least 10 characters").max(200),
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<{ ok: true }> => {
    if (data.email !== ALLOWED_ADMIN_EMAIL) throw new Error("This email cannot be used for setup.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count } = await supabaseAdmin
      .from("admins")
      .select("user_id", { count: "exact", head: true });
    if ((count ?? 0) > 0) throw new Error("Setup has already been completed.");

    let userId: string | null = null;

    const created = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });

    if (created.data?.user) {
      userId = created.data.user.id;
    } else {
      const existing = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const match = existing.data?.users.find(
        (user) => user.email?.toLowerCase() === data.email,
      );
      if (!match) throw new Error(created.error?.message ?? "Unable to create the account.");
      userId = match.id;
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: data.password,
        email_confirm: true,
      });
    }

    const { error } = await supabaseAdmin
      .from("admins")
      .insert({ user_id: userId, email: data.email });
    if (error) throw new Error(error.message);

    return { ok: true };
  });
