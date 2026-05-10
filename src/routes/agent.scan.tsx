import { createFileRoute } from "@tanstack/react-router";
import { QrCode } from "lucide-react";

export const Route = createFileRoute("/agent/scan")({
  head: () => ({ meta: [{ title: "Scan — TrustRoute" }] }),
  component: () => (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Scan parcel</h1>
      <div className="relative grid aspect-square place-items-center overflow-hidden rounded-3xl glass-strong">
        <div className="absolute inset-6 rounded-2xl border-2 border-primary/60 shadow-glow" />
        <QrCode className="h-24 w-24 text-primary/70" />
        <div className="absolute left-6 right-6 top-1/2 h-0.5 animate-pulse bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
      <p className="text-center text-xs text-muted-foreground">Align QR within the frame to load delivery</p>
    </div>
  ),
});
