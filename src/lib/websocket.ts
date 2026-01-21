import { WSEvents } from './types'; // We'll add WSEvents to types.ts later or define here if needed.

type EventHandler = (payload: any) => void;

class WebSocketClient {
    private socket: WebSocket | null = null;
    private token: string | null = null;
    private isConnected = false;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
    private handlers: Map<string, Set<EventHandler>> = new Map();
    private debug = true;

    // Singleton instance
    private static instance: WebSocketClient;

    private constructor() { }

    public static getInstance(): WebSocketClient {
        if (!WebSocketClient.instance) {
            WebSocketClient.instance = new WebSocketClient();
        }
        return WebSocketClient.instance;
    }

    public connect(token: string) {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        this.token = token;
        // Determine WS URL (ws vs wss based on window.location)
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // Assuming backend is on same host/port for dev or configured via env in prod
        // If backend is on 8000 and frontend on 5173, we need specific URL.
        // For now, hardcode or use env variable. Assuming localhost:8000 for local dev based on Python context.
        const host = 'localhost:8000'; // TODO: Make configurable
        const url = `${protocol}//${host}/ws?token=${token}`;

        this.log('Connecting to', url);
        this.socket = new WebSocket(url);

        this.socket.onopen = this.handleOpen;
        this.socket.onclose = this.handleClose;
        this.socket.onerror = this.handleError;
        this.socket.onmessage = this.handleMessage;
    }

    public disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.stopHeartbeat();
        this.isConnected = false;
    }

    public send(event: string, payload: any = {}) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ event, payload }));
        } else {
            this.log('Cannot send message, socket not open');
        }
    }

    public on(event: string, handler: EventHandler) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event)?.add(handler);
    }

    public off(event: string, handler: EventHandler) {
        if (this.handlers.has(event)) {
            this.handlers.get(event)?.delete(handler);
        }
    }

    private handleOpen = () => {
        this.log('Connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        // Notify listeners of connection (optional internal event)
        this.emit('connection:open', {});
    };

    private handleClose = (event: CloseEvent) => {
        this.log('Disconnected', event.code, event.reason);
        this.stopHeartbeat();
        this.isConnected = false;

        // Handle reconnect logic
        if (event.code !== 1000 && event.code !== 1008) { // 1000 = Normal, 1008 = Policy (Auth fail)
            this.attemptReconnect();
        }

        this.emit('connection:close', { code: event.code });
    };

    private handleError = (error: Event) => {
        this.log('Error', error);
    };

    private handleMessage = (event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);
            const { event: eventName, payload } = data;
            this.emit(eventName, payload);

            // Handle server:hello specifically if needed, 
            // though generic emit handles it for registered listeners
            if (eventName === 'server:hello') {
                this.log('Server handshake received', payload);
            }
        } catch (err) {
            this.log('Failed to parse message', event.data);
        }
    };

    private emit(event: string, payload: any) {
        if (this.handlers.has(event)) {
            this.handlers.get(event)?.forEach(handler => handler(payload));
        }
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            const timeout = Math.min(1000 * (2 ** this.reconnectAttempts), 10000); // Exp backoff
            this.reconnectAttempts++;
            this.log(`Reconnecting in ${timeout}ms... (Attempt ${this.reconnectAttempts})`);
            setTimeout(() => {
                if (this.token) {
                    this.connect(this.token);
                    // After successful reconnect, we might want to trigger "catch-up".
                    // Implementation: The 'connection:open' event listener in the app 
                    // can check if it was a reconnect and fetch data.
                }
            }, timeout);
        } else {
            this.log('Max reconnect attempts reached');
        }
    }

    private startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatInterval = setInterval(() => {
            this.send('client:heartbeat', {});
        }, 25000); // 25 seconds
    }

    private stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    private log(...args: any[]) {
        if (this.debug) {
            console.log('[WebSocket]', ...args);
        }
    }
}

export const wsClient = WebSocketClient.getInstance();
