import { createBrowserClient } from "@supabase/ssr";

const DEFAULT_SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://irjztafvbaykdykkhawy.supabase.co";

const DEFAULT_SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlyanp0YWZ2YmF5a2R5a2toYXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1OTI5MTAsImV4cCI6MjEwNDE2ODkxMH0.E5rbS6jIfEqvvPGOzq2T_HQK6qFiLjAB-CeWCKgRC14";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createBrowserClient(url, anonKey);
}
