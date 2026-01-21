import { useEffect, useState } from 'react';
import { wsClient } from '../lib/websocket';

/**
 * Hook to subscribe to a specific WebSocket event.
 * @param event The event name to subscribe to.
 * @param handler The callback function to execute when the event is received.
 */
export function useSocketEvent(event: string, handler: (payload: any) => void) {
    useEffect(() => {
        wsClient.on(event, handler);
        return () => {
            wsClient.off(event, handler);
        };
    }, [event, handler]);
}

/**
 * Hook to track the WebSocket connection status.
 * @returns boolean indicating if the socket is connected.
 */
export function useSocketConnection() {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Since we don't have a direct getter exposed yet on the instance for initial state,
        // we start false. If it's already open, the 'connection:open' won't fire again 
        // unless we ask for status or if we modify wsClient to emit state on registration 
        // or expose a getter.
        // For now, we assume this hook is mounted early or we accept initial false.
        // Ideally we'd do: useState(wsClient.isConnected) if public.

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        wsClient.on('connection:open', onConnect);
        wsClient.on('connection:close', onDisconnect);

        return () => {
            wsClient.off('connection:open', onConnect);
            wsClient.off('connection:close', onDisconnect);
        }
    }, []);

    return isConnected;
}
