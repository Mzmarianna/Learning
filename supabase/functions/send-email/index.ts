import { serve } from "https://deno.land/std/http/server.ts";

type EmailPayload = {
  to: string;
  subject: string;
  body: string;
};

serve(async (request: Request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let payload: EmailPayload;

  try {
    payload = await request.json();
  } catch (_error) {
    return new Response("Invalid payload", { status: 400 });
  }

  if (!payload.to || !payload.subject || !payload.body) {
    return new Response("Missing to, subject, or body", { status: 400 });
  }

  console.log(`Queue email to ${payload.to} with subject ${payload.subject}`);

  return new Response(
    JSON.stringify({
      status: "queued",
      recipient: payload.to
    }),
    {
      headers: {
        "content-type": "application/json"
      }
    }
  );
});
