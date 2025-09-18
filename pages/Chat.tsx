import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse, analyzeChatMessageForSafety } from '../services/geminiService';
import { useScheduledReminders } from '../hooks/useScheduledReminders';
import type { ChatMessage } from '../types';
// FIX: Added IconShieldCheck to the import to resolve 'Cannot find name' errors.
import { IconPaperAirplane, IconCheckCircle, IconAlertTriangle, IconShieldCheck } from '../components/Icons';
import Toast from '../components/Toast';
import ChatResourceCard from '../components/ChatResourceCard';
import { useTranslation } from '../App';

const CRISIS_RESPONSE_TEXT = "It sounds like you are going through a very difficult time. Your safety is the most important thing. This is a critical situation, and I strongly urge you to seek immediate help using the Emergency button or by contacting a crisis hotline. I am an AI and not equipped to handle this, but there are people who can support you right now.";

const Chat: React.FC = () => {
  const { t } = useTranslation();

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
    return [{ sender: 'bot', text: "Hello! I'm ResQcare, your supportive AI assistant. How can I help you today? You can ask me about stress, mindfulness, or other wellness topics." }];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { addReminder } = useScheduledReminders();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    try {
        // Don't save crisis messages in history
        const historyToSave = messages.filter(msg => !msg.isCrisis && !msg.isError);
        localStorage.setItem('chatHistory', JSON.stringify(historyToSave));
    } catch (error) {
        console.error("Failed to save chat history to localStorage:", error);
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const safetyResult = await analyzeChatMessageForSafety(userInput);

      if (safetyResult.isCrisis) {
        setMessages(prev => [...prev, { sender: 'bot', text: t(CRISIS_RESPONSE_TEXT), isCrisis: true }]);
        setIsLoading(false);
        return;
      }
      
      const nonCrisisHistory = messages.filter(m => !m.isCrisis);
      const { response: firstResponse, recommendedResources: firstResources } = await getChatResponse(nonCrisisHistory, userInput);
      let functionCall = firstResponse.candidates?.[0]?.content?.parts?.[0]?.functionCall;
      
      if (functionCall?.name === 'scheduleReminder') {
        const { type, timeISO } = functionCall.args;
        addReminder(String(type), String(timeISO));
        setToastMessage(t("Reminder scheduled successfully!"));

        const functionResponse = { functionResponse: { name: "scheduleReminder", response: { success: true, type, time: timeISO } } };
        
        const { response: secondResponse } = await getChatResponse(nonCrisisHistory, '', [functionResponse]);
        const botResponseText = secondResponse.text + `\n\n---\n*${t("I'm an AI assistant, not a doctor. For professional advice, please consult a healthcare provider.")}*`;
        setMessages(prev => [...prev, { sender: 'bot', text: botResponseText }]);

      } else if (functionCall?.name === 'recommendResource') {
        const { tags } = functionCall.args;
        const functionResponse = { functionResponse: { name: "recommendResource", response: { tags } } };
        
        const { response: secondResponse, recommendedResources } = await getChatResponse(nonCrisisHistory, '', [functionResponse]);
        const botResponseText = secondResponse.text + `\n\n---\n*${t("I'm an AI assistant, not a doctor. For professional advice, please consult a healthcare provider.")}*`;
        setMessages(prev => [...prev, { sender: 'bot', text: botResponseText, resources: recommendedResources }]);

      } else {
        const botResponseText = firstResponse.text + `\n\n---\n*${t("I'm an AI assistant, not a doctor. For professional advice, please consult a healthcare provider.")}*`;
        setMessages(prev => [...prev, { sender: 'bot', text: botResponseText, resources: firstResources.length > 0 ? firstResources : undefined }]);
      }

    } catch (error) {
        console.error("Failed to get chat response:", error);
        const errorMessage = error instanceof Error ? error.message : t("An unknown error occurred. Please try again.");
        setMessages(prev => [...prev, { sender: 'bot', text: errorMessage, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)] bg-white shadow-md rounded-lg">
      <div className="p-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-center">{t('AI Health Assistant')}</h1>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg, index) => {
            return (
                <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white ${msg.isCrisis ? 'bg-red-500' : 'bg-primary'}`}>
                        {msg.isCrisis ? <IconAlertTriangle className="w-5 h-5" /> : <IconShieldCheck className="w-5 h-5" />}
                    </div>
                )}
                <div className={`max-w-md p-4 rounded-lg ${
                    msg.sender === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : msg.isError
                    ? 'bg-red-100 text-red-800 rounded-bl-none'
                    : msg.isCrisis
                    ? 'bg-red-100 text-red-900 border border-red-200 rounded-bl-none'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
                }`}>
                    <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{index === 0 ? t(msg.text) : msg.text}</p>
                    {msg.resources && msg.resources.length > 0 && (
                      <div className="mt-4 space-y-2 border-t border-slate-200 pt-3">
                          {msg.resources.map(resource => (
                              <ChatResourceCard key={resource.id} resource={resource} />
                          ))}
                      </div>
                    )}
                </div>
                </div>
            );
          })}
          {isLoading && (
            <div className="flex items-end gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
                <IconShieldCheck className="w-5 h-5 text-white"/>
              </div>
              <div className="max-w-md p-4 rounded-lg bg-slate-100">
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
            placeholder={t('Type your message...')}
            className="flex-1 w-full px-4 py-3 bg-slate-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || input.trim() === ''}
            className="bg-primary bg-primary-hover text-white rounded-full p-3 disabled:bg-slate-400 transition-all"
          >
            <IconPaperAirplane className="w-6 h-6" />
          </button>
        </div>
      </div>
       <Toast
        message={toastMessage || ''}
        show={!!toastMessage}
        onClose={() => setToastMessage(null)}
        icon={<IconCheckCircle className="w-6 h-6 text-green-500" />}
      />
    </div>
  );
};

export default Chat;