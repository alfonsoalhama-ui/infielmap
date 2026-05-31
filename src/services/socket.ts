import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';

const SERVER_URL = 'https://sunny-stillness-production-dc44.up.railway.app';

class SocketService {
  private socket: Socket | null = null;
  private messageListeners: ((msg: any) => void)[] = [];
  private presenceListeners: ((userId: string, isOnline: boolean) => void)[] = [];

  async connect() {
    if (this.socket?.connected) return;

    const token = await SecureStore.getItemAsync('auth_token');
    if (!token) return;

    this.socket = io(SERVER_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('new_message', (message: any) => {
      this.messageListeners.forEach(listener => listener(message));
    });

    this.socket.on('message_sent', (message: any) => {
      this.messageListeners.forEach(listener => listener(message));
    });

    this.socket.on('user_online', ({ userId }: { userId: string }) => {
      this.presenceListeners.forEach(l => l(userId, true));
    });

    this.socket.on('user_offline', ({ userId }: { userId: string }) => {
      this.presenceListeners.forEach(l => l(userId, false));
    });

    this.socket.on('online_users', (userIds: string[]) => {
      userIds.forEach(userId => {
        this.presenceListeners.forEach(l => l(userId, true));
      });
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  sendMessage(data: {
    conversationId: string;
    content?: string;
    type?: string;
    mediaId?: string;
    securityLevel?: number;
  }) {
    this.socket?.emit('send_message', data);
  }

  onMessage(listener: (msg: any) => void) {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener);
    };
  }

  onPresence(listener: (userId: string, isOnline: boolean) => void) {
    this.presenceListeners.push(listener);
    return () => {
      this.presenceListeners = this.presenceListeners.filter(l => l !== listener);
    };
  }

  isConnected() {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
