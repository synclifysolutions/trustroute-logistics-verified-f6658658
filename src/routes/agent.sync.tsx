 import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RefreshCw, Wifi, WifiOff, CheckCircle, Clock, Upload, MapPin, Camera, ShieldCheck, FileText } from "lucide-react";

export const Route = createFileRoute("/agent/sync")({
  component: SyncStatus,
});

function SyncStatus() {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [syncing, setSyncing] = React.useState(false);
  const [syncProgress, setSyncProgress] = React.useState(0);
  const [syncDone, setSyncDone] = React.useState(false);

  const pendingItems = [
    { icon: MapPin, label: "GPS Coordinates", size: "2 KB", status: "pending" },
    { icon: Camera, label: "Package Photo", size: "1.2 MB", status: "pending" },
    { icon: ShieldCheck, label: "OTP Verification", size: "1 KB", status: "pending" },
    { icon: FileText, label: "Delivery Record", size: "4 KB", status: "pending" },
  ];

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

  const startSync = () => {
    if (!isOnline) return;
    setSyncing(true);
    setSyncProgress(0);
    const interval = setInterval(() => {
      setSyncProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setSyncing(false);
          setSyncDone(true);
          return 100;
        }
        return p + 5;
      });
    }, 150);
  };

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sync Status</h1>
          <p className="text-sm text-gray-500">Upload pending delivery data</p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${isOnline ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
          {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">Overall Sync Progress</p>
          <p className="text-sm font-bold text-red-600">{syncProgress}%</p>
        </div>
        <div className="w-full bg-red-100 rounded-full h-3 mb-3">
          <div
            className="bg-red-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${syncProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>4 items pending</span>
          <span>Last sync: Never</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-orange-600">4</p>
          <p className="text-xs text-gray-500 mt-1">Pending</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-green-600">{syncDone ? 4 : 0}</p>
          <p className="text-xs text-gray-500 mt-1">Synced</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-red-600">0</p>
          <p className="text-xs text-gray-500 mt-1">Failed</p>
        </div>
      </div>

      {/* Pending Items */}
      <p className="text-sm font-semibold text-gray-700 mb-3">Pending Items</p>
      <div className="space-y-3 mb-6">
        {pendingItems.map((item, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
              <item.icon className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-500">{item.size}</p>
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              syncDone ? "bg-green-100 text-green-700" :
              syncing && syncProgress > (i * 25) ? "bg-blue-100 text-blue-700" :
              "bg-orange-100 text-orange-700"
            }`}>
              {syncDone ? (
                <><CheckCircle className="h-3 w-3" /> Synced</>
              ) : syncing && syncProgress > (i * 25) ? (
                <><RefreshCw className="h-3 w-3 animate-spin" /> Uploading</>
              ) : (
                <><Clock className="h-3 w-3" /> Pending</>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Offline Warning */}
      {!isOnline && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex gap-3">
          <WifiOff className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-orange-700">No Internet Connection</p>
            <p className="text-xs text-orange-600 mt-0.5">Data is safely stored. Sync will start automatically when connected.</p>
          </div>
        </div>
      )}

      {/* Success */}
      {syncDone && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-700">All Data Synced!</p>
            <p className="text-xs text-green-600">Delivery proof uploaded successfully.</p>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="space-y-3">
        <button
          onClick={startSync}
          disabled={!isOnline || syncing || syncDone}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-200 disabled:opacity-40"
        >
          {syncing ? (
            <><RefreshCw className="h-5 w-5 animate-spin" /> Syncing...</>
          ) : syncDone ? (
            <><CheckCircle className="h-5 w-5" /> Sync Complete</>
          ) : (
            <><Upload className="h-5 w-5" /> Start Sync</>
          )}
        </button>

        {syncDone && (
          <button
            onClick={() => navigate({ to: "/agent" })}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-2xl transition-all"
          >
            Next — View PDF Certificate →
          </button>
        )}
      </div>
    </div>
  );
}