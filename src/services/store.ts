import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Conversation, Message, AuthState } from '@/types';
import { api } from './api';
import * as SecureStore from 'expo-secure-store';

// ─── Auth Store ────────────────────────────────────────────────────────────

interface AuthStore extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  registerUser: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const userJson = await SecureStore.getItemAsync('auth_user');
      if (token && userJson) {
        const user = JSON.parse(userJson);
        set({ token, user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  registerUser: async (username, password) => {
    const data = await api.register(username, password);
    const user: User = {
      id: data.user.id,
      username: data.user.username,
      displayName: data.user.username,
      isOnline: true,
      isVerified: false,
    };
    await SecureStore.setItemAsync('auth_token', data.token);
    await SecureStore.setItemAsync('auth_user', JSON.stringify(user));
    set({ user, token: data.token, isAuthenticated: true, isLoading: false });
  },

  login: async (username, password) => {
    const data = await api.login(username, password);
    const user: User = {
      id: data.user.id,
      username: data.user.username,
      displayName: data.user.username,
      isOnline: true,
      isVerified: false,
    };
    await SecureStore.setItemAsync('auth_token', data.token);
    await SecureStore.setItemAsync('auth_user', JSON.stringify(user));
    set({ user, token: data.token, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('auth_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),
}));

// ─── Conversations Store ───────────────────────────────────────────────────

interface ConversationsStore {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  isLoading: boolean;
  ephemeralMode: boolean; // Si true, no se guarda nada al cerrar
  fetchConversations: () => Promise<void>;
  addContact: (username: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  setConversations: (conversations: Conversation[]) => void;
  setEphemeralMode: (enabled: boolean) => void;
  clearAll: () => void;
}

export const useConversationsStore = create<ConversationsStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      isLoading: false,
      ephemeralMode: false,

      fetchConversations: async () => {
        set({ isLoading: true });
        try {
          const data = await api.getConversations();
          const conversations: Conversation[] = data.conversations.map((c: any) => ({
            id: c.id,
            participants: [{
              id: c.other_id,
              username: c.other_username,
              displayName: c.other_username,
              isOnline: false,
              isVerified: false,
            }],
            lastMessage: c.last_content ? {
              id: '',
              senderId: '',
              receiverId: '',
              type: c.last_type,
              content: c.last_content,
              viewsAllowed: -1,
              viewCount: 0,
              captureAttempted: false,
              sentAt: new Date(c.last_at),
              status: 'sent',
            } : undefined,
            unreadCount: 0,
            updatedAt: new Date(c.last_at || c.created_at),
          }));
          set({ conversations, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      addContact: (username: string) => {
        const existing = get().conversations.find(
          c => c.participants[0]?.username === username
        );
        if (existing) return;

        const newUser: User = {
          id: Math.random().toString(36).slice(2),
          username,
          displayName: username,
          isOnline: false,
          isVerified: false,
        };
        const newConv: Conversation = {
          id: Math.random().toString(36).slice(2),
          participants: [newUser],
          unreadCount: 0,
          updatedAt: new Date(),
        };
        set({ conversations: [newConv, ...get().conversations] });
      },

      addMessage: (conversationId, message) => {
        const prevMsgs = get().messages[conversationId] ?? [];
        if (prevMsgs.some(m => m.id === message.id)) return;
        set({
          messages: { ...get().messages, [conversationId]: [...prevMsgs, message] },
          conversations: get().conversations.map((c) =>
            c.id === conversationId
              ? { ...c, lastMessage: message, updatedAt: new Date() }
              : c
          ),
        });
      },

      setConversations: (conversations) => set({ conversations }),

      setEphemeralMode: (enabled) => set({ ephemeralMode: enabled }),

      clearAll: () => set({ conversations: [], messages: {} }),
    }),
    {
      name: 'privatesnap-conversations',
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistir conversaciones y mensajes, no el estado de carga
      partialize: (state) => ({
        conversations: state.ephemeralMode ? [] : state.conversations,
        messages: state.ephemeralMode ? {} : state.messages,
        ephemeralMode: state.ephemeralMode,
      }),
    }
  )
);
