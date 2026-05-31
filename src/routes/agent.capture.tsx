import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, PenTool, CheckCircle, WifiOff, Wifi, Upload, X } from "lucide-react";

export const Route = createFileRoute("/agent/capture")({
  component: OfflineCapture,
});

function OfflineCapture() {
  const navigate = useNavigate();
  const [photo, setPhoto] = React.useState<string | null>(null);
  const [signature, setSignature] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [saved, setSaved] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#DC2626";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setSignature(true);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(false);
  };

  const saveOffline = () => {
    localStorage.setItem("trustroute_capture", JSON.stringify({
      photo: photo ? "captured" : null,
      signature: signature,
      timestamp: new Date().toISOString(),
      synced: isOnline,
    }));
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proof Capture</h1>
          <p className="text-sm text-gray-500">Capture delivery evidence</p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${isOnline ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
          {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>

      {/* Offline Notice */}
      {!isOnline && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex gap-3">
          <WifiOff className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-orange-700">Offline Mode Active</p>
            <p className="text-xs text-orange-600 mt-0.5">All captured data will be stored locally and synced automatically when internet returns.</p>
          </div>
        </div>
      )}

      {/* Photo Capture */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Camera className="h-4 w-4 text-red-600" />
          Package Photo
        </p>

        {photo ? (
          <div className="relative rounded-2xl overflow-hidden border-2 border-red-200">
            <img src={photo} alt="Captured" className="w-full h-48 object-cover" />
            <button
              onClick={() => setPhoto(null)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Photo Captured
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 bg-red-50 border-2 border-dashed border-red-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-red-100 transition-colors"
          >
            <Camera className="h-12 w-12 text-red-300 mb-2" />
            <p className="text-sm text-red-400 font-medium">Tap to capture photo</p>
            <p className="text-xs text-red-300 mt-1">Package must be visible</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </div>

      {/* Signature Capture */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <PenTool className="h-4 w-4 text-red-600" />
            Recipient Signature
          </p>
          {signature && (
            <button onClick={clearSignature} className="text-xs text-red-600 underline">
              Clear
            </button>
          )}
        </div>
        <div className="border-2 border-dashed border-red-200 rounded-2xl overflow-hidden bg-red-50">
          <canvas
            ref={canvasRef}
            width={500}
            height={150}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
            className="w-full cursor-crosshair touch-none"
          />
          {!signature && (
            <p className="text-center text-xs text-red-300 pb-3">
              Sign here with mouse or finger
            </p>
          )}
        </div>
        {signature && (
          <div className="flex items-center gap-2 mt-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <p className="text-xs text-green-600 font-medium">Signature captured</p>
          </div>
        )}
      </div>

      {/* Pending Queue */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Upload className="h-4 w-4 text-red-600" />
          Pending Sync Queue
        </p>
        <div className="space-y-2">
          {["GPS Coordinates", "Package Photo", "Signature"].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <p className="text-xs text-gray-600">{item}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                (i === 0) ? "bg-green-100 text-green-700" :
                (i === 1 && photo) ? "bg-green-100 text-green-700" :
                (i === 2 && signature) ? "bg-green-100 text-green-700" :
                "bg-orange-100 text-orange-700"
              }`}>
                {(i === 0) ? "Ready" :
                 (i === 1 && photo) ? "Ready" :
                 (i === 2 && signature) ? "Ready" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
          <p className="text-sm font-semibold text-green-700">
            Saved {isOnline ? "and syncing!" : "offline! Will sync when connected."}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={saveOffline}
          disabled={!photo && !signature}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-200 disabled:opacity-40"
        >
          <Upload className="h-5 w-5" />
          Save Proof {isOnline ? "& Sync" : "Offline"}
        </button>

        {saved && (
          <button
            onClick={() => navigate({ to: "/agent" })}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-2xl transition-all"
          >
            Next — OTP Verification →
          </button>
        )}
      </div>
    </div>
  );
}