import { ArchestraClient } from './client';

// Mock fetch globally
global.fetch = jest.fn();

describe('ArchestraClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables
    delete process.env.ARCHESTRA_MODE;
    delete process.env.ARCHESTRA_API_URL;
  });

  describe('Mock Mode', () => {
    it('returns mock servers when mode is mock', async () => {
      const client = new ArchestraClient('http://localhost:3000', 'mock');
      const servers = await client.listMCPServers();

      expect(servers).toBeInstanceOf(Array);
      expect(servers.length).toBeGreaterThan(0);
      expect(servers[0]).toHaveProperty('id');
      expect(servers[0]).toHaveProperty('name');
      expect(servers[0]).toHaveProperty('tools');
    });

    it('returns mock templates when mode is mock', async () => {
      const client = new ArchestraClient('http://localhost:3000', 'mock');
      const templates = await client.listRaceTemplates();

      expect(templates).toBeInstanceOf(Array);
      expect(templates.length).toBeGreaterThan(0);
      expect(templates[0]).toHaveProperty('id');
      expect(templates[0]).toHaveProperty('prompt');
    });

    it('executes mock race successfully', async () => {
      const client = new ArchestraClient('http://localhost:3000', 'mock');
      const result = await client.executeRace('template-1', { repo: 'test' });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('status');
      expect(result.status).toBe('completed');
      expect(result).toHaveProperty('toolCalls');
      expect(result).toHaveProperty('traces');
    });

    it('executes mock attack lap successfully', async () => {
      const client = new ArchestraClient('http://localhost:3000', 'mock');
      const result = await client.executeAttackLap('prompt', 'malicious');

      expect(result).toHaveProperty('verdict');
      expect(result).toHaveProperty('blockedTools');
      expect(result.verdict).toMatch(/blocked|allowed|partial/);
    });
  });

  describe('Real Mode', () => {
    it('throws error when baseUrl is not provided in real mode', () => {
      expect(() => {
        new ArchestraClient('', 'real');
      }).toThrow(/ARCHESTRA_API_URL must be set/);
    });

    it('calls real API for listMCPServers', async () => {
      const mockServers = [{ id: 'server-1', name: 'Test Server', tools: [] }];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockServers,
      });

      const client = new ArchestraClient('http://localhost:3000', 'real');
      const servers = await client.listMCPServers();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/servers',
        expect.any(Object)
      );
      expect(servers).toEqual(mockServers);
    });

    it('calls real API for executeRace', async () => {
      const mockResult = { id: 'race-1', status: 'completed' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      });

      const client = new ArchestraClient('http://localhost:3000', 'real');
      const result = await client.executeRace('template-1', { repo: 'test' });

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/race',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(result).toEqual(mockResult);
    });

    it('throws timeout error when request exceeds timeout', async () => {
      // Mock a slow response that never resolves
      const abortError = new Error('Timeout');
      abortError.name = 'AbortError';
      (global.fetch as jest.Mock).mockRejectedValueOnce(abortError);

      const client = new ArchestraClient('http://localhost:3000', 'real', 100);
      
      await expect(client.listMCPServers()).rejects.toThrow(/timeout/i);
    }, 10000); // Increase test timeout

    it('handles API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });

      const client = new ArchestraClient('http://localhost:3000', 'real');
      
      await expect(client.listMCPServers()).rejects.toThrow(/Failed to fetch servers/);
    });
  });
});
