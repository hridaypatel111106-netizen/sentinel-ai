"use client";

import { useEffect, useState } from "react";

const eventPool = [
  {
    time: "10:21",
    title: "Maintenance Started",
    desc: "Valve V-07 entered maintenance mode.",
    color: "border-blue-500",
  },
  {
    time: "10:24",
    title: "Methane Increasing",
    desc: "Gas Sensor B detected 84 ppm methane.",
    color: "border-yellow-500",
  },
  {
    time: "10:27",
    title: "Hot Work Permit Activated",
    desc: "Permit approved in Zone B.",
    color: "border-orange-500",
  },
  {
    time: "10:30",
    title: "Worker Entered Zone",
    desc: "Worker entered hazardous area.",
    color: "border-blue-400",
  },
  {
    time: "10:33",
    title: "Compound Risk Detected",
    desc: "AI correlated maintenance + gas + permit.",
    color: "border-red-500",
  },
  {
    time: "10:35",
    title: "AI Recommended Shutdown",
    desc: "Immediate evacuation advised.",
    color: "border-red-600",
  },
];

export default function RiskChart() {
  const [events, setEvents] = useState(eventPool);

  useEffect(() => {
    const timer = setInterval(() => {
      setEvents((prev) => {
        const shuffled = [...prev];
        shuffled.push(shuffled.shift()!);
        return [...shuffled];
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#111827] rounded-xl border border-gray-800 p-6">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-bold">
            Compound Risk Timeline
          </h2>

          <p className="text-gray-400 text-sm">
            AI Event Correlation Engine
          </p>
        </div>

        <div className="bg-red-600 px-4 py-2 rounded-lg font-semibold">
          LIVE
        </div>

      </div>

      <div className="space-y-4">

        {events.map((event, index) => (

          <div
            key={index}
            className={`bg-[#1F2937] rounded-lg p-4 border-l-4 ${event.color}`}
          >

            <div className="flex justify-between">

              <h3 className="font-bold">
                {event.title}
              </h3>

              <span className="text-sm text-gray-400">
                {event.time}
              </span>

            </div>

            <p className="text-gray-300 mt-2">
              {event.desc}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}