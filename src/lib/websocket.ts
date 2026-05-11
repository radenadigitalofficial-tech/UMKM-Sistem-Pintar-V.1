
/**
 * Robust WebSocket Service with lifecycle management and auto-reconnection.
 * Addresses "WebSocket closed without opened" errors by checking state before operations.
 */

export enum WSStatus {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

interface WSOptions {
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (data: any) => void;
}

export class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private options: WSOptions;
  private reconnectAttempts: number = 0;
  private reconnectTimer: any = null;
  private manualClose: boolean = false;

  constructor(url: string, options: WSOptions = {}) {
    this.url = url;
    this.options = {
      autoReconnect: true,
      reconnectInterval: 3000,
      maxReconnectAttempts: 10,
      ...options
    };
  }

  public connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log('[WS] Already connecting or open');
      return;
    }

    this.manualClose = false;
    console.log(`[WS] Connecting to ${this.url}...`);
    
    try {
      this.socket = new WebSocket(this.url);
      this.setupHandlers();
    } catch (error) {
      console.error('[WS] Failed to create WebSocket:', error);
      this.handleReconnect();
    }
  }

  private setupHandlers() {
    if (!this.socket) return;

    this.socket.onopen = (event) => {
      console.log('[WS] Connected successfully');
      this.reconnectAttempts = 0;
      if (this.options.onOpen) this.options.onOpen(event);
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (this.options.onMessage) this.options.onMessage(data);
      } catch (e) {
        if (this.options.onMessage) this.options.onMessage(event.data);
      }
    };

    this.socket.onclose = (event) => {
      console.log(`[WS] Disconnected. Code: ${event.code}, Reason: ${event.reason}`);
      if (this.options.onClose) this.options.onClose(event);
      
      if (!this.manualClose && this.options.autoReconnect) {
        this.handleReconnect();
      }
    };

    this.socket.onerror = (event) => {
      console.error('[WS] WebSocket error:', event);
      if (this.options.onError) this.options.onError(event);
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= (this.options.maxReconnectAttempts || 10)) {
      console.error('[WS] Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = (this.options.reconnectInterval || 3000) * Math.min(this.reconnectAttempts, 5);
    console.log(`[WS] Attempting reconnect ${this.reconnectAttempts} in ${delay}ms...`);
    
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  public send(data: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('[WS] Cannot send message: Connection not open. Current state:', this.socket?.readyState);
      return false;
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.socket.send(message);
      return true;
    } catch (error) {
      console.error('[WS] Send failed:', error);
      return false;
    }
  }

  public close() {
    this.manualClose = true;
    clearTimeout(this.reconnectTimer);
    
    if (this.socket) {
      // THE FIX: Only close if it's actually in a valid state to be closed
      // This prevents "WebSocket closed without opened" or "already closing" errors
      if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
        console.log('[WS] Manually closing connection');
        this.socket.close();
      }
    }
    this.socket = null;
  }

  public getStatus(): WSStatus {
    return this.socket ? this.socket.readyState : WSStatus.CLOSED;
  }
}
