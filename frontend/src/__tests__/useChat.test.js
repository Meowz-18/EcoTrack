/**
 * @file Unit tests for the useChat custom hook.
 * Tests message management, API calls, and error handling.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChat } from '../hooks/useChat';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useChat Hook', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with a welcome message from the bot', () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].type).toBe('bot');
    expect(result.current.messages[0].text).toContain('EcoTrack');
  });

  it('starts with empty input value', () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.inputValue).toBe('');
  });

  it('starts with isTyping as false', () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.isTyping).toBe(false);
  });

  it('updates input value via setInputValue', () => {
    const { result } = renderHook(() => useChat());
    act(() => {
      result.current.setInputValue('test input');
    });
    expect(result.current.inputValue).toBe('test input');
  });

  it('does not send when input is empty', async () => {
    const { result } = renderHook(() => useChat());
    await act(async () => {
      await result.current.handleSend();
    });
    expect(result.current.messages).toHaveLength(1);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('does not send when input is only whitespace', async () => {
    const { result } = renderHook(() => useChat());
    act(() => {
      result.current.setInputValue('   ');
    });
    await act(async () => {
      await result.current.handleSend();
    });
    expect(result.current.messages).toHaveLength(1);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('adds user message and fetches API on send', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'Great question about carbon!' }),
    });

    const { result } = renderHook(() => useChat());
    act(() => {
      result.current.setInputValue('How much CO2 does a car emit?');
    });

    await act(async () => {
      await result.current.handleSend();
    });

    // Should have welcome + user + bot messages
    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages[1].type).toBe('user');
    expect(result.current.messages[1].text).toContain('CO2');
    expect(result.current.messages[2].type).toBe('bot');
    expect(result.current.messages[2].text).toContain('carbon');
  });

  it('clears input after sending', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'Sure!' }),
    });

    const { result } = renderHook(() => useChat());
    act(() => {
      result.current.setInputValue('test');
    });

    await act(async () => {
      await result.current.handleSend();
    });

    expect(result.current.inputValue).toBe('');
  });

  it('handles fetch error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useChat());
    act(() => {
      result.current.setInputValue('test');
    });

    await act(async () => {
      await result.current.handleSend();
    });

    // Should have welcome + user + error bot messages
    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages[2].isError).toBe(true);
  });

  it('handles non-ok response gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useChat());
    act(() => {
      result.current.setInputValue('test');
    });

    await act(async () => {
      await result.current.handleSend();
    });

    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages[2].isError).toBe(true);
  });

  it('provides a messagesEndRef', () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.messagesEndRef).toBeDefined();
  });

  it('provides a handleSend function', () => {
    const { result } = renderHook(() => useChat());
    expect(typeof result.current.handleSend).toBe('function');
  });
});
