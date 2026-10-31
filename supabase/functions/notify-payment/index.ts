import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceRoleKey);

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders() });
  }
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders() });
  }

  const authClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401, headers: corsHeaders() });

  const { payment_id: paymentId } = await request.json();
  const { data: payment, error: paymentError } = await supabase
    .from("payment_submissions")
    .select("id, student_id, program, amount_cents, created_at")
    .eq("id", paymentId)
    .eq("student_id", user.id)
    .single();
  if (paymentError || !payment) {
    return new Response("Payment not found", { status: 404, headers: corsHeaders() });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const ownerEmail = Deno.env.get("OWNER_NOTIFICATION_EMAIL") ?? "advising.lodestar@gmail.com";
  if (!resendKey) {
    return new Response("Notification service is not configured", {
      status: 503,
      headers: corsHeaders(),
    });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: Deno.env.get("RESEND_FROM_EMAIL") ?? "Lodestar Portal <onboarding@resend.dev>",
      to: [ownerEmail],
      subject: `New Lodestar payment from ${profile?.full_name ?? profile?.email ?? "student"}`,
      text: [
        "A new payment confirmation is ready for review.",
        `Student: ${profile?.full_name ?? "Not provided"}`,
        `Email: ${profile?.email ?? user.email ?? "Not provided"}`,
        `Program: ${payment.program}`,
        `Amount: $${(payment.amount_cents / 100).toFixed(2)}`,
        `Submitted: ${new Date(payment.created_at).toLocaleString()}`,
      ].join("\n"),
    }),
  });
  if (!response.ok) {
    return new Response("Notification delivery failed", { status: 502, headers: corsHeaders() });
  }
  return new Response("Notification sent", { status: 200, headers: corsHeaders() });
});
