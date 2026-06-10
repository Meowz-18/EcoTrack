/**
 * @file Custom hook for managing the AI assistant chat state and API calls.
 * Encapsulates all chat logic including message management, API communication,
 * and error handling into a reusable, testable hook.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { API_ENDPOINTS, MAX_QUERY_LENGTH } from '../constants';
import { sanitizeInput, getTimestamp } from '../utils/helpers';

/**
 * Custom hook for the EcoTrack AI Assistant chat functionality.
 * @returns {Object} Chat state and handler functions.
 */
export const useChat = (carbonData = null) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I\'m your EcoTrack Carbon Assistant. I can help you understand your carbon footprint, suggest reduction strategies, and provide insights on sustainable living. What would you like to know?',
      timestamp: getTimestamp(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  /** Scroll to the bottom of the chat window. */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  /** Cleanup any in-flight requests on unmount. */
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  /**
   * Sends the current input to the AI backend and appends the response.
   * Implements input sanitization, abort control, and error handling.
   */
  const handleSend = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || trimmed.length > MAX_QUERY_LENGTH) return;

    const sanitized = sanitizeInput(trimmed);

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: sanitized,
      timestamp: getTimestamp(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(API_ENDPOINTS.ASSISTANT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: sanitized,
          carbon_data: carbonData && carbonData.total > 0 ? {
            transport: carbonData.transport,
            energy: carbonData.energy,
            food: carbonData.food,
            shopping: carbonData.shopping,
            total: carbonData.total
          } : null
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          text: sanitizeInput(data.response || 'I\'m processing that information for you.'),
          timestamp: getTimestamp(),
        },
      ]);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          text: "I'm having a bit of trouble connecting to my knowledge base. Please check your connection and try asking again.",
          timestamp: getTimestamp(),
          isError: true,
        },
      ]);
    }
  }, [inputValue, carbonData]);

  return {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    messagesEndRef,
    handleSend,
  };
};
