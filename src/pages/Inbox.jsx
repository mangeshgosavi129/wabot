import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';
import LeadsList from '../components/chat/LeadsList';
import ChatViewer from '../components/chat/ChatViewer';
import ContextPanel from '../components/chat/ContextPanel';
import { api } from '../lib/apis';
import { wsClient } from '../lib/websocket';
import { WSEvents } from '../lib/types';

const Inbox = () => {
    const { initialDataLoaded, conversations } = useApp();
    const [leads, setLeads] = useState([]);
    const [loadingLeads, setLoadingLeads] = useState(true);

    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    // Refs to avoid re-mounting WebSocket handlers
    const selectedConversationRef = useRef(null);
    const fetchMessagesRef = useRef(null);


    // Fetch leads on component mount
    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const leadsData = await api.getLeads();
                setLeads(leadsData || []);
            } catch (error) {
                console.error('Failed to fetch leads:', error);
            } finally {
                setLoadingLeads(false);
            }
        };
        fetchLeads();
    }, []);

    const selectedConversation = (conversations || []).find(
        c => c.lead_id === selectedLeadId
    );

    const selectedLead = (leads || []).find(
        l => l.id === selectedLeadId
    );


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

    // Update refs when values change (moved after function declarations)
    selectedConversationRef.current = selectedConversation;
    fetchMessagesRef.current = fetchMessages;

    // Fetch messages when conversation changes
    useEffect(() => {
        if (selectedConversation) {
            fetchMessages();
        } else {
            setMessages([]);
        }
    }, [selectedConversation, fetchMessages]);

    // WebSocket event handling for conversation updates
    useEffect(() => {
        if (!initialDataLoaded) return;

        const handleConversationUpdated = (payload) => {
            console.log('📨 Inbox received conversation update:', payload);

            // Update the conversation in the list
            if (payload.conversation) {


                // If this is the currently selected conversation, update messages
                const currentSelectedConversation = selectedConversationRef.current;
                const currentFetchMessages = fetchMessagesRef.current;

                if (currentSelectedConversation && payload.conversation.id === currentSelectedConversation.id) {
                    currentFetchMessages();
                }
            }
        };

        console.log('🔧 Inbox registering WebSocket handlers');
        wsClient.on(WSEvents.CONVERSATION_UPDATED, handleConversationUpdated);

        return () => {
            console.log('🔧 Inbox unregistering WebSocket handlers');
            wsClient.off(WSEvents.CONVERSATION_UPDATED, handleConversationUpdated);
        };
    }, [initialDataLoaded]);

    // 1️⃣ Initial app data still loading
    if (!initialDataLoaded) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // 2️⃣ Conversations and leads are loading
    if (loadingLeads) {
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
                leads={leads}
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
                        Select a conversation to start chatting
                    </div>
                )}
            </div>

            <ContextPanel lead={selectedLead} />
        </div>
    );
};

export default Inbox;