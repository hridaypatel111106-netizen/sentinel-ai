"use client";

import { useEffect, useState } from "react";
import { Bell, ShieldCheck, Clock } from "lucide-react";

export default function Topbar() {
  const [eta, setEta] = useState<number>(19);

  useEffect(() => {
    let isMounted = true;
    const fetchEta = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/dashboard");
        const data = await res.json();
        if (isMounted && data?.metrics?.eta_minutes) {
          setEta(data.metrics.eta_minutes);
        }
      } catch (err) {
        console.error("Topbar fetch error:", err);
      }
    };

    fetchEta();
    const interval = setInterval(fetchEta, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="h-20 border-b border-gray-800 bg-[#0B1220] px-8 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide">
          Sentinel AI — Industrial Safety Operations
        </h1>
        <p className="text-xs text-gray-400">Zone B Plant Monitoring & Compound Hazard Control</p>
      </div>

      <div className="flex items-center gap-6">
        {/* Dynamic Synchronized ETA Widget */}
        <div className="bg-[#111827] border border-yellow-500/30 px-4 py-2 rounded-xl flex items-center gap-3">
          <Clock className="text-yellow-400 animate-pulse" size={20} />
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
              Est. Time To Incident
            </p>
            <p className="text-lg font-bold text-yellow-400 leading-none">{eta} min</p>
          </div>
        </div>

        <button className="relative p-2 bg-[#111827] border border-gray-800 rounded-lg text-gray-300 hover:text-white transition">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}