"use client";

import { useState, useEffect } from "react";
import type { MCPServer } from "@/lib/archestra/types";
import { AsyncBlock, Card, Badge } from "./ui";

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Available MCP Servers</h2>
        {!loading && !error && (
          <Badge variant="muted">{servers.length} servers</Badge>
        )}
      </div>

      <AsyncBlock
        loading={loading}
        error={error}
        onRetry={fetchServers}
        empty={servers.length === 0}
        emptyTitle="No MCP Servers"
        emptyBody="No servers are currently available."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servers.map((server) => (
            <Card key={server.id} hover>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{server.name}</h3>
                <Badge variant={server.status === "active" ? "success" : "muted"}>
                  {server.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-400 mb-3">{server.description}</p>
              <div className="text-xs text-gray-500">
                <p>Version: {server.version}</p>
                <p className="mt-1">Tools: {server.tools.length}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {server.tools.slice(0, 3).map((tool) => (
                  <Badge key={tool} variant="default">
                    {tool}
                  </Badge>
                ))}
                {server.tools.length > 3 && (
                  <Badge variant="muted">
                    +{server.tools.length - 3}
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </AsyncBlock>
    </div>
  );
}
