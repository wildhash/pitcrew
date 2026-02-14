import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RaceExecutor from './RaceExecutor';
import type { RaceTemplate, RaceResult } from '@/lib/archestra/types';

// Mock fetch
global.fetch = jest.fn();

describe('RaceExecutor', () => {
  const mockTemplate: RaceTemplate = {
    id: 'test-template',
    name: 'Test Template',
    description: 'Test description',
    prompt: 'Analyze {repo} and find {task}',
    servers: ['mcp-1'],
    category: 'test',
  };

  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('extracts placeholders from template prompt', () => {
    render(<RaceExecutor template={mockTemplate} onComplete={mockOnComplete} />);
    
    // Should render two input fields based on {repo} and {task} placeholders
    expect(screen.getByLabelText(/repo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/task/i)).toBeInTheDocument();
  });

  it('disables execution button until all fields are filled', () => {
    render(<RaceExecutor template={mockTemplate} onComplete={mockOnComplete} />);
    
    const executeButton = screen.getByRole('button', { name: /start race/i });
    
    // Button should be disabled initially
    expect(executeButton).toBeDisabled();
    
    // Fill in the first field
    const repoInput = screen.getByLabelText(/repo/i);
    fireEvent.change(repoInput, { target: { value: 'my-repo' } });
    
    // Button should still be disabled with only one field filled
    expect(executeButton).toBeDisabled();
    
    // Fill in the second field
    const taskInput = screen.getByLabelText(/task/i);
    fireEvent.change(taskInput, { target: { value: 'my-task' } });
    
    // Button should now be enabled
    expect(executeButton).not.toBeDisabled();
  });

  it('executes race when button is clicked with valid parameters', async () => {
    const mockResult: RaceResult = {
      id: 'race-1',
      templateId: 'test-template',
      startTime: Date.now(),
      endTime: Date.now() + 1000,
      status: 'completed',
      output: 'Test output',
      toolCalls: [],
      tokens: { prompt: 100, completion: 50, total: 150 },
      traces: [],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult,
    });

    render(<RaceExecutor template={mockTemplate} onComplete={mockOnComplete} />);
    
    // Fill in parameters
    const repoInput = screen.getByLabelText(/repo/i);
    const taskInput = screen.getByLabelText(/task/i);
    fireEvent.change(repoInput, { target: { value: 'test-repo' } });
    fireEvent.change(taskInput, { target: { value: 'test-task' } });
    
    // Click execute button
    const executeButton = screen.getByRole('button', { name: /start race/i });
    fireEvent.click(executeButton);
    
    // Should show loading state
    expect(screen.getByText(/executing race/i)).toBeInTheDocument();
    
    // Wait for completion
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith(mockResult);
    });
  });

  it('shows error message when execution fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
    });

    render(<RaceExecutor template={mockTemplate} onComplete={mockOnComplete} />);
    
    // Fill in parameters
    const repoInput = screen.getByLabelText(/repo/i);
    const taskInput = screen.getByLabelText(/task/i);
    fireEvent.change(repoInput, { target: { value: 'test-repo' } });
    fireEvent.change(taskInput, { target: { value: 'test-task' } });
    
    // Click execute button
    const executeButton = screen.getByRole('button', { name: /start race/i });
    fireEvent.click(executeButton);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/failed to execute race/i)).toBeInTheDocument();
    });
    
    // onComplete should not be called
    expect(mockOnComplete).not.toHaveBeenCalled();
  });
});
