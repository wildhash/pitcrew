import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AttackLap from './AttackLap';
import type { AttackLapResult } from '@/lib/archestra/types';

// Mock fetch
global.fetch = jest.fn();

describe('AttackLap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders attack lap form with injection type selector', () => {
    render(<AttackLap />);
    
    expect(screen.getByRole('heading', { name: /attack lap/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/injection type/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter malicious payload/i)).toBeInTheDocument();
  });

  it('shows verdict badge when attack completes successfully', async () => {
    const mockResult: AttackLapResult = {
      id: 'attack-1',
      injectionType: 'prompt',
      injectionPayload: 'test payload',
      verdict: 'blocked',
      blockedTools: ['delete_file', 'export_data'],
      sensitiveDataExfiltration: false,
      details: 'Attack blocked successfully',
      timestamp: Date.now(),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult,
    });

    render(<AttackLap />);
    
    // Fill in payload
    const payloadInput = screen.getByPlaceholderText(/enter malicious payload/i);
    fireEvent.change(payloadInput, { target: { value: 'malicious payload' } });
    
    // Click execute button
    const executeButton = screen.getByRole('button', { name: /launch attack lap/i });
    fireEvent.click(executeButton);
    
    // Wait for result
    await waitFor(() => {
      expect(screen.getByText(/security verdict/i)).toBeInTheDocument();
    });
    
    // Check verdict badge (get first occurrence)
    const badges = screen.getAllByText(/BLOCKED/i);
    expect(badges[0]).toBeInTheDocument();
    
    // Check blocked tools list
    expect(screen.getByText(/delete_file/i)).toBeInTheDocument();
    expect(screen.getByText(/export_data/i)).toBeInTheDocument();
  });

  it('renders blocked tools list when attack is blocked', async () => {
    const mockResult: AttackLapResult = {
      id: 'attack-2',
      injectionType: 'jailbreak',
      injectionPayload: 'test',
      verdict: 'blocked',
      blockedTools: ['dangerous_tool', 'risky_tool'],
      sensitiveDataExfiltration: false,
      details: 'Tools blocked',
      timestamp: Date.now(),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResult,
    });

    render(<AttackLap />);
    
    // Fill in payload
    const payloadInput = screen.getByPlaceholderText(/enter malicious payload/i);
    fireEvent.change(payloadInput, { target: { value: 'test payload' } });
    
    // Click execute button
    const executeButton = screen.getByRole('button', { name: /launch attack lap/i });
    fireEvent.click(executeButton);
    
    // Wait for result
    await waitFor(() => {
      expect(screen.getByText(/blocked sensitive tools/i)).toBeInTheDocument();
    });
    
    // Check tools are rendered as badges
    expect(screen.getByText('dangerous_tool')).toBeInTheDocument();
    expect(screen.getByText('risky_tool')).toBeInTheDocument();
  });

  it('disables button when payload is empty', () => {
    render(<AttackLap />);
    
    const executeButton = screen.getByRole('button', { name: /launch attack lap/i });
    expect(executeButton).toBeDisabled();
  });

  it('shows error message when execution fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Server Error',
    });

    render(<AttackLap />);
    
    // Fill in payload
    const payloadInput = screen.getByPlaceholderText(/enter malicious payload/i);
    fireEvent.change(payloadInput, { target: { value: 'test payload' } });
    
    // Click execute button
    const executeButton = screen.getByRole('button', { name: /launch attack lap/i });
    fireEvent.click(executeButton);
    
    // Wait for error
    await waitFor(() => {
      expect(screen.getByText(/failed to execute attack lap/i)).toBeInTheDocument();
    });
  });
});
