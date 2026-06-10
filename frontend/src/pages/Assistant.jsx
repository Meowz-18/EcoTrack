/**
 * @file AI Assistant page component for EcoTrack.
 * Gemini-powered eco chatbot with quick questions and message history.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Leaf, Bot, User, Sparkles } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { QUICK_QUESTIONS, MAX_QUERY_LENGTH } from '../constants';

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
    <article className="px-6 md:px-12 lg:px-20 pt-12 pb-24 relative z-10">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center border border-white/20 shadow-md">
              <Sparkles size={18} className="text-white animate-pulse" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">AI Carbon Assistant</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Powered by Google Gemini Pro</p>
            </div>
          </div>
          <p className="text-slate-500 font-medium">Get real-time insights, answers to sustainability questions, and customized eco-living strategies.</p>
        </motion.div>

        {/* Chat Container */}
        <div className="premium-card overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />
          
          {/* Messages Area */}
          <div
            className="h-[480px] overflow-y-auto p-6 space-y-5 no-scrollbar"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex gap-3.5 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-sm border ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white border-white/10'
                    : 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20'
                }`}>
                  {msg.type === 'user' ? <User size={16} aria-hidden="true" /> : <Bot size={16} aria-hidden="true" />}
                </div>
                <div className={`max-w-[78%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-sm'
                    : msg.isError
                    ? 'bg-red-50 text-red-800 border border-red-200/50 rounded-tl-sm'
                    : 'bg-white/50 backdrop-blur-md text-slate-700 border border-white/60 rounded-tl-sm'
                }`}>
                  <p className="font-medium">{msg.text}</p>
                  <p className={`text-[9px] font-bold uppercase tracking-wider mt-2.5 ${msg.type === 'user' ? 'text-emerald-250' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex gap-3.5">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-800">
                  <Bot size={16} aria-hidden="true" />
                </div>
                <div className="bg-white/50 backdrop-blur-md border border-white/60 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm">
                  <div className="flex gap-1.5 items-center h-2" aria-label="AI is typing">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-6 py-4 border-t border-emerald-100/30 bg-emerald-500/5 backdrop-blur-md">
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar" role="group" aria-label="Quick questions">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className="shrink-0 px-4.5 py-2 rounded-full bg-white/45 backdrop-blur-md border border-white/60 text-xs font-bold text-slate-600 hover:bg-emerald-600 hover:text-white hover:border-transparent transition-all focus-ring shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="px-6 py-5 border-t border-emerald-100/30 bg-white/30 backdrop-blur-md">
            <div className="flex gap-3.5 items-center">
              <div className="flex-1 relative rounded-2xl bg-white/50 border border-emerald-100/80 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:bg-white transition-all duration-300">
                <textarea
                  id="chat-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about carbon offsets, solar energy, eco challenge tips..."
                  maxLength={MAX_QUERY_LENGTH}
                  rows={1}
                  className="w-full pl-5 pr-16 py-4 rounded-2xl bg-transparent text-slate-900 font-medium text-sm resize-none focus:outline-none placeholder:text-slate-400 no-scrollbar h-[50px] flex items-center"
                  aria-label="Type your message"
                />
                <span className="absolute right-4 bottom-4 text-[9px] font-bold text-slate-350">
                  {inputValue.length}/{MAX_QUERY_LENGTH}
                </span>
              </div>
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-ring shadow-lg shadow-emerald-600/20 hover:scale-[1.03] active:scale-[0.97]"
                aria-label="Send message"
              >
                <Send size={16} aria-hidden="true" />
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
