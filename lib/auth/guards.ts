import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    user,
    profile: profile as Profile | null,
  };
}

export async function requireAuth(redirectTo: string = "/auth/login") {
  const current = await getCurrentUser();

  if (!current || !current.user) {
    redirect(redirectTo);
  }

  return current;
}

export async function requireAdmin(redirectTo: string = "/dashboard") {
  const current = await requireAuth();

  if (current.profile?.role !== "admin") {
    redirect(redirectTo);
  }

  return current;
}

/**
 * Server Action / API mutation guard. Throws Error instead of redirecting.
 */
export async function assertAdminMutation() {
  const current = await getCurrentUser();

  if (!current || !current.user) {
    throw new Error("Unauthorized: Anda harus login untuk melakukan aksi ini.");
  }

  if (current.profile?.role !== "admin") {
    throw new Error("Forbidden: Anda tidak memiliki akses administrator.");
  }

  return current;
}

export async function assertAuthMutation() {
  const current = await getCurrentUser();

  if (!current || !current.user) {
    throw new Error("Unauthorized: Anda harus login untuk melakukan aksi ini.");
  }

  return current;
}
