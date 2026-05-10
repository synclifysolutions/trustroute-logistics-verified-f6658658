import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { CheckCircle2, KeyRound, Send, Sparkles } from "lucide-react";
import { agents } from "@/lib/mock-data";
import { useApp } from "@/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/new")({
  head: () => ({ meta: [{ title: "New Delivery — TrustRoute" }] }),
  component: NewDelivery,
});

function NewDelivery() {
  const otp = useMemo(() => String(Math.floor(1000 + Math.random() * 9000)), []);
  const [agentId, setAgentId] = useState(agents[0].id);
  const [priority, setPriority] = useState<"Standard" | "Express" | "Critical">("Express");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const add = useApp((s) => s.addDelivery);
  const nav = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.target as HTMLFormElement);
    const agent = agents.find((a) => a.id === agentId)!;
    setTimeout(() => {
      add({
        id: `TR-${Math.floor(48300 + Math.random() * 700)}`,
        customer: String(fd.get("customer") || "New Customer"),
        phone: String(fd.get("phone") || ""),
        destination: String(fd.get("destination") || ""),
        packageType: String(fd.get("packageType") || "Package"),
        notes: String(fd.get("notes") || ""),
        priority,
        agent,
        eta: priority === "Critical" ? "8 min" : priority === "Express" ? "22 min" : "1h 12min",
        status: "pending",
        otp,
        distanceKm: 4.2,
        createdAt: new Date().toISOString(),
      });
      setDone(true);
      setTimeout(() => nav({ to: "/dashboard" }), 1400);
    }, 900);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Deploy a new mission</h1>
        <p className="text-sm text-muted-foreground">Configure recipient, payload, and assigned agent. OTP generated automatically.</p>
      </motion.div>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-2xl glass p-6 shadow-card"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recipient & destination</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Customer name" name="customer" defaultValue="Lena Park" />
            <Input label="Phone number" name="phone" defaultValue="+1 415 555 0101" />
            <Input label="Destination address" name="destination" defaultValue="500 Howard St, San Francisco, CA" className="sm:col-span-2" />
            <Input label="Package type" name="packageType" defaultValue="Documents" />
            <div>
              <Label>Priority</Label>
              <div className="mt-1 grid grid-cols-3 gap-2">
                {(["Standard", "Express", "Critical"] as const).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-xs font-medium transition",
                      priority === p
                        ? p === "Critical"
                          ? "border-rose-500/40 bg-rose-500/15 text-rose-200 shadow-[0_0_20px_-6px_oklch(0.65_0.24_22/0.6)]"
                          : p === "Express"
                          ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-200"
                          : "border-violet-500/40 bg-violet-500/15 text-violet-200"
                        : "border-white/10 bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06]",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label>Notes</Label>
              <textarea name="notes" rows={3} placeholder="Special handling, access codes…"
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:bg-white/[0.06]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-6"
        >
          <div className="rounded-2xl glass p-6 shadow-card">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Assign agent</h2>
            <div className="mt-3 space-y-2">
              {agents.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => setAgentId(a.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition",
                    agentId === a.id ? "border-primary/40 bg-primary/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                  )}
                >
                  <div className={cn("relative grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br text-xs font-bold", a.avatarColor)}>
                    {a.name.split(" ").map((n) => n[0]).join("")}
                    {a.online && <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-card" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{a.name}</div>
                    <div className="text-[11px] text-muted-foreground">★ {a.rating} · {a.online ? "Available" : "Offline"}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl glass-strong p-6 shadow-glow">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <KeyRound className="h-4 w-4 text-primary" /> Secure OTP
            </div>
            <div className="mt-4 flex justify-center gap-2">
              {otp.split("").map((d, i) => (
                <div key={i} className="grid h-14 w-12 place-items-center rounded-xl border border-primary/30 bg-primary/10 font-mono text-2xl font-bold text-primary shadow-glow">
                  {d}
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">Auto-shared with the recipient on dispatch.</p>
          </div>

          <button
            disabled={submitting || done}
            type="submit"
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl gradient-primary px-5 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01] disabled:opacity-80"
          >
            {done ? (
              <><CheckCircle2 className="h-4 w-4" /> Mission deployed</>
            ) : submitting ? (
              <><Sparkles className="h-4 w-4 animate-pulse" /> Deploying…</>
            ) : (
              <><Send className="h-4 w-4" /> Deploy mission</>
            )}
          </button>
        </motion.div>
      </form>

      {done && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur"
        >
          <div className="rounded-3xl glass-strong p-10 text-center shadow-elevated">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full gradient-accent shadow-glow-cyan">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Mission deployed</h3>
            <p className="mt-1 text-sm text-muted-foreground">Agent notified · OTP transmitted</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-[10px] uppercase tracking-wider text-muted-foreground">{children}</label>;
}
function Input({ label, className, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <input {...rest}
        className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:bg-white/[0.06]" />
    </div>
  );
}
