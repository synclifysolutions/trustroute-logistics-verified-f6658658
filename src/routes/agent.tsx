import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { BackgroundFX } from "@/components/trust/BackgroundFX";
import { Map, QrCode, Truck, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agent")({
  component: AgentLayout,
});

const tabs = [
  { to: "/agent" as const, label: "Route", icon: Map, exact: true },
  { to: "/agent/scan" as const, label: "Scan", icon: QrCode },
  { to: "/agent/deliveries" as const, label: "Deliveries", icon: Truck },
  { to: "/agent/profile" as const, label: "Profile", icon: User },
];

function AgentLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="relative min-h-screen mx-auto max-w-md">
      <BackgroundFX />
      <div className="relative z-10 px-4 pb-32 pt-6">
        <Outlet />
      </div>
      <nav className="fixed bottom-4 left-1/2 z-30 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl glass-strong p-2 shadow-elevated">
        <div className="flex items-center justify-around">
          {tabs.map((t) => {
            const active = t.exact ? path === t.to : path.startsWith(t.to);
            return (
              <Link key={t.to} to={t.to} className={cn(
                "relative flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-[10px] transition",
                active ? "text-white" : "text-muted-foreground",
              )}>
                {active && <span className="absolute inset-0 -z-10 rounded-xl gradient-primary opacity-90 shadow-glow" />}
                <t.icon className="h-5 w-5" />
                {t.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
