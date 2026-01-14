import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import LeadsList from '../components/chat/LeadsList';
import ChatViewer from '../components/chat/ChatViewer';
import ContextPanel from '../components/chat/ContextPanel';

const Inbox = () => {
    const { leads, conversations, setConversations } = useApp();
    const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id);

    const selectedLead = leads.find(l => l.id === selectedLeadId);
    const selectedConversation = conversations.find(c => c.leadId === selectedLeadId) || { messages: [], botActive: true }; // Fallback

    const handleSendMessage = (text, from) => {
        // Mock sending message
        const newMessage = {
            id: `m_${Date.now()}`,
            text,
            from,
            time: new Date().toISOString()
        };

        const updatedConversations = conversations.map(c => {
            if (c.leadId === selectedLeadId) {
                return {
                    ...c,
                    messages: [...c.messages, newMessage],
                    lastMessageAt: newMessage.time
                };
            }
            return c;
        });

        // If conversation doesn't exist, create it (simplified)
        if (!conversations.find(c => c.leadId === selectedLeadId)) {
            updatedConversations.push({
                conversationId: `conv_${Date.now()}`,
                leadId: selectedLeadId,
                messages: [newMessage],
                lastMessageAt: newMessage.time,
                botActive: false // Manual start implies bot off usually
            });
        }

        setConversations(updatedConversations);
    };

    const handleToggleBot = () => {
        const updatedConversations = conversations.map(c => {
            if (c.leadId === selectedLeadId) {
                return { ...c, botActive: !c.botActive };
            }
            return c;
        });
        setConversations(updatedConversations);
    };

    return (
        <div className="flex h-full border-t border-gray-200 dark:border-gray-700">
            <LeadsList
                leads={leads}
                selectedId={selectedLeadId}
                onSelect={setSelectedLeadId}
            />
            <div className="flex-1 flex min-w-0 bg-white dark:bg-gray-900 transition-colors">
                {selectedLead ? (
                    <ChatViewer
                        conversation={selectedConversation}
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
