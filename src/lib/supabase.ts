import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL ?? "").toLowerCase();
export const calcomBookingUrl =
  import.meta.env.VITE_CALCOM_BOOKING_URL ??
  "https://cal.com/krish-s/lodestar?overlayCalendar=true";
