import { wsClient } from './websocket';
import { WSEvents, WSConversationUpdated } from './types';

export interface WebSocketHandlers {
    onConversationUpdated?: (payload: WSConversationUpdated) => void;
    onActionConversationsFlagged?: (payload: { cta_id: string; conversation_ids: string[] }) => void;
    onActionHumanAttentionRequired?: (payload: { conversation_ids: string[] }) => void;
    onAck?: (payload: { event: string }) => void;
    onError?: (payload: { message: string }) => void;
    onServerHello?: (payload: { organization_id: string; user_id: string }) => void;
}

export class WebSocketHandlerManager {
    private static instance: WebSocketHandlerManager;
    private handlers: WebSocketHandlers = {};

    private constructor() {}

    public static getInstance(): WebSocketHandlerManager {
        if (!WebSocketHandlerManager.instance) {
            WebSocketHandlerManager.instance = new WebSocketHandlerManager();
        }
        return WebSocketHandlerManager.instance;
    }

    public registerHandlers(handlers: WebSocketHandlers) {
        console.log('🔧 Registering WebSocket handlers:', Object.keys(handlers));
        this.unregisterAllHandlers();
        this.handlers = { ...handlers };

        if (handlers.onConversationUpdated) {
            console.log('📝 Registering conversation_updated handler');
            wsClient.on(WSEvents.CONVERSATION_UPDATED, handlers.onConversationUpdated);
        }
        if (handlers.onActionConversationsFlagged) {
            console.log('📝 Registering action_conversations_flagged handler');
            wsClient.on(WSEvents.ACTION_CONVERSATIONS_FLAGGED, handlers.onActionConversationsFlagged);
        }
        if (handlers.onActionHumanAttentionRequired) {
            console.log('📝 Registering action_human_attention_required handler');
            wsClient.on(WSEvents.ACTION_HUMAN_ATTENTION_REQUIRED, handlers.onActionHumanAttentionRequired);
        }
        if (handlers.onAck) {
            console.log('📝 Registering ack handler');
            wsClient.on(WSEvents.ACK, handlers.onAck);
        }
        if (handlers.onError) {
            console.log('📝 Registering error handler');
            wsClient.on(WSEvents.ERROR, handlers.onError);
        }
        if (handlers.onServerHello) {
            console.log('📝 Registering server_hello handler');
            wsClient.on(WSEvents.SERVER_HELLO, handlers.onServerHello);
        }
    }

    public unregisterAllHandlers() {
        if (this.handlers.onConversationUpdated) {
            wsClient.off(WSEvents.CONVERSATION_UPDATED, this.handlers.onConversationUpdated);
        }
        if (this.handlers.onActionConversationsFlagged) {
            wsClient.off(WSEvents.ACTION_CONVERSATIONS_FLAGGED, this.handlers.onActionConversationsFlagged);
        }
        if (this.handlers.onActionHumanAttentionRequired) {
            wsClient.off(WSEvents.ACTION_HUMAN_ATTENTION_REQUIRED, this.handlers.onActionHumanAttentionRequired);
        }
        if (this.handlers.onAck) {
            wsClient.off(WSEvents.ACK, this.handlers.onAck);
        }
        if (this.handlers.onError) {
            wsClient.off(WSEvents.ERROR, this.handlers.onError);
        }
        if (this.handlers.onServerHello) {
            wsClient.off(WSEvents.SERVER_HELLO, this.handlers.onServerHello);
        }

        this.handlers = {};
    }
}

export const wsHandlerManager = WebSocketHandlerManager.getInstance();
