import { createClient } from "./supabase-client";

const supabase = createClient();

/** Backend-এ profile (Prisma User row) sync/upsert করা — session থাকা অবস্থায় কল করতে হবে */
async function syncProfile(payload: {
  email?: string | null;
  phone?: string | null;
  fullName: string;
  role: string;
}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // এখনো email confirm হয়নি / session নেই — এখন sync করার কিছু নেই
    return;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/sync-profile`, {
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

/** Customer signup — email + password (শুধু Supabase signup, sync এখানে হবে না) */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role: "CUSTOMER" } },
  });
  if (error) throw error;

  // email confirm লাগে না এমন সেটআপ হলে signUp-এর পরেই session থাকতে পারে —
  // থাকলে সাথে সাথেই sync, না থাকলে পরে login-এর সময় sync হবে
  await syncProfile({ email, fullName, role: "CUSTOMER" });

  return data;
}

/** Customer/Seller login — email + password */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  // ✅ Login সফল মানেই session নিশ্চিতভাবে আছে — এখানেই sync guaranteed কাজ করবে
  await syncProfile({
    email,
    fullName: data.user?.user_metadata?.full_name ?? "Unnamed User",
    role: data.user?.user_metadata?.role ?? "CUSTOMER",
  });

  return data;
}

/** Customer signup/login — Google OAuth */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
  return data;
  // ⚠️ Google-এর জন্য sync হবে /auth/callback page লোড হওয়ার পর (নিচে দেখুন)
}

/** Seller signup — phone + password */
export async function signUpWithPhone(
  phone: string,
  password: string,
  fullName: string
) {
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
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

/** Reset password — email link থেকে আসা /reset-password page-এ কল হবে */
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
}