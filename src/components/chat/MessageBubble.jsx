import React from 'react';
import { format } from 'date-fns';
import { MessageFrom } from '../../lib/types';

const MessageBubble = ({ message }) => {
    const isMe = message.message_from === MessageFrom.HUMAN || message.message_from === MessageFrom.BOT;
    const isBot = message.message_from === MessageFrom.BOT;

    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4 capitalize-none`}>
            <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${isMe
                ? 'bg-primary/10 dark:bg-primary/20 text-gray-900 dark:text-gray-100 rounded-tr-none border border-primary/10'
                : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm text-gray-900 dark:text-gray-100 rounded-tl-none'
                }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div className={`flex items-center gap-2 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-gray-400">
                        {format(new Date(message.created_at), 'h:mm a')}
                    </span>
                    {isBot && (
                        <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wider">
                            BOT
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
