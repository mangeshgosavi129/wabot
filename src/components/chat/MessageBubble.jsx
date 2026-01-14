import React from 'react';
import { clsx } from 'clsx';
import { format } from 'date-fns';

const MessageBubble = ({ message }) => {
    const isMe = message.from === 'agent' || message.from === 'bot';
    const isBot = message.from === 'bot';

    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${isMe
                    ? 'bg-primary/10 text-gray-900 rounded-tr-none'
                    : 'bg-white border border-gray-100 shadow-sm text-gray-900 rounded-tl-none'
                }`}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <div className={`flex items-center gap-2 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-gray-400">
                        {format(new Date(message.time), 'h:mm a')}
                    </span>
                    {isBot && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wider">
                            BOT
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
