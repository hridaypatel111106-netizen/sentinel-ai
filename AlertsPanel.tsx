"use client";

import { useEffect, useState } from "react";

export default function AlertsPanel() {
  const [eta, setEta] = useState(18);
  const [confidence, setConfidence] = useState("98.2");
  const [risk, setRisk] = useState(94);

  useEffect(() => {
    const timer = setInterval(() => {
      setEta(15 + Math.floor(Math.random() * 8));
      setRisk(90 + Math.floor(Math.random() * 8));
      setConfidence((97 + Math.random() * 2).toFixed(1));
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 h-full">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-bold">
            AI Incident Response
          </h2>

          <p className="text-gray-400 text-sm">
            Emergency Decision Engine
          </p>
        </div>

        <div className="bg-red-600 px-4 py-2 rounded-lg font-semibold animate-pulse">
          ACTIVE
        </div>

      </div>

      <div className="space-y-4">

        <div className="bg-[#1F2937] rounded-lg p-4">
          <p className="text-gray-400 text-sm">Affected Zone</p>
          <h3 className="text-xl font-bold text-yellow-300">
            Zone B
          </h3>
        </div>

        <div className="bg-[#1F2937] rounded-lg p-4">
          <p className="text-gray-400 text-sm">Severity</p>
          <h3 className="text-red-500 text-2xl font-bold">
            CRITICAL
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">

          <div className="bg-[#1F2937] rounded-lg p-4">
            <p className="text-gray-400 text-sm">Risk</p>
            <h3 className="text-2xl font-bold text-red-400">
              {risk}%
            </h3>
          </div>

          <div className="bg-[#1F2937] rounded-lg p-4">
            <p className="text-gray-400 text-sm">Confidence</p>
            <h3 className="text-2xl font-bold text-green-400">
              {confidence}%
            </h3>
          </div>

        </div>

        <div className="bg-[#1F2937] rounded-lg p-4">
          <p className="text-gray-400 text-sm">
            Estimated Time To Incident
          </p>

          <h3 className="text-3xl font-bold text-yellow-400">
            {eta} min
          </h3>
        </div>

        <div className="bg-[#0B1220] border-l-4 border-red-500 rounded-lg p-4">

          <h3 className="font-bold mb-3">
            AI Recommendation
          </h3>

          <ul className="text-sm text-gray-300 space-y-2">

            <li>✔ Suspend Hot Work Permit</li>

            <li>✔ Isolate Valve V-07</li>

            <li>✔ Evacuate Zone B</li>

            <li>✔ Dispatch Fire & Safety Team</li>

            <li>✔ Notify Plant Control Room</li>

          </ul>

        </div>

        <button className="w-full bg-red-600 hover:bg-red-700 transition rounded-lg py-3 font-bold">
          🚨 Initiate Emergency Response
        </button>

        <button className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg py-3 font-bold">
          📄 Generate Incident Report
        </button>

      </div>

    </div>
  );
}