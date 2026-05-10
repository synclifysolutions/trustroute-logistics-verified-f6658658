import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, ExternalLink, Search, Truck, Package, ShieldCheck, AlertTriangle } from "lucide-react";
import { useApp } from "@/store/app-store";
import { stats } from "@/lib/mock-data";
import { StatusBadge } from "@/components/trust/StatusBadge";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — TrustRoute" }] }),
  component: DashboardHome,
});

const icons = [Package, ShieldCheck, Truck, AlertTriangle];

function DashboardHome() {
  const deliveries = useApp((s) => s.deliveries);
  const [q, setQ] = useState("");
  const filtered = deliveries.filter((d) =>
    [d.id, d.customer, d.destination, d.agent.name].some((v) => v.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Operations overview</h1>
            <p className="text-sm text-muted-foreground">Real-time view of every active route across your fleet.</p>
          </div>
          <Link
            to="/dashboard/new"
            className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:scale-[1.02] transition"
          >
            New delivery
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = icons[i];
          const Up = s.trend === "up";
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-2xl glass p-5 shadow-card transition hover:bg-white/[0.07] hover:-translate-y-0.5"
            >
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-gradient-to-br opacity-20 blur-2xl group-hover:opacity-40 transition"
                style={{ backgroundImage: `linear-gradient(135deg, oklch(0.68 0.22 290), oklch(0.72 0.20 200))` }}
              />
              <div className="flex items-center justify-between">
                <div className={cn("grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br shadow-glow", s.color)}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs", Up ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300")}>
                  {Up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {s.change}
                </span>
              </div>
              <div className="mt-5 text-3xl font-bold tracking-tight">{s.value.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
              {/* sparkline */}
              <svg viewBox="0 0 100 28" className="mt-4 h-7 w-full opacity-70">
                <defs>
                  <linearGradient id={`sg${i}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.22 290)" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="oklch(0.68 0.22 290)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 20 L12 14 L24 18 L36 8 L48 12 L60 6 L72 10 L84 4 L100 9" fill="none" stroke="oklch(0.78 0.18 220)" strokeWidth="1.5" />
                <path d="M0 20 L12 14 L24 18 L36 8 L48 12 L60 6 L72 10 L84 4 L100 9 L100 28 L0 28 Z" fill={`url(#sg${i})`} />
              </svg>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-2xl glass shadow-card overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 p-5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <h2 className="text-base font-semibold">Live operations</h2>
            <span className="text-xs text-muted-foreground">— streaming from {filtered.length} routes</span>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter…"
              className="w-56 rounded-xl border border-white/5 bg-white/[0.03] py-2 pl-9 pr-3 text-sm outline-none focus:border-primary/40"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-white/5">
                <th className="p-4 text-left font-medium">Delivery</th>
                <th className="p-4 text-left font-medium">Destination</th>
                <th className="p-4 text-left font-medium">Agent</th>
                <th className="p-4 text-left font-medium">ETA</th>
                <th className="p-4 text-left font-medium">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <motion.tr
                  key={d.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-white/5 transition hover:bg-white/[0.03]"
                >
                  <td className="p-4">
                    <div className="font-mono text-xs text-muted-foreground">{d.id}</div>
                    <div className="font-semibold">{d.customer}</div>
                  </td>
                  <td className="p-4 text-muted-foreground">{d.destination}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={cn("grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br text-[10px] font-bold", d.agent.avatarColor)}>
                        {d.agent.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-xs font-medium">{d.agent.name}</div>
                        <div className="text-[10px] text-muted-foreground">{d.agent.online ? "● online" : "offline"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{d.eta}</td>
                  <td className="p-4"><StatusBadge status={d.status} /></td>
                  <td className="p-4 text-right">
                    <Link
                      to={d.status === "completed" ? "/dashboard/proofs/$id" : "/dashboard/history"}
                      params={{ id: d.id }}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs hover:bg-white/[0.08]"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
