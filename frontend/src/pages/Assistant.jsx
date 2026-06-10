/**
 * @file AI Assistant page component for EcoTrack.
 * Gemini-powered eco chatbot with quick questions and message history.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Leaf, Bot, User, Sparkles } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { QUICK_QUESTIONS, MAX_QUERY_LENGTH } from '../constants';
import { sanitizeInput } from '../utils/helpers';

const Assistant = React.memo(() => {
  const { messages, inputValue, setInputValue, isTyping, messagesEndRef, handleSend } = useChat();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (q) => {
    setInputValue(q);
  };

  return (
    <article className="px-6 md:px-12 lg:px-20 py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-leaf flex items-center justify-center">
              <Sparkles size={20} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">EcoTrack AI Assistant</h2>
              <p className="text-xs text-slate-400 font-medium">Powered by Google Gemini</p>
            </div>
          </div>
          <p className="text-slate-500 mb-8">Ask me anything about carbon footprints, sustainability, and green living.</p>
        </motion.div>

        {/* Chat Container */}
        <div className="premium-card overflow-hidden">
          {/* Messages Area */}
          <div
            className="h-[450px] overflow-y-auto p-6 space-y-4 no-scrollbar"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.type === 'user'
                    ? 'bg-brand-primary text-white'
                    : 'bg-emerald-100 text-brand-primary'
                }`}>
                  {msg.type === 'user' ? <User size={14} aria-hidden="true" /> : <Bot size={14} aria-hidden="true" />}
                </div>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.type === 'user'
                    ? 'bg-brand-primary text-white rounded-br-md'
                    : msg.isError
                    ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-md'
                    : 'bg-white/80 text-slate-700 border border-emerald-100 rounded-bl-md'
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-2 ${msg.type === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-brand-primary">
                  <Bot size={14} aria-hidden="true" />
                </div>
                <div className="bg-white/80 border border-emerald-100 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1.5" aria-label="AI is typing">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-6 py-3 border-t border-emerald-100/40 bg-emerald-50/30">
            <div className="flex gap-2 overflow-x-auto no-scrollbar" role="group" aria-label="Quick questions">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-white/80 border border-emerald-200 text-xs font-medium text-slate-600 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all focus-ring"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="px-6 py-4 border-t border-emerald-100/40 bg-white/50">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  id="chat-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about carbon footprints, sustainability tips..."
                  maxLength={MAX_QUERY_LENGTH}
                  rows={1}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 bg-white/80 text-slate-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all placeholder:text-slate-400"
                  aria-label="Type your message"
                />
                <span className="absolute right-3 bottom-1 text-[10px] text-slate-300">
                  {inputValue.length}/{MAX_QUERY_LENGTH}
                </span>
              </div>
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="shrink-0 w-11 h-11 rounded-xl bg-brand-primary text-white flex items-center justify-center hover:bg-emerald-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-ring shadow-md shadow-brand-primary/20"
                aria-label="Send message"
              >
                <Send size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});

Assistant.displayName = 'Assistant';

export default Assistant;
