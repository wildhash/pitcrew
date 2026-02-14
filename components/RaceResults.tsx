"use client";

import type { RaceResult } from "@/lib/archestra/types";

interface RaceResultsProps {
  result: RaceResult;
}

export default function RaceResults({ result }: RaceResultsProps) {
  const duration = result.endTime - result.startTime;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Race Results</h3>
          <span
            className={`px-3 py-1 rounded text-sm font-semibold ${
              result.status === "completed"
                ? "bg-green-900/30 text-green-400"
                : result.status === "failed"
                ? "bg-red-900/30 text-red-400"
                : "bg-yellow-900/30 text-yellow-400"
            }`}
          >
            {result.status}
          </span>
        </div>

        <div className="mb-4 p-3 bg-gray-800 rounded">
          <p className="text-sm text-gray-400 mb-2">Output:</p>
          <p className="text-sm">{result.output}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-3 bg-gray-800 rounded">
            <p className="text-xs text-gray-400 mb-1">Duration</p>
            <p className="text-lg font-semibold">{duration}ms</p>
          </div>
          <div className="p-3 bg-gray-800 rounded">
            <p className="text-xs text-gray-400 mb-1">Tool Calls</p>
            <p className="text-lg font-semibold">{result.toolCalls.length}</p>
          </div>
          <div className="p-3 bg-gray-800 rounded">
            <p className="text-xs text-gray-400 mb-1">Total Tokens</p>
            <p className="text-lg font-semibold">{result.tokens.total}</p>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold mb-2">Token Usage</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-gray-800 rounded">
              <span className="text-gray-400">Prompt: </span>
              <span className="font-semibold">{result.tokens.prompt}</span>
            </div>
            <div className="p-2 bg-gray-800 rounded">
              <span className="text-gray-400">Completion: </span>
              <span className="font-semibold">{result.tokens.completion}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold mb-2">Tool Calls</h4>
          <div className="space-y-2">
            {result.toolCalls.map((call) => (
              <div
                key={call.id}
                className="p-3 bg-gray-800 rounded border-l-4 border-blue-500"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-semibold">{call.tool}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      ({call.server})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {call.duration}ms
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        call.status === "success"
                          ? "bg-green-900/30 text-green-400"
                          : call.status === "blocked"
                          ? "bg-red-900/30 text-red-400"
                          : "bg-yellow-900/30 text-yellow-400"
                      }`}
                    >
                      {call.status}
                    </span>
                  </div>
                </div>
                {call.output && (
                  <div className="text-xs text-gray-400 mt-2">
                    <p className="mb-1">Output:</p>
                    <pre className="bg-gray-900 p-2 rounded overflow-x-auto">
                      {JSON.stringify(call.output, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Execution Trace</h4>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {result.traces.map((trace) => (
              <div
                key={trace.id}
                className="p-2 bg-gray-800 rounded text-xs flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold text-blue-400">
                    {trace.type}
                  </span>
                  <span className="text-gray-400 ml-2">
                    {JSON.stringify(trace.data)}
                  </span>
                </div>
                <span className="text-gray-500">
                  {new Date(trace.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
