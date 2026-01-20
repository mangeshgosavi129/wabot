import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import LeadsList from '../components/chat/LeadsList';
import ChatViewer from '../components/chat/ChatViewer';
import ContextPanel from '../components/chat/ContextPanel';
import { api } from '../lib/apis';

const Inbox = () => {
    const { leads, conversations, fetchInitialData } = useApp();
    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    const selectedLead = (leads || []).find(l => l.id === selectedLeadId);
    const selectedConversation = (conversations || []).find(c => c.lead_id === selectedLeadId);

    useEffect(() => {
        if (leads?.length > 0 && !selectedLeadId) {
            setSelectedLeadId(leads[0].id);
        }
    }, [leads, selectedLeadId]);

    const fetchMessages = useCallback(async () => {
        if (!selectedConversation) return;
        setIsLoadingMessages(true);
        try {
            const msgs = await api.getConversationMessages(selectedConversation.id);
            setMessages(msgs);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setIsLoadingMessages(false);
        }
    }, [selectedConversation]);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages();
        } else {
            setMessages([]);
        }
    }, [selectedConversation, fetchMessages]);

    const handleSendMessage = async (text) => {
        if (!selectedConversation) return;
        try {
            const newMsg = await api.sendMessage({
                conversation_id: selectedConversation.id,
                content: text
            });
            setMessages(prev => [...prev, newMsg]);
        } catch (error) {
            alert('Failed to send message');
        }
    };

    const handleToggleBot = async () => {
        if (!selectedConversation) return;
        try {
            if (selectedConversation.mode === 'bot') {
                await api.takeoverConversation(selectedConversation.id);
            } else {
                await api.releaseConversation(selectedConversation.id);
            }
            await fetchInitialData(); // Refresh conversation state
        } catch (error) {
            alert('Failed to toggle bot mode');
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
                {selectedLead ? (
                    <ChatViewer
                        conversation={{
                            ...selectedConversation,
                            messages: messages,
                            botActive: selectedConversation?.mode === 'bot'
                        }}
                        isLoading={isLoadingMessages}
                        onSendMessage={handleSendMessage}
                        onToggleBot={handleToggleBot}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
                        Select a lead to start chatting
                    </div>
                )}
            </div>
            <ContextPanel lead={selectedLead} />
        </div>
    );
};

export default Inbox;
