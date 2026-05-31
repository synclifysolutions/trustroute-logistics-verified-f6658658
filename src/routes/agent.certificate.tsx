 import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Share2, CheckCircle, MapPin, Clock, ShieldCheck, User, Package, Wifi, WifiOff } from "lucide-react";

export const Route = createFileRoute("/agent/certificate")({
  component: PDFCertificate,
});

function PDFCertificate() {
  const [downloading, setDownloading] = React.useState(false);
  const [downloaded, setDownloaded] = React.useState(false);
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

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
    }, 2000);
  };

  const deliveryData = {
    id: "TR-48201-X",
    date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }),
    time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    customer: "Priya Anand",
    address: "278 Market St, Anna Nagar, Chennai",
    agent: "Karthik R",
    agentId: "AGT-0042",
    gps: "13.0827° N, 80.2707° E",
    otpVerified: true,
    tamperStatus: "Clean",
    deviceTime: new Date().toLocaleTimeString(),
    serverTime: new Date().toLocaleTimeString(),
  };

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proof Certificate</h1>
          <p className="text-sm text-gray-500">Official delivery verification</p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${isOnline ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
          {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>

      {/* Certificate Card */}
      <div className="border-2 border-red-100 rounded-3xl overflow-hidden shadow-xl shadow-red-100 mb-6">

        {/* Certificate Header */}
        <div className="bg-red-600 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">TrustRoute</p>
              <p className="text-red-200 text-xs">Official Delivery Proof Certificate</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-red-200 text-xs">Shipment ID</p>
              <p className="text-white font-bold font-mono">{deliveryData.id}</p>
            </div>
            <div className="bg-green-400 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              VERIFIED
            </div>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-5 space-y-4 bg-white">

          {/* Photo Placeholder */}
          <div className="w-full h-40 bg-red-50 rounded-2xl border-2 border-dashed border-red-200 flex items-center justify-center">
            <div className="text-center">
              <Package className="h-10 w-10 text-red-300 mx-auto mb-2" />
              <p className="text-xs text-red-400">Delivery Photo</p>
              <p className="text-xs text-red-300">Captured at doorstep</p>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
              <User className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Customer</p>
                <p className="text-sm font-semibold text-gray-800">{deliveryData.customer}</p>
                <p className="text-xs text-gray-500">{deliveryData.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
              <MapPin className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">GPS Location</p>
                <p className="text-sm font-semibold text-gray-800 font-mono">{deliveryData.gps}</p>
                <p className="text-xs text-green-600 font-medium">✓ Location Verified</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
              <Clock className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Timestamps</p>
                <p className="text-sm font-semibold text-gray-800">{deliveryData.date}</p>
                <div className="flex gap-3 mt-1">
                  <p className="text-xs text-gray-500">Device: <span className="text-gray-700">{deliveryData.deviceTime}</span></p>
                  <p className="text-xs text-gray-500">Server: <span className="text-gray-700">{deliveryData.serverTime}</span></p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
              <ShieldCheck className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Verification Status</p>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> OTP Verified
                  </span>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> GPS Verified
                  </span>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Tamper Free
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
              <User className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Delivery Agent</p>
                <p className="text-sm font-semibold text-gray-800">{deliveryData.agent}</p>
                <p className="text-xs text-gray-500">ID: {deliveryData.agentId}</p>
              </div>
            </div>
          </div>

          {/* Digital Stamp */}
          <div className="border-t border-red-100 pt-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Digitally verified by</p>
              <p className="text-sm font-bold text-red-600">TrustRoute Platform</p>
            </div>
            <div className="w-16 h-16 border-2 border-red-200 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-red-400 rounded-full flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {downloaded && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
          <p className="text-sm font-semibold text-green-700">Certificate downloaded successfully!</p>
        </div>
      )}

      {/* Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-200 disabled:opacity-50"
        >
          {downloading ? (
            <><div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating PDF...</>
          ) : downloaded ? (
            <><CheckCircle className="h-5 w-5" /> Downloaded ✓</>
          ) : (
            <><Download className="h-5 w-5" /> Download PDF Certificate</>
          )}
        </button>

        <button className="w-full border-2 border-red-200 text-red-600 font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-50 transition-all">
          <Share2 className="h-5 w-5" />
          Share Certificate Link
        </button>
      </div>
    </div>
  );
}