import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from '@/navigation/AppNavigator';
import { socketService } from '@/services/socket';
import { useAuthStore, useConversationsStore } from '@/services/store';

function Root() {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      socketService.connect();

      // Escuchar mensajes entrantes globalmente
      // Escuchar presencia
      const unsubscribePresence = socketService.onPresence((userId, isOnline) => {
        const store = useConversationsStore.getState();
        const updatedConvs = store.conversations.map(c => {
          if (c.participants[0]?.id === userId) {
            return {
              ...c,
              participants: [{ ...c.participants[0], isOnline }],
            };
          }
          return c;
        });
        store.setConversations(updatedConvs);
      });

      const unsubscribe = socketService.onMessage((msg: any) => {
        const convId = msg.conversation_id ?? msg.conversationId;
        const senderId = msg.sender_id ?? msg.senderId;
        if (!convId) return;

        const store = useConversationsStore.getState();

        // Ignorar si ya existe ese mensaje (evita duplicados)
        const alreadyExists = (store.messages[convId] ?? []).some(m => m.id === msg.id);
        if (alreadyExists) return;

        // Si la conversación no existe en local, crearla
        const existing = store.conversations.find(c => c.id === convId);
        if (!existing) {
          const senderUsername = msg.sender_username ?? 'unknown';
          store.addContact(senderUsername);
        }

        const newMsg = {
          id: msg.id ?? Math.random().toString(36).slice(2),
          senderId,
          receiverId: user?.id ?? '',
          type: msg.type ?? 'text',
          content: msg.content,
          mediaId: msg.media_id ?? msg.mediaId,
          viewsAllowed: -1,
          viewCount: 0,
          captureAttempted: false,
          sentAt: new Date(msg.created_at ?? Date.now()),
          status: 'delivered' as const,
        };
        store.addMessage(convId, newMsg);
      });

      return () => {
        unsubscribe();
        unsubscribePresence();
      };
    } else {
      socketService.disconnect();
    }
  }, [isAuthenticated]);

  return <AppNavigator />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Root />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
