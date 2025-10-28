
import React, { useState, useRef, useEffect } from 'react';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import { SendIcon } from './icons/SendIcon';
import { MessageAuthor, type ChatMessage } from '../types';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

// A simple markdown-to-html renderer
const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
    const renderText = (txt: string) => {
        return txt
            .replace(/## (.*)/g, '<h2 class="text-lg font-semibold mt-4 mb-2">$1</h2>')
            .replace(/### (.*)/g, '<h3 class="text-md font-semibold mt-3 mb-1">$1</h3>')
            .replace(/\* \s*(.*)/g, '<li class="ml-4 list-disc">$1</li>')
            .replace(/\n/g, '<br />');
    };

    return <div dangerouslySetInnerHTML={{ __html: renderText(text) }} />;
};


const ChatMessageItem: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.author === MessageAuthor.USER;
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
          <BotIcon className="w-5 h-5" />
        </div>
      )}
      <div className={`max-w-xl p-3 rounded-xl ${isUser ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
         {isUser ? <p>{message.text}</p> : <div className="prose prose-sm max-w-none"><MarkdownRenderer text={message.text} /></div>}
      </div>
       {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
          <UserIcon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 pr-2 -mr-2 overflow-y-auto">
        {messages.map((msg, index) => (
          <ChatMessageItem key={index} message={msg} />
        ))}
        {isLoading && (
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    <BotIcon className="w-5 h-5" />
                </div>
                <div className="max-w-xl p-3 rounded-xl bg-gray-100 text-gray-800">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-indigo-300 transition-colors"
            disabled={isLoading || !input.trim()}
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
