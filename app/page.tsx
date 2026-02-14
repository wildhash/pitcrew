"use client";

import { useState } from "react";
import MCPServersList from "@/components/MCPServersList";
import RaceTemplateSelector from "@/components/RaceTemplateSelector";
import RaceExecutor from "@/components/RaceExecutor";
import RaceResults from "@/components/RaceResults";
import AttackLap from "@/components/AttackLap";
import type { RaceTemplate, RaceResult } from "@/lib/archestra/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"race" | "attack">("race");
  const [selectedTemplate, setSelectedTemplate] = useState<RaceTemplate | null>(null);
  const [raceResult, setRaceResult] = useState<RaceResult | null>(null);

  const tabs = [
    { id: "race" as const, label: "🏁 Race Dashboard", color: "blue" },
    { id: "attack" as const, label: "⚠️ Attack Lap", color: "red" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">🏎️</div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                PitCrew
              </h1>
              <p className="text-gray-400">
                Secure, Observable MCP Workflow Racer
              </p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === tab.id
                    ? tab.color === "blue"
                      ? "border-b-2 border-blue-500 text-blue-400"
                      : "border-b-2 border-red-500 text-red-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* Race Dashboard */}
        {activeTab === "race" && (
          <div className="space-y-8">
            {/* MCP Servers Section */}
            <section>
              <MCPServersList />
            </section>

            {/* Race Templates Section */}
            <section>
              <RaceTemplateSelector
                onSelect={setSelectedTemplate}
                selectedTemplate={selectedTemplate}
              />
            </section>

            {/* Race Executor Section */}
            {selectedTemplate && (
              <section>
                <RaceExecutor
                  template={selectedTemplate}
                  onComplete={(result) => {
                    setRaceResult(result);
                  }}
                />
              </section>
            )}

            {/* Race Results Section */}
            {raceResult && (
              <section>
                <RaceResults result={raceResult} />
              </section>
            )}
          </div>
        )}

        {/* Attack Lap */}
        {activeTab === "attack" && (
          <div className="max-w-4xl mx-auto">
            <AttackLap />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
          <p>
            Built with Next.js + Archestra MCP Orchestrator
          </p>
          <p className="mt-2">
            Demonstrating secure, observable multi-tool workflows with prompt injection defense
          </p>
        </footer>
      </div>
    </div>
  );
}
