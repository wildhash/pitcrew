"use client";

import { useState, useEffect } from "react";
import type { MCPServer } from "@/lib/archestra/types";

export default function MCPServersList() {
  const [servers, setServers] = useState<MCPServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/servers");
      if (!response.ok) {
        throw new Error("Failed to fetch servers");
      }
      const data = await response.json();
      setServers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Available MCP Servers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servers.map((server) => (
          <div
            key={server.id}
            className="p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{server.name}</h3>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  server.status === "active"
                    ? "bg-green-900/30 text-green-400"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {server.status}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-3">{server.description}</p>
            <div className="text-xs text-gray-500">
              <p>Version: {server.version}</p>
              <p className="mt-1">Tools: {server.tools.length}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {server.tools.slice(0, 3).map((tool) => (
                <span
                  key={tool}
                  className="px-2 py-1 text-xs bg-blue-900/30 text-blue-400 rounded"
                >
                  {tool}
                </span>
              ))}
              {server.tools.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-700 text-gray-400 rounded">
                  +{server.tools.length - 3}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
