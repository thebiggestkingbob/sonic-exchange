import { integrationReadiness } from "@/lib/providers";
export function GET() {
  return Response.json(
    {
      mode: "demo",
      integrations: integrationReadiness,
      message:
        "Readiness only. No external services, credentials or real transactions are configured.",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
