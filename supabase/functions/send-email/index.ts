// Supabase Edge Function to send emails via Resend
// Deploy with: supabase functions deploy send-email

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

serve(async (req: Request) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }), 
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Parse request body
    const payload: EmailPayload = await req.json();

    // Validate required fields
    if (!payload.to || !payload.subject || !payload.html) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, html" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if Resend API key is configured
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ 
          error: "Email service not configured",
          message: "Please set RESEND_API_KEY environment variable"
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Send email via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: payload.from || "Mz. Marianna's Academy <noreply@resend.dev>",
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        reply_to: payload.replyTo,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", data);
      return new Response(
        JSON.stringify({ 
          error: "Failed to send email",
          details: data
        }),
        { 
          status: response.status, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    console.log("✅ Email sent successfully:", data.id);

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: data.id,
        message: "Email sent successfully"
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        message: error.message
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
});
