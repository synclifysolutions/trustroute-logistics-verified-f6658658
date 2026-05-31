import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, WifiOff, Wifi, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/agent/otp")({
  component: OTPVerification,
});

function OTPVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const [status, setStatus] = React.useState<"idle"|"success"|"error">("idle");
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [timer, setTimer] = React.useState(600);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  React.useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = () => {
    const entered = otp.join("");
    if (entered.length < 6) return;
    // Demo: accept any 6 digit OTP
    if (entered.length === 6) {
      setStatus("success");
      localStorage.setItem("trustroute_otp", JSON.stringify({
        verified: true,
        timestamp: new Date().toISOString(),
        synced: isOnline,
      }));
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">OTP Verification</h1>
          <p className="text-sm text-gray-500">Enter code sent to customer</p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${isOnline ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
          {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>

      {/* Shield Icon */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-red-600" />
            </div>
          </div>
          {status === "success" && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Timer */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 mb-1">OTP expires in</p>
        <p className={`text-3xl font-bold font-mono ${timer < 60 ? "text-red-600" : "text-gray-800"}`}>
          {formatTime(timer)}
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center gap-3 mb-8">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleInput(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
              ${digit ? "border-red-600 bg-red-50 text-red-600" : "border-gray-200 bg-gray-50 text-gray-900"}
              ${status === "error" ? "border-red-400 bg-red-50" : ""}
              ${status === "success" ? "border-green-500 bg-green-50 text-green-600" : ""}
              focus:border-red-600 focus:bg-red-50`}
          />
        ))}
      </div>

      {/* Offline Notice */}
      {!isOnline && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex gap-3">
          <WifiOff className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-orange-700">Offline Mode</p>
            <p className="text-xs text-orange-600 mt-0.5">OTP will be saved locally and verified when internet returns.</p>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {status === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-700">OTP Verified!</p>
            <p className="text-xs text-green-600">Delivery confirmed successfully.</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700">Invalid OTP</p>
            <p className="text-xs text-red-600">Please check and try again.</p>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="space-y-3">
        <button
          onClick={verifyOTP}
          disabled={otp.join("").length < 6 || status === "success"}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-200 disabled:opacity-40"
        >
          <ShieldCheck className="h-5 w-5" />
          {status === "success" ? "Verified ✓" : "Verify OTP"}
        </button>

        <button
          onClick={() => { setTimer(600); setOtp(["","","","","",""]); setStatus("idle"); }}
          className="w-full border border-red-200 text-red-600 font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          Resend OTP
        </button>

        {status === "success" && (
          <button
            onClick={() => navigate({ to: "/agent" })}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-2xl transition-all"
          >
            Next — Sync Status →
          </button>
        )}
      </div>
    </div>
  );
}