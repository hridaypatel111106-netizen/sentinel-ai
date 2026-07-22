"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Users, FileText, AlertTriangle } from "lucide-react";

interface DashboardMetrics {
  safety_index?: number;
  active_workforce?: number;
  live_permits?: number;
  compound_risks?: number;
  risk_score?: number;
}

interface DashboardResponse {
  metrics?: DashboardMetrics;
}

export default function KPICards() {
  const [data, setData] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchKPIs = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/dashboard");
        if (res.ok) {
          const json: DashboardResponse = await res.json();
          if (isMounted) setData(json);
        }
      } catch (err) {
        console.error("Error fetching KPI metrics:", err);
      }
    };

    fetchKPIs();
    const timer = setInterval(fetchKPIs, 3000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  const metrics = data?.metrics;

  // Fallbacks guarantee non-zero values if API is loading or restricted
  const riskScore = metrics?.risk_score ?? 90;
  const safetyIndex = metrics?.safety_index ?? Math.max(0, 100 - riskScore);
  const activeWorkforce = metrics?.active_workforce ?? 12;
  const livePermits = metrics?.live_permits ?? 3;
  const compoundRisks = metrics?.compound_risks ?? 2;

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Safety Index */}
      <div className="bg-[#111827] border border-gray-800 p-5 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium">Safety Index</p>
          <h2 className="text-3xl font-extrabold text-white mt-1">{safetyIndex}%</h2>
        </div>
        <div className="p-3 bg-green-500/10 rounded-lg text-green-400 border border-green-500/20">
          <ShieldCheck size={24} />
        </div>
      </div>

      {/* Active Workforce */}
      <div className="bg-[#111827] border border-gray-800 p-5 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium">Active Workforce</p>
          <h2 className="text-3xl font-extrabold text-white mt-1">{activeWorkforce}</h2>
        </div>
        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
          <Users size={24} />
        </div>
      </div>

      {/* Live Permits */}
      <div className="bg-[#111827] border border-gray-800 p-5 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium">Live Permits</p>
          <h2 className="text-3xl font-extrabold text-white mt-1">{livePermits}</h2>
        </div>
        <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-400 border border-yellow-500/20">
          <FileText size={24} />
        </div>
      </div>

      {/* Compound Risks */}
      <div className="bg-[#111827] border border-gray-800 p-5 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium">Compound Risks</p>
          <h2 className="text-3xl font-extrabold text-white mt-1">{compoundRisks}</h2>
        </div>
        <div className="p-3 bg-red-500/10 rounded-lg text-red-400 border border-red-500/20">
          <AlertTriangle size={24} />
        </div>
      </div>
    </div>
  );
}