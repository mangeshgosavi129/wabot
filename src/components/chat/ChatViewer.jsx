import React, { useState, useEffect, useRef } from 'react';
import { Send, FileText, Smile, Paperclip, Lock, RefreshCw, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import MessageBubble from './MessageBubble';
import { useApp } from '../../context/AppContext';

const ChatViewer = ({ conversation, onSendMessage, onToggleBot }) => {
    const messagesEndRef = useRef(null);
    const [input, setInput] = useState('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [conversation.messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(input, 'agent'); // Default to agent sending
        setInput('');
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-50/50 dark:bg-gray-900/50 transition-colors">
            {/* Header - could be improved, but Layout handles page header */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                {conversation.messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Composer Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                {/* Status Bar */}
                <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${conversation.botActive ? 'bg-cyan-500' : 'bg-gray-400'}`}></div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                            {conversation.botActive ? 'Bot Active' : 'Human Takeover Active'}
                        </span>
                    </div>

                    <Button
                        variant={conversation.botActive ? "outline" : "default"}
                        size="sm"
                        onClick={onToggleBot}
                        className={conversation.botActive ? "text-gray-600 dark:text-gray-300 dark:border-gray-600" : "bg-accent hover:bg-accent/90 text-white border-none"}
                    >
                        {conversation.botActive ? 'Takeover' : 'Resume Bot'}
                    </Button>
                </div>

                <div className="relative flex items-end gap-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <Smile className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <FileText className="w-5 h-5" />
                    </button>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        disabled={conversation.botActive}
                        placeholder={conversation.botActive ? "Bot is active. Takeover to chat." : "Type a message..."}
                        className="flex-1 max-h-32 bg-transparent border-none focus:ring-0 p-2 text-sm resize-none disabled:opacity-50 text-gray-900 dark:text-white placeholder-gray-400"
                        rows={1}
                    />

                    <Button
                        className="rounded-lg h-9 w-9 p-0"
                        onClick={handleSend}
                        disabled={!input.trim() || conversation.botActive}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>

                {conversation.botActive && (
                    <p className="text-xs text-center text-gray-400 mt-2 flex items-center justify-center gap-1">
                        <Lock className="w-3 h-3" /> Bot is handling the conversation. Toggle takeover to intervene.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ChatViewer;
