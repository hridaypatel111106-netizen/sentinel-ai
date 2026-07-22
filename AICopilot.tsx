"use client";

import { useState } from "react";

export default function AICopilot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(
    "👋 Ask me about plant safety, permits, risks or incidents."
  );
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/ask-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      const data = await res.json();

      setAnswer(data.answer);
    } catch (err) {
      setAnswer("❌ Backend connection failed.");
    }

    setLoading(false);
  }

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 h-full">

      <h2 className="text-2xl font-bold">
        AI Safety Copilot
      </h2>

      <p className="text-gray-400 mb-5">
        Powered by Sentinel AI
      </p>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Why is Zone B unsafe?"
        className="w-full bg-[#1F2937] rounded-lg p-3 outline-none mb-4"
      />

      <button
        onClick={askAI}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6 py-3 w-full"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      <div className="mt-5 bg-[#0B1220] rounded-lg p-4 border border-gray-700 min-h-[220px]">
        <p className="whitespace-pre-wrap text-gray-300">
          {answer}
        </p>
      </div>

    </div>
  );
}