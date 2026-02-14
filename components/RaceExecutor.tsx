"use client";

import { useState } from "react";
import type { RaceTemplate, RaceResult } from "@/lib/archestra/types";

interface RaceExecutorProps {
  template: RaceTemplate;
  onComplete: (result: RaceResult) => void;
}

export default function RaceExecutor({ template, onComplete }: RaceExecutorProps) {
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract parameter placeholders from prompt
  const parameterNames = Array.from(
    template.prompt.matchAll(/\{([^}]+)\}/g),
    (m) => m[1]
  );

  const handleExecute = async () => {
    try {
      setExecuting(true);
      setError(null);

      const response = await fetch("/api/race", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          parameters,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to execute race");
      }

      const result = await response.json();
      onComplete(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setExecuting(false);
    }
  };

  const canExecute = parameterNames.every((name) => parameters[name]?.trim());

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Execute: {template.name}</h3>
        
        <div className="mb-4 p-3 bg-gray-800 rounded">
          <p className="text-sm text-gray-400 mb-2">Prompt Template:</p>
          <p className="text-sm">{template.prompt}</p>
        </div>

        {parameterNames.length > 0 && (
          <div className="space-y-3 mb-4">
            <p className="text-sm font-semibold">Parameters:</p>
            {parameterNames.map((name) => (
              <div key={name}>
                <label className="block text-sm mb-1 text-gray-400">
                  {name}
                </label>
                <input
                  type="text"
                  value={parameters[name] || ""}
                  onChange={(e) =>
                    setParameters({ ...parameters, [name]: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
                  placeholder={`Enter ${name}`}
                />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded">
            <p className="text-sm text-red-400">Error: {error}</p>
          </div>
        )}

        <button
          onClick={handleExecute}
          disabled={!canExecute || executing}
          className={`w-full py-3 px-4 rounded font-semibold transition-colors ${
            canExecute && !executing
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          {executing ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
              Executing Race...
            </span>
          ) : (
            "Start Race"
          )}
        </button>
      </div>
    </div>
  );
}
