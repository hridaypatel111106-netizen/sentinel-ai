"use client";

import { useState } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";

export default function EmergencySimulator() {
  const [simulating, setSimulating] = useState(false);

  const triggerSimulation = async () => {
    setSimulating(true);
    // Visual feedback trigger for presentation/demo video
    setTimeout(() => setSimulating(false), 2000);
  };

  return (
    <div className="bg-[#111827] border border-red-900/50 rounded-xl p-4 flex items-center justify-between mt-4">
      <div className="flex items-center gap-3">
        <AlertOctagon className="text-red-500 animate-pulse" size={24} />
        <div>
          <h4 className="text-sm font-semibold text-white">Live Incident Simulator</h4>
          <p className="text-xs text-gray-400">Inject Methane Leak into Zone B to test Compound AI Escalation</p>
        </div>
      </div>
      <button
        onClick={triggerSimulation}
        disabled={simulating}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition"
      >
        <RefreshCw className={simulating ? "animate-spin" : ""} size={14} />
        {simulating ? "Simulating Gas Leak..." : "Inject Zone B Hazard"}
      </button>
    </div>
  );
}