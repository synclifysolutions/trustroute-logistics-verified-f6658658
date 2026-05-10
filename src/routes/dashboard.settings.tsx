import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — TrustRoute" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage workspace, branding, and verification policies.</p>
      </div>
      <div className="rounded-2xl glass p-6 space-y-4">
        {[
          { k: "Workspace", v: "Acme Logistics" },
          { k: "Verification policy", v: "OTP + GPS + Photo (strict)" },
          { k: "Certificate template", v: "Enterprise default" },
          { k: "Notifications", v: "Email · Webhook" },
        ].map((r) => (
          <div key={r.k} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
            <div>
              <div className="text-sm font-semibold">{r.k}</div>
              <div className="text-xs text-muted-foreground">{r.v}</div>
            </div>
            <button className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs hover:bg-white/[0.08]">Edit</button>
          </div>
        ))}
      </div>
    </div>
  ),
});
