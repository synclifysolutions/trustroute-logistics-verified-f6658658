import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, ChevronLeft, FileCheck2, History, LayoutDashboard, Plus, Search, Settings } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/trust/Logo";
import { BackgroundFX } from "@/components/trust/BackgroundFX";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

const navItems: { to: "/dashboard" | "/dashboard/new" | "/dashboard/history" | "/dashboard/proofs" | "/dashboard/settings"; label: string; icon: React.ElementType; exact?: boolean }[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/new", label: "New Delivery", icon: Plus },
  { to: "/dashboard/history", label: "History", icon: History },
  { to: "/dashboard/proofs", label: "Proof Records", icon: FileCheck2 },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative min-h-screen">
      <BackgroundFX />

      <aside
        className={cn(
          "fixed inset-y-3 left-3 z-30 hidden flex-col rounded-3xl glass-strong p-3 shadow-elevated transition-all duration-300 md:flex",
          collapsed ? "w-[76px]" : "w-[248px]",
        )}
      >
        <div className={cn("flex items-center gap-2 px-2 py-2", collapsed && "justify-center")}>
          {collapsed ? <Logo size="sm" /> : <Logo />}
        </div>
        <nav className="mt-4 flex-1 space-y-1">
          {navItems.map((item) => {
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active ? "text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 -z-10 rounded-xl bg-white/5 ring-1 ring-white/10"
                  />
                )}
                <item.icon className={cn("h-4.5 w-4.5 shrink-0", active && "text-primary")} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
                {active && !collapsed && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
                )}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="mt-2 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] py-2 text-muted-foreground transition hover:bg-white/[0.06]"
        >
          <ChevronLeft className={cn("h-4 w-4 transition", collapsed && "rotate-180")} />
        </button>
      </aside>

      <div className={cn("relative z-10 transition-all duration-300", "md:pl-[272px]", collapsed && "md:pl-[100px]")}>
        <header className="sticky top-0 z-20 mx-3 mt-3 rounded-2xl glass-strong px-4 py-3 md:mx-6 md:mt-4">
          <div className="flex items-center gap-3">
            <div className="md:hidden"><Logo size="sm" /></div>
            <div className="hidden flex-1 md:block">
              <div className="relative max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Search deliveries, agents, IDs…"
                  className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-2 pl-9 pr-3 text-sm outline-none focus:border-primary/40 focus:bg-white/[0.06]"
                />
              </div>
            </div>
            <button className="ml-auto relative grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06]">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-2 py-1.5">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 text-xs font-bold">AC</div>
              <div className="hidden text-xs leading-tight md:block">
                <div className="font-semibold">Acme Logistics</div>
                <div className="text-muted-foreground">Operations</div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-3 pb-24 pt-4 md:px-6 md:pb-12">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-3 left-3 right-3 z-30 flex justify-around rounded-2xl glass-strong px-2 py-2 md:hidden">
          {navItems.slice(0, 4).map((item) => {
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to} className={cn("flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px]", active ? "text-primary" : "text-muted-foreground")}>
                <item.icon className="h-5 w-5" />
                {item.label.split(" ")[0]}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
