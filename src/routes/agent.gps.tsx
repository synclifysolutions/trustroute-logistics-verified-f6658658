import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MapPin, Navigation, CheckCircle, AlertCircle, Wifi, WifiOff } from "lucide-react";

export const Route = createFileRoute("/agent/gps")({
  component: GPSVerification,
});

function GPSVerification() {
  const navigate = useNavigate();
  const [status, setStatus] = React.useState<"idle"|"capturing"|"captured"|"error">("idle");
  const [coords, setCoords] = React.useState<{lat: number; lng: number} | null>(null);
  const [accuracy, setAccuracy] = React.useState<number | null>(null);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

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

  const captureGPS = () => {
    setStatus("capturing");
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setAccuracy(Math.round(position.coords.accuracy));
        setStatus("captured");
        // Save to localStorage for offline use
        localStorage.setItem("trustroute_gps", JSON.stringify({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
          synced: isOnline,
        }));
      },
      () => setStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GPS Verification</h1>
          <p className="text-sm text-gray-500">Capture your delivery location</p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${isOnline ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
          {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="relative w-full h-56 bg-red-50 rounded-2xl border-2 border-red-100 mb-6 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
        {status === "captured" && coords ? (
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-full mx-auto mb-2 shadow-lg shadow-red-200">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <p className="text-xs font-mono text-red-600 font-bold">{coords.lat.toFixed(6)}°N</p>
            <p className="text-xs font-mono text-red-600 font-bold">{coords.lng.toFixed(6)}°E</p>
          </div>
        ) : (
          <div className="relative z-10 text-center">
            <Navigation className="h-12 w-12 text-red-300 mx-auto mb-2" />
            <p className="text-sm text-red-400">Location will appear here</p>
          </div>
        )}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-red-50 rounded-xl p-3 border border-red-100">
          <p className="text-xs text-gray-500 mb-1">Latitude</p>
          <p className="text-sm font-bold text-gray-900 font-mono">
            {coords ? `${coords.lat.toFixed(6)}°` : "—"}
          </p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 border border-red-100">
          <p className="text-xs text-gray-500 mb-1">Longitude</p>
          <p className="text-sm font-bold text-gray-900 font-mono">
            {coords ? `${coords.lng.toFixed(6)}°` : "—"}
          </p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 border border-red-100">
          <p className="text-xs text-gray-500 mb-1">Accuracy</p>
          <p className="text-sm font-bold text-gray-900">
            {accuracy ? `±${accuracy}m` : "—"}
          </p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 border border-red-100">
          <p className="text-xs text-gray-500 mb-1">Sync Status</p>
          <p className={`text-sm font-bold ${isOnline ? "text-green-600" : "text-orange-600"}`}>
            {isOnline ? "Will sync now" : "Saved offline"}
          </p>
        </div>
      </div>

      {/* Offline Notice */}
      {!isOnline && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex gap-3">
          <WifiOff className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-orange-700">You are offline</p>
            <p className="text-xs text-orange-600 mt-0.5">GPS coordinates will be saved on your device and synced automatically when internet returns.</p>
          </div>
        </div>
      )}

      {/* Status Message */}
      {status === "captured" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-700">Location Captured!</p>
            <p className="text-xs text-green-600 mt-0.5">GPS coordinates saved successfully.</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">Location Error</p>
            <p className="text-xs text-red-600 mt-0.5">Could not capture GPS. Please allow location access and try again.</p>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="space-y-3">
        <button
          onClick={captureGPS}
          disabled={status === "capturing"}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-200 disabled:opacity-50"
        >
          {status === "capturing" ? (
            <>
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Capturing GPS...
            </>
          ) : (
            <>
              <Navigation className="h-5 w-5" />
              {status === "captured" ? "Recapture Location" : "Capture GPS Location"}
            </>
          )}
        </button>

        {status === "captured" && (
          <button
            onClick={() => navigate({ to: "/agent/scan" })}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
          >
            Next — Capture Proof →
          </button>
        )}
      </div>
    </div>
  );
}