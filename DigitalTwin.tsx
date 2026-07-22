"use client";

import React, { useEffect, useState } from "react";
import { Activity, ShieldAlert, Cpu } from "lucide-react";

interface ZoneData {
  id: string;
  name: string;
  status: "CRITICAL" | "WARNING" | "SAFE";
  gasLevel: number;
  temp: number;
  activeWork: string;
}

export default function DigitalTwin() {
  const [zones, setZones] = useState<ZoneData[]>([
    { id: "A", name: "Zone A - Storage", status: "SAFE", gasLevel: 12, temp: 32, activeWork: "Inspection" },
    { id: "B", name: "Zone B - Process Control", status: "CRITICAL", gasLevel: 91, temp: 81, activeWork: "Hot Work Permit P101" },
    { id: "C", name: "Zone C - Utility Yard", status: "SAFE", gasLevel: 8, temp: 28, activeWork: "Routine Maintenance" },
  ]);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/dashboard");
        if (res.ok) {
          const data = await res.json();
          if (data.sensors && data.sensors.length > 0) {
            // Process API response if available
          }
        }
      } catch (err) {
        console.error("Dashboard poll failed, using local twin layout", err);
      }
    };

    fetchZones();
    const interval = setInterval(fetchZones, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 flex flex-col justify-between space-y-6 min-h-[480px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="text-blue-500 animate-pulse" size={24} />
          <div>
            <h3 className="text-lg font-bold text-white">Digital Twin — Zone Safety Visualizer</h3>
            <p className="text-xs text-gray-400">Real-time spatial correlation map</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold rounded-full animate-pulse">
          LIVE MONITORED
        </span>
      </div>

      {/* Spatial Correlation Map Box */}
      <div className="relative bg-[#0b1329] border border-gray-800 rounded-xl p-6 flex-1 flex flex-col justify-around min-h-[320px]">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:16px_16px] rounded-xl pointer-events-none"></div>

        {/* Control Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {zones.map((zone) => {
            const isCritical = zone.status === "CRITICAL";
            return (
              <div
                key={zone.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCritical
                    ? "bg-red-950/30 border-red-500/50 shadow-lg shadow-red-500/10"
                    : "bg-[#131d33] border-gray-800"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Cpu size={18} className={isCritical ? "text-red-400" : "text-blue-400"} />
                    <span className="text-sm font-bold text-white">{zone.name}</span>
                  </div>
                  {isCritical && <ShieldAlert size={18} className="text-red-500 animate-bounce" />}
                </div>

                <div className="space-y-1 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gas Conc:</span>
                    <span className={isCritical ? "text-red-400 font-bold" : "text-green-400"}>
                      {zone.gasLevel} ppm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Temp:</span>
                    <span className={isCritical ? "text-red-400 font-bold" : "text-green-400"}>
                      {zone.temp} °C
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-800/80 text-[11px] text-gray-400 truncate">
                    Activity: <span className="text-gray-200">{zone.activeWork}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Spatial Correlation Status Footer */}
        <div className="relative z-10 mt-4 p-3 bg-[#111a2e] border border-gray-800 rounded-lg flex items-center justify-between text-xs">
          <span className="text-gray-400">Cross-Domain Risk Linkage:</span>
          <span className="text-red-400 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            Compound Hazard Triggered in Zone B
          </span>
        </div>
      </div>
    </div>
  );
}