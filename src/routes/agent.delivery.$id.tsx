import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, CheckCircle2, KeyRound, Loader2, MapPin, ShieldCheck, Upload } from "lucide-react";
import { useApp } from "@/store/app-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agent/delivery/$id")({
  head: () => ({ meta: [{ title: "Verify Delivery — TrustRoute" }] }),
  component: DeliveryFlow,
});

function DeliveryFlow() {
  const { id } = Route.useParams();
  const d = useApp((s) => s.deliveries.find((x) => x.id === id));
  const update = useApp((s) => s.updateStatus);
  const nav = useNavigate();

  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState(false);
  const [gpsState, setGpsState] = useState<"idle" | "loading" | "done">("idle");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const otpFilled = otp.join("");
  const otpValid = d && otpFilled === d.otp;
  const [completing, setCompleting] = useState(false);
  const [hold, setHold] = useState(0);
  const holdRef = useRef<number | null>(null);

  if (!d) throw notFound();

  const startGps = () => {
    setGpsState("loading");
    setTimeout(() => setGpsState("done"), 1400);
  };

  const handleOtp = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 3) otpRefs.current[i + 1]?.focus();
  };

  const startHold = () => {
    holdRef.current = window.setInterval(() => {
      setHold((h) => {
        if (h >= 100) {
          stopHold();
          complete();
          return 100;
        }
        return h + 4;
      });
    }, 30);
  };
  const stopHold = () => {
    if (holdRef.current) clearInterval(holdRef.current);
    holdRef.current = null;
    setHold((h) => (h >= 100 ? h : 0));
  };

  const complete = () => {
    setCompleting(true);
    setTimeout(() => {
      update(d.id, "completed", {
        photoUrl: "",
        gps: { lat: 37.7749 + Math.random() * 0.01, lng: -122.4194 + Math.random() * 0.01 },
        verifiedAt: new Date().toISOString(),
        hash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
      });
      nav({ to: "/dashboard/proofs/$id", params: { id: d.id } });
    }, 1100);
  };

  useEffect(() => () => { if (holdRef.current) clearInterval(holdRef.current); }, []);

  return (
    <div className="space-y-5">
      <Link to="/agent" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Back</Link>

      <div className="rounded-2xl glass p-4">
        <div className="text-[10px] font-mono text-muted-foreground">{d.id}</div>
        <div className="mt-0.5 font-bold">{d.customer}</div>
        <div className="text-xs text-muted-foreground">{d.destination}</div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className={cn("h-1 flex-1 rounded-full transition", step >= n ? "gradient-primary shadow-glow" : "bg-white/10")} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h2 className="text-lg font-bold">Step 1 · Capture proof photo</h2>
            <button onClick={() => setPhoto(true)}
              className={cn(
                "relative grid aspect-video w-full place-items-center overflow-hidden rounded-2xl border-2 border-dashed transition",
                photo ? "border-emerald-500/50 bg-emerald-500/5" : "border-white/15 bg-white/[0.03] hover:bg-white/[0.06]",
              )}
            >
              {photo ? (
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-indigo-900/30 to-cyan-900/40">
                  <div className="absolute inset-0 grid-overlay opacity-30" />
                  <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3" /> Photo captured
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Camera className="mx-auto h-8 w-8 text-primary" />
                  <div className="mt-2 text-sm font-medium text-foreground">Tap to capture</div>
                  <div className="text-xs">or drop a file</div>
                </div>
              )}
            </button>
            <button disabled={!photo} onClick={() => setStep(2)} className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50">
              <Upload className="h-4 w-4" /> Continue
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h2 className="text-lg font-bold">Step 2 · Capture live GPS</h2>
            <div className="rounded-2xl glass p-4">
              <button onClick={startGps} disabled={gpsState !== "idle"}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition",
                  gpsState === "done" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "gradient-primary text-white shadow-glow",
                )}
              >
                {gpsState === "loading" ? (<><Loader2 className="h-4 w-4 animate-spin" /> Locating…</>) :
                 gpsState === "done" ? (<><CheckCircle2 className="h-4 w-4" /> Location verified</>) :
                 (<><MapPin className="h-4 w-4" /> Capture live location</>)}
              </button>

              {gpsState === "done" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 overflow-hidden rounded-xl border border-white/10">
                  <div className="relative h-40 bg-gradient-to-br from-indigo-900/50 to-emerald-900/40">
                    <div className="absolute inset-0 grid-overlay opacity-40" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-400 shadow-glow-cyan">
                        <MapPin className="h-5 w-5 text-emerald-900" />
                      </div>
                      <div className="absolute inset-0 -z-10 animate-ping rounded-full bg-emerald-400/40" />
                    </div>
                  </div>
                  <div className="bg-white/[0.03] p-3 text-xs">
                    <div className="font-mono text-emerald-300">37.77491° N · 122.41943° W</div>
                    <div className="text-muted-foreground">Accuracy ±2.4m · Captured just now</div>
                  </div>
                </motion.div>
              )}
            </div>
            <button disabled={gpsState !== "done"} onClick={() => setStep(3)} className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50">
              Continue
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h2 className="text-lg font-bold">Step 3 · OTP verification</h2>
            <div className="rounded-2xl glass p-5 text-center">
              <KeyRound className="mx-auto h-6 w-6 text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Ask the recipient for their 4-digit code</p>
              <div className="mt-5 flex justify-center gap-2">
                {otp.map((v, i) => (
                  <input
                    key={i}
                    ref={(el) => { if (el) otpRefs.current[i] = el; }}
                    value={v}
                    onChange={(e) => handleOtp(i, e.target.value)}
                    inputMode="numeric"
                    maxLength={1}
                    className={cn(
                      "h-14 w-12 rounded-xl border bg-white/[0.04] text-center font-mono text-2xl font-bold outline-none transition",
                      v ? "border-primary/50 text-primary shadow-glow" : "border-white/10",
                      otpFilled.length === 4 && !otpValid && "border-rose-500/50 text-rose-300",
                    )}
                  />
                ))}
              </div>
              {otpFilled.length === 4 && (
                otpValid ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs text-emerald-300">
                    <ShieldCheck className="h-3.5 w-3.5" /> Code verified
                  </motion.div>
                ) : (
                  <div className="mt-4 text-xs text-rose-300">Incorrect code · Hint: {d.otp}</div>
                )
              )}
            </div>

            <div
              onMouseDown={otpValid ? startHold : undefined}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={otpValid ? startHold : undefined}
              onTouchEnd={stopHold}
              className={cn(
                "relative flex h-14 w-full select-none items-center justify-center overflow-hidden rounded-2xl text-sm font-semibold transition",
                otpValid ? "gradient-primary text-white shadow-glow cursor-pointer" : "bg-white/5 text-muted-foreground",
              )}
            >
              <div className="absolute inset-y-0 left-0 bg-white/20 transition-[width]" style={{ width: `${hold}%` }} />
              <span className="relative">{completing ? "Finalizing…" : otpValid ? "Press & hold to confirm delivery" : "Verify OTP to continue"}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {completing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur">
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full gradient-accent shadow-glow-cyan">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Delivery verified</h3>
            <p className="text-sm text-muted-foreground">Generating proof record…</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
