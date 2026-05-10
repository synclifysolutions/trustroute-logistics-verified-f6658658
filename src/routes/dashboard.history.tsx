import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/store/app-store";
import { StatusBadge } from "@/components/trust/StatusBadge";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard/history")({
  head: () => ({ meta: [{ title: "History — TrustRoute" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const deliveries = useApp((s) => s.deliveries);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Delivery history</h1>
        <p className="text-sm text-muted-foreground">Complete archive of dispatched routes.</p>
      </div>

      <div className="grid gap-3">
        {deliveries.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex flex-wrap items-center gap-4 rounded-2xl glass p-4 hover:bg-white/[0.07] transition"
          >
            <div className="font-mono text-xs text-muted-foreground w-20">{d.id}</div>
            <div className="flex-1 min-w-[180px]">
              <div className="font-semibold">{d.customer}</div>
              <div className="text-xs text-muted-foreground">{d.destination}</div>
            </div>
            <div className="text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleString()}</div>
            <StatusBadge status={d.status} />
            {d.status === "completed" && (
              <Link to="/dashboard/proofs/$id" params={{ id: d.id }} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs hover:bg-white/[0.08]">
                View proof
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
