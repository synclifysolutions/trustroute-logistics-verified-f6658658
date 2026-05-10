import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useApp } from "@/store/app-store";
import { ArrowLeft, Camera, Download, FileCheck2, MapPin, Share2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard/proofs/$id")({
  head: () => ({ meta: [{ title: "Proof Record — TrustRoute" }] }),
  component: ProofView,
});

function ProofView() {
  const { id } = Route.useParams();
  const d = useApp((s) => s.deliveries.find((x) => x.id === id));
  if (!d) throw notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/dashboard/proofs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All records
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl glass-strong overflow-hidden shadow-elevated">
        <div className="relative aspect-[16/9] bg-gradient-to-br from-violet-900/50 via-indigo-900/40 to-cyan-900/50">
          <div className="absolute inset-0 grid-overlay opacity-30" />
          <div className="absolute inset-0 grid place-items-center">
            <Camera className="h-12 w-12 text-white/30" />
          </div>
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-300 shadow-[0_0_30px_-6px_oklch(0.74_0.18_155/0.6)]">
            <ShieldCheck className="h-4 w-4" /> Verified handoff
          </div>
          <div className="absolute bottom-4 right-4 font-mono text-[10px] text-white/60">{d.id}</div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">{d.customer}</h1>
              <p className="text-sm text-muted-foreground">{d.destination}</p>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs hover:bg-white/[0.08]"><Share2 className="h-3.5 w-3.5" /> Share</button>
              <Link to="/dashboard/certificate/$id" params={{ id: d.id }} className="inline-flex items-center gap-1.5 rounded-xl gradient-primary px-3 py-2 text-xs font-semibold text-white shadow-glow">
                <FileCheck2 className="h-3.5 w-3.5" /> Certificate
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Meta label="Verified at" value={d.proof?.verifiedAt ? new Date(d.proof.verifiedAt).toLocaleString() : new Date().toLocaleString()} />
            <Meta label="OTP" value={d.otp} mono />
            <Meta label="Agent" value={d.agent.name} />
            <Meta label="Package" value={d.packageType} />
            <Meta label="GPS" value={d.proof ? `${d.proof.gps.lat.toFixed(4)}, ${d.proof.gps.lng.toFixed(4)}` : "37.7749, -122.4194"} icon={MapPin} />
            <Meta label="Verification hash" value={d.proof?.hash ?? "0x9c4b...e7d2"} mono />
          </div>

          <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-medium hover:bg-white/[0.08]">
            <Download className="h-4 w-4" /> Download proof bundle
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Meta({ label, value, mono, icon: Icon }: { label: string; value: string; mono?: boolean; icon?: React.ElementType }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 flex items-center gap-1.5 text-sm ${mono ? "font-mono" : "font-medium"}`}>
        {Icon && <Icon className="h-3.5 w-3.5 text-primary" />}{value}
      </div>
    </div>
  );
}
