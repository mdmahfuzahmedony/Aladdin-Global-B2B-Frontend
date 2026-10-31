import { createClient } from "./supabase-client";

function getSupabase() {
  return createClient();
}

/** Backend profile sync/upsert */
async function syncProfile(payload: {
  email?: string | null;
  phone?: string | null;
  fullName: string;
  role: string;
}) {
  const supabase = getSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  const res = await fetch(`${apiUrl}/api/users/sync-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("Profile sync failed:", await res.text());
  }
}

/** Customer signup — email + password */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role: "CUSTOMER" } },
  });
  if (error) throw error;

  await syncProfile({ email, fullName, role: "CUSTOMER" });
  return data;
}

/** Customer/Seller login — email + password */
export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  await syncProfile({
    email,
    fullName: data.user?.user_metadata?.full_name ?? "Unnamed User",
    role: data.user?.user_metadata?.role ?? "CUSTOMER",
  });

  return data;
}

/** Customer signup/login — Google OAuth */
export async function signInWithGoogle() {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
  return data;
}

/** Seller signup — phone + password */
export async function signUpWithPhone(
  phone: string,
  password: string,
  fullName: string,
) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signUp({
    phone,
    password,
    options: { data: { full_name: fullName, role: "VENDOR" } },
  });
  if (error) throw error;
  await syncProfile({ phone, fullName, role: "VENDOR" });
  return data;
}

/** Seller login — phone + password */
export async function signInWithPhone(phone: string, password: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    phone,
    password,
  });
  if (error) throw error;

  await syncProfile({
    phone,
    fullName: data.user?.user_metadata?.full_name ?? "Unnamed User",
    role: data.user?.user_metadata?.role ?? "VENDOR",
  });

  return data;
}

/** Forgot password — sends reset link to email */
export async function requestPasswordReset(email: string) {
  const supabase = getSupabase();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

/** Reset password */
export async function updatePassword(newPassword: string) {
  const supabase = getSupabase();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function signOut() {
  const supabase = getSupabase();
  await supabase.auth.signOut();
}
