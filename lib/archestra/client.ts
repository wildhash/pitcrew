// Mock Archestra API client
// In production, this would connect to real Archestra endpoints

import type { MCPServer, RaceTemplate, RaceResult, AttackLapResult, ToolCall, TraceEvent } from "./types";

const ARCHESTRA_API_URL = process.env.ARCHESTRA_API_URL || "http://localhost:3001";

// Mock data for development
const mockMCPServers: MCPServer[] = [
  {
    id: "mcp-1",
    name: "GitHub MCP Server",
    description: "Access GitHub repositories, issues, and PRs",
    version: "1.0.0",
    endpoint: "http://localhost:3100",
    tools: ["search_repositories", "get_file_contents", "list_issues", "create_issue"],
    status: "active",
  },
  {
    id: "mcp-2",
    name: "Web Search MCP",
    description: "Search the web and fetch content",
    version: "1.2.0",
    endpoint: "http://localhost:3101",
    tools: ["web_search", "web_fetch"],
    status: "active",
  },
  {
    id: "mcp-3",
    name: "Filesystem MCP",
    description: "Read and write files",
    version: "2.0.0",
    endpoint: "http://localhost:3102",
    tools: ["read_file", "write_file", "list_directory", "delete_file"],
    status: "active",
  },
  {
    id: "mcp-4",
    name: "Database MCP",
    description: "Query and manage databases",
    version: "1.5.0",
    endpoint: "http://localhost:3103",
    tools: ["query", "insert", "update", "delete", "export_data"],
    status: "active",
  },
];

const mockRaceTemplates: RaceTemplate[] = [
  {
    id: "template-1",
    name: "GitHub Repository Analysis",
    description: "Analyze a GitHub repository structure and find key files",
    prompt: "Analyze the repository {repo_url} and summarize its structure, key components, and main purpose",
    servers: ["mcp-1"],
    category: "analysis",
  },
  {
    id: "template-2",
    name: "Research Assistant",
    description: "Search web for information and summarize findings",
    prompt: "Research {topic} and provide a comprehensive summary with sources",
    servers: ["mcp-2"],
    category: "research",
  },
  {
    id: "template-3",
    name: "Code Documentation Generator",
    description: "Read code files and generate documentation",
    prompt: "Read the code in {file_path} and generate comprehensive documentation",
    servers: ["mcp-3"],
    category: "documentation",
  },
  {
    id: "template-4",
    name: "Multi-Tool Workflow",
    description: "Complex workflow using multiple MCP servers",
    prompt: "Search GitHub for {query}, then research the top result and save findings to a file",
    servers: ["mcp-1", "mcp-2", "mcp-3"],
    category: "workflow",
  },
  {
    id: "template-5",
    name: "Data Pipeline",
    description: "Query database and process results",
    prompt: "Query the database for {query} and export results",
    servers: ["mcp-4"],
    category: "data",
  },
];

export class ArchestraClient {
  private baseUrl: string;

  constructor(baseUrl: string = ARCHESTRA_API_URL) {
    this.baseUrl = baseUrl;
  }

  async listMCPServers(): Promise<MCPServer[]> {
    // In production: await fetch(`${this.baseUrl}/api/servers`)
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockMCPServers), 500);
    });
  }

  async listRaceTemplates(): Promise<RaceTemplate[]> {
    // In production: await fetch(`${this.baseUrl}/api/templates`)
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRaceTemplates), 500);
    });
  }

  async getRaceTemplate(id: string): Promise<RaceTemplate | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const template = mockRaceTemplates.find((t) => t.id === id);
        resolve(template || null);
      }, 300);
    });
  }

  async executeRace(templateId: string, parameters: Record<string, string>): Promise<RaceResult> {
    // Simulate race execution
    const template = await this.getRaceTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const startTime = Date.now();
    
    // Simulate tool calls
    const toolCalls: ToolCall[] = [];
    const traces: TraceEvent[] = [];

    traces.push({
      id: `trace-${Date.now()}-start`,
      timestamp: startTime,
      type: "start",
      data: { template: template.name, prompt: template.prompt },
    });

    // Simulate some tool calls based on template servers
    for (const serverId of template.servers) {
      const server = mockMCPServers.find((s) => s.id === serverId);
      if (server && server.tools.length > 0) {
        const tool = server.tools[0];
        const callStartTime = Date.now();
        
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const toolCall: ToolCall = {
          id: `call-${Date.now()}-${Math.random()}`,
          tool,
          server: server.name,
          input: parameters,
          output: { result: `Mock output from ${tool}` },
          timestamp: callStartTime,
          duration: Date.now() - callStartTime,
          status: "success",
        };
        
        toolCalls.push(toolCall);
        
        traces.push({
          id: `trace-${Date.now()}-call`,
          timestamp: callStartTime,
          type: "tool_call",
          data: { tool, server: server.name },
        });
        
        traces.push({
          id: `trace-${Date.now()}-result`,
          timestamp: Date.now(),
          type: "tool_result",
          data: { tool, result: toolCall.output },
        });
      }
    }

    const endTime = Date.now();
    
    traces.push({
      id: `trace-${Date.now()}-completion`,
      timestamp: endTime,
      type: "completion",
      data: { duration: endTime - startTime },
    });

    return {
      id: `race-${Date.now()}`,
      templateId,
      startTime,
      endTime,
      status: "completed",
      output: `Successfully executed ${template.name}. Used tools: ${toolCalls.map((c) => c.tool).join(", ")}`,
      toolCalls,
      tokens: {
        prompt: 1500,
        completion: 800,
        total: 2300,
      },
      traces,
    };
  }

  async executeAttackLap(injectionType: string, payload: string): Promise<AttackLapResult> {
    // Simulate attack lap execution
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock security analysis
    const sensitiveTools = ["delete_file", "export_data", "update", "delete"];
    const blockedTools = sensitiveTools.slice(0, 2);

    return {
      id: `attack-${Date.now()}`,
      injectionType,
      injectionPayload: payload,
      verdict: blockedTools.length > 0 ? "blocked" : "allowed",
      blockedTools,
      sensitiveDataExfiltration: false,
      details: `Attempted ${injectionType} injection. Blocked ${blockedTools.length} sensitive tool(s). No data exfiltration detected.`,
      timestamp: Date.now(),
    };
  }
}

export const archestraClient = new ArchestraClient();
