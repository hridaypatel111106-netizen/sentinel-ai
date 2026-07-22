"use client";

import { useEffect, useState } from "react";
import { Cpu, ShieldAlert } from "lucide-react";

// Define TypeScript interfaces for backend response
interface ScadaBaseline {
  gas_detector_s102?: string;
  permit_system_p101?: string;
  overall_assessment?: string;
  action?: string;
  blindspot?: string;
}

interface SentinelEngine {
  cross_domain_correlation?: string[];
  risk_score?: string;
  recommended_action?: string;
  value_add?: string;
}

interface BaselineComparisonData {
  traditional_single_sensor_scada: ScadaBaseline;
  sentinel_ai_compound_engine: SentinelEngine;
}

export default function BaselineComparison() {
  const [data, setData] = useState<BaselineComparisonData | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/compare-baseline")
      .then((res) => res.json())
      .then((d: BaselineComparisonData) => setData(d))
      .catch((err) => console.error(err));
  }, []);

  if (!data) return null;

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 mt-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
        <Cpu className="text-indigo-400" size={20} />
        Sentinel AI Engine vs. Traditional SCADA
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {/* SCADA Box */}
        <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Traditional SCADA (Single Sensor)
          </p>
          <p className="text-sm text-yellow-400 font-mono mb-1">
            Status: {data.traditional_single_sensor_scada.overall_assessment}
          </p>
          <p className="text-xs text-gray-300 mt-2">
            <span className="font-semibold text-red-400">Blindspot:</span>{" "}
            {data.traditional_single_sensor_scada.blindspot}
          </p>
        </div>

        {/* Sentinel AI Box */}
        <div className="bg-indigo-950/40 p-4 rounded-lg border border-indigo-500/50">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <ShieldAlert size={14} /> Sentinel Multi-Agent Compound AI
          </p>
          <p className="text-sm text-red-400 font-bold font-mono mb-1">
            Risk: {data.sentinel_ai_compound_engine.risk_score}
          </p>
          <p className="text-xs text-indigo-200 mt-2">
            <span className="font-semibold text-green-400">Action:</span>{" "}
            {data.sentinel_ai_compound_engine.recommended_action}
          </p>
        </div>
      </div>
    </div>
  );
}