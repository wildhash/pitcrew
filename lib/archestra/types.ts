// Core types for Archestra integration

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  version: string;
  endpoint: string;
  tools: string[];
  status: "active" | "inactive";
}

export interface RaceTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  servers: string[];
  category: string;
}

export interface ToolCall {
  id: string;
  tool: string;
  server: string;
  input: Record<string, any>;
  output?: any;
  timestamp: number;
  duration: number;
  status: "success" | "error" | "blocked";
}

export interface RaceResult {
  id: string;
  templateId: string;
  startTime: number;
  endTime: number;
  status: "running" | "completed" | "failed";
  output: string;
  toolCalls: ToolCall[];
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  traces: TraceEvent[];
}

export interface TraceEvent {
  id: string;
  timestamp: number;
  type: "start" | "tool_call" | "tool_result" | "completion" | "error";
  data: any;
}

export interface AttackLapResult {
  id: string;
  injectionType: string;
  injectionPayload: string;
  verdict: "blocked" | "allowed" | "partial";
  blockedTools: string[];
  sensitiveDataExfiltration: boolean;
  details: string;
  timestamp: number;
}
