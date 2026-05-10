import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Star, Trophy, Truck } from "lucide-react";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/agent/profile")({
  head: () => ({ meta: [{ title: "Profile — TrustRoute" }] }),
  component: Profile,
});

function Profile() {
  const setRole = useApp((s) => s.setRole);
  const nav = useNavigate();
  return (
    <div className="space-y-5">
      <div className="rounded-2xl glass-strong p-6 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-2xl font-bold text-white shadow-glow">MC</div>
        <h1 className="mt-3 text-xl font-bold">Marcus Chen</h1>
        <p className="text-xs text-muted-foreground">Field Agent · ID #AG-01</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Truck, label: "Routes", value: "284" },
          { icon: Star, label: "Rating", value: "4.9" },
          { icon: Trophy, label: "Streak", value: "32d" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl glass p-4 text-center">
            <s.icon className="mx-auto h-5 w-5 text-primary" />
            <div className="mt-2 text-lg font-bold">{s.value}</div>
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
      <button
        onClick={() => { setRole(null); nav({ to: "/" }); }}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm hover:bg-white/[0.06]"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
      <Link to="/dashboard" className="block text-center text-xs text-muted-foreground hover:text-foreground">Switch to enterprise console</Link>
    </div>
  );
}
