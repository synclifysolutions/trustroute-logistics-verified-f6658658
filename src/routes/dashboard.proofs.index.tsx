import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/store/app-store";
import { FileCheck2 } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard/proofs/")({
  head: () => ({ meta: [{ title: "Proof Records — TrustRoute" }] }),
  component: ProofsList,
});

function ProofsList() {
  const proofs = useApp((s) => s.deliveries.filter((d) => d.status === "completed"));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Proof records</h1>
        <p className="text-sm text-muted-foreground">Cryptographic proof for every verified handoff.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {proofs.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl glass overflow-hidden hover:-translate-y-0.5 transition"
          >
            <div className="aspect-video relative bg-gradient-to-br from-violet-900/40 via-indigo-900/30 to-cyan-900/40">
              <div className="absolute inset-0 grid-overlay opacity-30" />
              <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-medium text-emerald-300 border border-emerald-500/30">
                <FileCheck2 className="h-3 w-3" /> Verified
              </div>
            </div>
            <div className="p-4">
              <div className="font-mono text-[10px] text-muted-foreground">{d.id}</div>
              <div className="mt-0.5 font-semibold">{d.customer}</div>
              <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{d.destination}</div>
              <Link to="/dashboard/proofs/$id" params={{ id: d.id }} className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] py-2 text-xs hover:bg-white/[0.08]">
                Open record
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
