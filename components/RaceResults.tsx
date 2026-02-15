"use client";

import { useState } from "react";
import type { RaceResult, ToolCall, TraceEvent } from "@/lib/archestra/types";
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from "./ui";

interface RaceResultsProps {
  result: RaceResult;
}

// Subcomponent: Run Summary
function RunSummaryCard({ result }: { result: RaceResult }) {
  const duration = result.endTime - result.startTime;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Race Results</CardTitle>
          <Badge 
            variant={
              result.status === "completed" ? "success" :
              result.status === "failed" ? "danger" : 
              "warning"
            }
          >
            {result.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-gray-800 rounded">
          <p className="text-sm text-gray-400 mb-2">Output:</p>
          <p className="text-sm">{result.output}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
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
      </CardContent>
    </Card>
  );
}

// Subcomponent: Token Usage
function TokenUsageCard({ tokens }: { tokens: RaceResult['tokens'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-gray-800 rounded">
            <span className="text-gray-400">Prompt: </span>
            <span className="font-semibold">{tokens.prompt}</span>
          </div>
          <div className="p-2 bg-gray-800 rounded">
            <span className="text-gray-400">Completion: </span>
            <span className="font-semibold">{tokens.completion}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Subcomponent: Tool Calls
function ToolCallsCard({ toolCalls }: { toolCalls: ToolCall[] }) {
  const [copiedJson, setCopiedJson] = useState(false);

  const copyToolCallsJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(toolCalls, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tool Calls</CardTitle>
          <Button variant="ghost" size="sm" onClick={copyToolCallsJson}>
            {copiedJson ? '✓ Copied' : 'Copy JSON'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {toolCalls.map((call) => (
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
                  <Badge 
                    variant={
                      call.status === "success" ? "success" :
                      call.status === "blocked" ? "danger" : 
                      "warning"
                    }
                  >
                    {call.status}
                  </Badge>
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
      </CardContent>
    </Card>
  );
}

// Subcomponent: Trace
function TraceCard({ traces }: { traces: TraceEvent[] }) {
  const [copiedTrace, setCopiedTrace] = useState(false);

  const copyTraceJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(traces, null, 2));
      setCopiedTrace(true);
      setTimeout(() => setCopiedTrace(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Execution Trace</CardTitle>
          <Button variant="ghost" size="sm" onClick={copyTraceJson}>
            {copiedTrace ? '✓ Copied' : 'Copy JSON'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {traces.map((trace) => (
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
      </CardContent>
    </Card>
  );
}

export default function RaceResults({ result }: RaceResultsProps) {
  const [copiedFull, setCopiedFull] = useState(false);

  const copyFullResultJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Results</h2>
        <Button variant="secondary" size="sm" onClick={copyFullResultJson}>
          {copiedFull ? '✓ Copied' : 'Copy Full JSON'}
        </Button>
      </div>

      <RunSummaryCard result={result} />
      <TokenUsageCard tokens={result.tokens} />
      <ToolCallsCard toolCalls={result.toolCalls} />
      <TraceCard traces={result.traces} />
    </div>
  );
}
