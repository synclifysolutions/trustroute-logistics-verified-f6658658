import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Building2, Smartphone, Lock, Mail } from "lucide-react";
import { Logo } from "@/components/trust/Logo";
import { BackgroundFX } from "@/components/trust/BackgroundFX";
import { useApp } from "@/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — TrustRoute" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [role, setRole] = useState<"owner" | "agent">("owner");
  const [email, setEmail] = useState("ops@acme.co");
  const [password, setPassword] = useState("trustroute");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setRoleStore = useApp((s) => s.setRole);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setRoleStore(role);
      navigate({ to: role === "owner" ? "/dashboard" : "/agent" });
    }, 700);
  };

  return (
    <div className="relative min-h-screen">
      <BackgroundFX />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-10 flex justify-center">
          <Logo size="lg" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-strong rounded-3xl p-8 shadow-elevated"
        >
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Choose your portal to continue.</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { id: "owner", label: "Enterprise", desc: "Operations console", icon: Building2 },
              { id: "agent", label: "Agent", desc: "Field terminal", icon: Smartphone },
            ].map((r) => {
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as "owner" | "agent")}
                  className={cn(
                    "relative rounded-2xl border p-4 text-left transition",
                    active
                      ? "border-primary/50 bg-primary/10 shadow-glow"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                  )}
                >
                  <r.icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
                  <div className="mt-3 text-sm font-semibold">{r.label}</div>
                  <div className="text-xs text-muted-foreground">{r.desc}</div>
                  {active && (
                    <motion.div
                      layoutId="role-glow"
                      className="absolute inset-0 -z-10 rounded-2xl gradient-primary opacity-20 blur-xl"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} />
            <Field icon={Lock} label="Password" type="password" value={password} onChange={setPassword} />

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl gradient-primary py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01] disabled:opacity-70"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 animate-ping rounded-full bg-white" />
                  Authenticating
                </span>
              ) : (
                <>
                  Continue <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-[11px] text-muted-foreground">
            Demo credentials are pre-filled. Click Continue to enter the {role === "owner" ? "enterprise console" : "agent terminal"}.
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon, label, type, value, onChange,
}: { icon: React.ElementType; label: string; type: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="group relative block">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="peer block w-full rounded-xl border border-white/10 bg-white/[0.04] px-10 pt-5 pb-2 text-sm text-foreground outline-none transition focus:border-primary/50 focus:bg-white/[0.06] focus:shadow-glow"
      />
      <span className="pointer-events-none absolute left-10 top-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </label>
  );
}
