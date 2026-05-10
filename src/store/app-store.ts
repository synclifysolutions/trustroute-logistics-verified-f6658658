import { create } from "zustand";
import { deliveries as seed, type Delivery, type DeliveryStatus } from "@/lib/mock-data";

interface AppState {
  role: "owner" | "agent" | null;
  setRole: (r: "owner" | "agent" | null) => void;
  deliveries: Delivery[];
  addDelivery: (d: Delivery) => void;
  updateStatus: (id: string, status: DeliveryStatus, proof?: Delivery["proof"]) => void;
}

export const useApp = create<AppState>((set) => ({
  role: null,
  setRole: (r) => set({ role: r }),
  deliveries: seed,
  addDelivery: (d) => set((s) => ({ deliveries: [d, ...s.deliveries] })),
  updateStatus: (id, status, proof) =>
    set((s) => ({
      deliveries: s.deliveries.map((d) =>
        d.id === id ? { ...d, status, eta: status === "completed" ? "Delivered" : d.eta, proof: proof ?? d.proof } : d,
      ),
    })),
}));
