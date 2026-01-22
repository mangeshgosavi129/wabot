import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import LeadsList from '../components/chat/LeadsList';
import ChatViewer from '../components/chat/ChatViewer';
import ContextPanel from '../components/chat/ContextPanel';
import { api } from '../lib/apis';

const Inbox = () => {
    const { initialDataLoaded } = useApp();
    const [conversations, setConversations] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(true);

    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    // Fetch conversations on component mount
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const conversationsData = await api.getConversations();
                setConversations(conversationsData || []);
            } catch (error) {
                console.error('Failed to fetch conversations:', error);
            } finally {
                setLoadingConversations(false);
            }
        };
        fetchConversations();
    }, []);

    const selectedConversation = (conversations || []).find(
        c => c.lead_id === selectedLeadId
    );

    // Auto-select first conversation once conversations are available
    useEffect(() => {
        if (!selectedLeadId && conversations.length > 0) {
            setSelectedLeadId(conversations[0].lead_id);
        }
    }, [conversations, selectedLeadId]);

    const fetchMessages = useCallback(async () => {
        if (!selectedConversation) return;

        setIsLoadingMessages(true);
        try {
            const msgs = await api.getConversationMessages(selectedConversation.id);
            setMessages(msgs || []);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setIsLoadingMessages(false);
        }
    }, [selectedConversation]);

    // Fetch messages when conversation changes
    useEffect(() => {
        if (selectedConversation) {
            fetchMessages();
        } else {
            setMessages([]);
        }
    }, [selectedConversation, fetchMessages]);

    // 1️⃣ Initial app data still loading
    if (!initialDataLoaded) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // 2️⃣ Conversations are loading
    if (loadingConversations) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // 2️⃣ No conversations exist
    if (conversations.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                No conversations yet. Waiting for the first message.
            </div>
        );
    }

    const handleSendMessage = async (text) => {
        if (!selectedConversation) return;

        try {
            const newMsg = await api.sendMessage({
                conversation_id: selectedConversation.id,
                content: text,
            });
            setMessages(prev => [...prev, newMsg]);
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Failed to send message');
        }
    };

    return (
        <div className="flex h-full border-t border-gray-200 dark:border-gray-700">
            <LeadsList
                conversations={conversations}
                selectedId={selectedLeadId}
                onSelect={setSelectedLeadId}
            />

            <div className="flex-1 flex min-w-0 bg-white dark:bg-gray-900 transition-colors">
                {selectedConversation ? (
                    <ChatViewer
                        conversation={{
                            ...selectedConversation,
                            messages: messages,
                        }}
                        isLoading={isLoadingMessages}
                        onSendMessage={handleSendMessage}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
                        No conversation for this lead yet
                    </div>
                )}
            </div>

            <ContextPanel lead={null} />
        </div>
    );
};

export default Inbox;