import { archestraClient } from '@/lib/archestra/client';
import { NextResponse } from 'next/server';

// Mock the archestra client
jest.mock('@/lib/archestra/client', () => ({
  archestraClient: {
    executeAttackLap: jest.fn(),
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

describe('/api/attack-lap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when injectionType is missing', async () => {
    const mockRequest = {
      json: async () => ({ payload: 'test' }),
    } as any;

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Injection type and payload are required' },
      { status: 400 }
    );
  });

  it('returns 400 when payload is missing', async () => {
    const mockRequest = {
      json: async () => ({ injectionType: 'prompt' }),
    } as any;

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Injection type and payload are required' },
      { status: 400 }
    );
  });

  it('executes attack lap successfully with valid input', async () => {
    const mockResult = {
      id: 'attack-1',
      injectionType: 'prompt',
      injectionPayload: 'malicious payload',
      verdict: 'blocked',
      blockedTools: ['delete_file'],
      sensitiveDataExfiltration: false,
      details: 'Attack blocked',
      timestamp: Date.now(),
    };

    (archestraClient.executeAttackLap as jest.Mock).mockResolvedValue(mockResult);

    const mockRequest = {
      json: async () => ({ 
        injectionType: 'prompt', 
        payload: 'malicious payload' 
      }),
    } as any;

    await POST(mockRequest);

    expect(archestraClient.executeAttackLap).toHaveBeenCalledWith('prompt', 'malicious payload');
    expect(NextResponse.json).toHaveBeenCalledWith(mockResult);
  });

  it('returns 500 when execution fails', async () => {
    (archestraClient.executeAttackLap as jest.Mock).mockRejectedValue(
      new Error('Execution failed')
    );

    const mockRequest = {
      json: async () => ({ injectionType: 'prompt', payload: 'test' }),
    } as any;

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Failed to execute attack lap' },
      { status: 500 }
    );
  });
});
