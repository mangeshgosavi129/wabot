import { wsClient } from './websocket';
import { WSEvents } from './types';

export class WebSocketSender {
    static sendTakeoverStarted(conversationId: string) {
        wsClient.send(WSEvents.TAKEOVER_STARTED, {
            conversation_id: conversationId
        });
    }

    static sendTakeoverEnded(conversationId: string) {
        wsClient.send(WSEvents.TAKEOVER_ENDED, {
            conversation_id: conversationId
        });
    }

    static sendHeartbeat() {
        wsClient.send(WSEvents.CLIENT_HEARTBEAT, {});
    }
}

export const wsSender = WebSocketSender;
