import { archestraClient } from '@/lib/archestra/client';
import { NextResponse } from 'next/server';

// Mock the archestra client
jest.mock('@/lib/archestra/client', () => ({
  archestraClient: {
    executeRace: jest.fn(),
  },
}));

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body: any, init?: any) => ({
      json: async () => body,
      status: init?.status || 200,
    })),
  },
}));

// Import after mocking
import { POST } from './route';

describe('/api/race', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when templateId is missing', async () => {
    const mockRequest = {
      json: async () => ({ parameters: {} }),
    } as any;

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Template ID is required' },
      { status: 400 }
    );
  });

  it('executes race successfully with valid templateId', async () => {
    const mockResult = {
      id: 'race-1',
      templateId: 'template-1',
      startTime: Date.now(),
      endTime: Date.now() + 1000,
      status: 'completed',
      output: 'Test output',
      toolCalls: [],
      tokens: { prompt: 100, completion: 50, total: 150 },
      traces: [],
    };

    (archestraClient.executeRace as jest.Mock).mockResolvedValue(mockResult);

    const mockRequest = {
      json: async () => ({ 
        templateId: 'template-1', 
        parameters: { repo: 'test-repo' } 
      }),
    } as any;

    await POST(mockRequest);

    expect(archestraClient.executeRace).toHaveBeenCalledWith('template-1', { repo: 'test-repo' });
    expect(NextResponse.json).toHaveBeenCalledWith(mockResult);
  });

  it('returns 500 when execution fails', async () => {
    (archestraClient.executeRace as jest.Mock).mockRejectedValue(
      new Error('Execution failed')
    );

    const mockRequest = {
      json: async () => ({ templateId: 'template-1', parameters: {} }),
    } as any;

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Failed to execute race' },
      { status: 500 }
    );
  });
});
