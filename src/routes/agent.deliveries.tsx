import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/store/app-store";
import { StatusBadge } from "@/components/trust/StatusBadge";

export const Route = createFileRoute("/agent/deliveries")({
  head: () => ({ meta: [{ title: "Deliveries — TrustRoute" }] }),
  component: () => {
    const list = useApp((s) => s.deliveries);
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">My deliveries</h1>
        <div className="space-y-2">
          {list.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-xl glass p-3">
              <div>
                <div className="text-sm font-semibold">{d.customer}</div>
                <div className="text-[11px] text-muted-foreground">{d.destination}</div>
              </div>
              <StatusBadge status={d.status} />
            </div>
          ))}
        </div>
      </div>
    );
  },
});
