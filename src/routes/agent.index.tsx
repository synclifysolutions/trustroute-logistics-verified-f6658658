import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/store/app-store";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Package, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agent/")({
  head: () => ({ meta: [{ title: "Agent — TrustRoute" }] }),
  component: AgentHome,
});

function AgentHome() {
  const deliveries = useApp((s) => s.deliveries);
  const active = deliveries.filter((d) => d.status !== "completed");
  const done = deliveries.filter((d) => d.status === "completed").length;
  const total = deliveries.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Good morning</p>
          <h1 className="text-2xl font-bold tracking-tight">Marcus</h1>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 font-bold text-white shadow-glow">MC</div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl glass-strong p-5 shadow-elevated"
      >
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Today's progress</span>
          <span>{done}/{total}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: "easeOut" }}
            className="h-full gradient-accent shadow-glow-cyan"
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{active.length}</div>
            <div className="text-xs text-muted-foreground">Active tasks</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-300">{pct}%</div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>
      </motion.div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your route</h2>
        <div className="mt-3 space-y-3">
          {active.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl glass p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                      d.priority === "Critical" ? "bg-rose-500/20 text-rose-300" : d.priority === "Express" ? "bg-cyan-500/20 text-cyan-300" : "bg-violet-500/20 text-violet-300",
                    )}>
                      <Zap className="h-3 w-3" /> {d.priority}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">{d.id}</span>
                  </div>
                  <div className="mt-2 font-semibold">{d.customer}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {d.destination}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Package className="h-3 w-3" /> {d.packageType}</span>
                    <span>· {d.distanceKm} km</span>
                    <span>· ETA {d.eta}</span>
                  </div>
                </div>
              </div>
              <Link to="/agent/delivery/$id" params={{ id: d.id }}
                className="mt-4 group flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-2.5 text-sm font-semibold text-white shadow-glow"
              >
                Start delivery <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
