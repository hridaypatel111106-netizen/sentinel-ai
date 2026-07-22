"use client";

import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import KPICards from "./components/KPICards";
import DigitalTwin from "./components/DigitalTwin";
import AlertsPanel from "./components/AlertsPanel";
import RiskChart from "./components/RiskChart";
import AICopilot from "./components/AICopilot";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("Dashboard");

  return (
    <main className="min-h-screen bg-[#0B1220] text-white flex">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Dashboard Layout */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Topbar />

        <div className="p-8 space-y-8 pb-16">
          {/* Top KPI Summary Bar */}
          <KPICards />

          {/* Middle Row: Digital Twin & Emergency Incident Response */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <DigitalTwin />
            <AlertsPanel />
          </div>

          {/* Bottom Row: Risk Intelligence Timeline & Gemini AI Copilot */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <RiskChart />
            <AICopilot />
          </div>
        </div>
      </div>
    </main>
  );
}