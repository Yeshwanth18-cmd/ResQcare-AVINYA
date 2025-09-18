import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { IconPaperAirplane } from '../components/Icons';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const savedHistory = localStorage.getItem('chatHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          return parsedHistory;
        }
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage:", error);
    }
    return [{ sender: 'bot', text: "Hello! I'm ResQcare. You can ask me general health questions. Please note I am not a doctor and cannot provide a diagnosis." }];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    try {
        // Filter out any potential error messages before saving
        const historyToSave = messages.filter(msg => !(msg as any).isError);
        localStorage.setItem('chatHistory', JSON.stringify(historyToSave));
    } catch (error) {
        console.error("Failed to save chat history to localStorage:", error);
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Pass the history *before* the new user message
      const botResponse = await getChatResponse(messages, input);
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    } catch (error) {
        console.error("Failed to get chat response:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred. Please try again.";
        setMessages(prev => [...prev, { sender: 'bot', text: errorMessage, isError: true } as ChatMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)] bg-white shadow-2xl rounded-2xl">
      <div className="p-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-center">AI Health Assistant</h1>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg, index) => {
            const isError = (msg as any).isError;
            return (
                <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && <div className={`w-8 h-8 rounded-full ${isError ? 'bg-red-500' : 'bg-blue-500'} flex-shrink-0`}></div>}
                <div className={`max-w-md p-4 rounded-2xl ${
                    msg.sender === 'user' 
                    ? 'bg-indigo-500 text-white rounded-br-none' 
                    : isError
                    ? 'bg-red-100 text-red-800 rounded-bl-none'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
                }`}>
                    <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                </div>
                </div>
            );
          })}
          {isLoading && (
            <div className="flex items-end gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0"></div>
              <div className="max-w-md p-4 rounded-2xl bg-slate-100">
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 w-full px-4 py-3 bg-slate-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || input.trim() === ''}
            className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 disabled:bg-slate-400 transition-all"
          >
            <IconPaperAirplane className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;