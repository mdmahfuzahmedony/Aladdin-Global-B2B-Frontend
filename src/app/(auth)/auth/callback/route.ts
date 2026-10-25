import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const next = requestUrl.searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(
      `${requestUrl.origin}/sign-in?error=no-code`
    );
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value, options }) => {
              cookieStore.set(name, value, options);
            }
          );
        },
      },
    }
  );

  // ============================
  // Exchange Google code
  // ============================

  const { data, error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error(
      "AUTH CALLBACK ERROR:",
      error.message
    );

    return NextResponse.redirect(
      `${requestUrl.origin}/sign-in?error=auth-code-error`
    );
  }

  if (!data.user || !data.session) {
    return NextResponse.redirect(
      `${requestUrl.origin}/sign-in?error=no-user`
    );
  }

  // ============================
  // Sync Supabase User → Prisma
  // ============================

  try {
    const syncResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/sync-profile`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
        },

        body: JSON.stringify({
          email: data.user.email ?? null,

          phone: data.user.phone ?? null,

          fullName:
            data.user.user_metadata?.full_name ??
            data.user.user_metadata?.name ??
            "Unnamed User",

          role: "CUSTOMER",
        }),
      }
    );

    if (!syncResponse.ok) {
      const syncError =
        await syncResponse.json().catch(() => null);

      console.error(
        "PROFILE SYNC ERROR:",
        syncError
      );

      return NextResponse.redirect(
        `${requestUrl.origin}/sign-in?error=profile-sync-error`
      );
    }
  } catch (err) {
    console.error(
      "PROFILE SYNC FETCH ERROR:",
      err
    );

    return NextResponse.redirect(
      `${requestUrl.origin}/sign-in?error=profile-sync-error`
    );
  }

  // ============================
  // Success
  // ============================

  return NextResponse.redirect(
    `${requestUrl.origin}${next}`
  );
}