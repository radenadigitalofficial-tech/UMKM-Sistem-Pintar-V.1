
import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketService, WSStatus } from '../lib/websocket';

export function useWebSocket(url: string, options: any = {}) {
  const [status, setStatus] = useState<WSStatus>(WSStatus.CLOSED);
  const wsService = useRef<WebSocketService | null>(null);

  useEffect(() => {
    wsService.current = new WebSocketService(url, {
      ...options,
      onOpen: (e: Event) => {
        setStatus(WSStatus.OPEN);
        if (options.onOpen) options.onOpen(e);
      },
      onClose: (e: CloseEvent) => {
        setStatus(WSStatus.CLOSED);
        if (options.onClose) options.onClose(e);
      },
      onError: (e: Event) => {
        if (options.onError) options.onError(e);
      }
    });

    wsService.current.connect();

    return () => {
      wsService.current?.close();
    };
  }, [url]);

  const sendMessage = useCallback((data: any) => {
    return wsService.current?.send(data);
  }, []);

  return {
    status,
    sendMessage,
    isConnected: status === WSStatus.OPEN
  };
}
