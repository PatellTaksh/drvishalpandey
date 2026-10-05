import { supabase } from "@/integrations/supabase/client";

/** Records an account event; never blocks the user if logging fails. */
export async function logAccountEvent(action: "sign_in" | "sign_out" | "password_change") {
  try {
    await (supabase as any).rpc("log_admin_event", { _action: action });
  } catch {
    /* ignore */
  }
}
