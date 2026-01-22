// WebSocket Event System Test Utility
// This file demonstrates the explicit WebSocket event flow

import { wsSender } from '../lib/websocket-sender';
import { wsHandlerManager } from '../lib/websocket-handlers';
import { WSEvents } from '../lib/types';

export const testWebSocketEvents = {
    // Test sending events from frontend to backend
    testTakeoverStarted: (conversationId: string) => {
        console.log('🔄 Testing conversation:takeover_started');
        wsSender.sendTakeoverStarted(conversationId);
    },

    testTakeoverEnded: (conversationId: string) => {
        console.log('🔄 Testing conversation:takeover_ended');
        wsSender.sendTakeoverEnded(conversationId);
    },

    testHeartbeat: () => {
        console.log('💓 Testing client:heartbeat');
        wsSender.sendHeartbeat();
    },

    // Test registering handlers for backend events
    registerTestHandlers: () => {
        console.log('📡 Registering test handlers for backend events');
        
        wsHandlerManager.registerHandlers({
            onConversationUpdated: (payload) => {
                console.log('📨 Received conversation:updated', payload);
            },
            onActionConversationsFlagged: (payload) => {
                console.log('📨 Received action:conversations_flagged', payload);
            },
            onActionHumanAttentionRequired: (payload) => {
                console.log('📨 Received action:human_attention_required', payload);
            },
            onAck: (payload) => {
                console.log('✅ Received ack for:', payload.event);
            },
            onError: (payload) => {
                console.log('❌ Received error:', payload.message);
            },
            onServerHello: (payload) => {
                console.log('👋 Received server:hello', payload);
            }
        });
    },

    // Complete flow test
    testCompleteFlow: async (conversationId: string) => {
        console.log('🧪 Starting complete WebSocket event flow test');
        
        // Register handlers first
        testWebSocketEvents.registerTestHandlers();
        
        // Wait a moment for connection to establish
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Test takeover flow
        testWebSocketEvents.testTakeoverStarted(conversationId);
        
        // Wait for backend processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test resume bot
        testWebSocketEvents.testTakeoverEnded(conversationId);
        
        console.log('🏁 WebSocket event flow test completed');
    }
};

export default testWebSocketEvents;
