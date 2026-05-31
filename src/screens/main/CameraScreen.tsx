import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { useConversationsStore } from '@/services/store';
import { api } from '@/services/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/types';

export function CameraScreen() {
  const [username, setUsername] = useState('');
  const { addContact, conversations } = useConversationsStore();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  async function handleAddContact() {
    const clean = username.trim().toLowerCase();
    if (clean.length < 3) {
      Alert.alert('Invalid username', 'Username must be at least 3 characters.');
      return;
    }
    try {
      // Crear conversación en el servidor
      const data = await api.startConversation(clean);
      setUsername('');

      // Añadir al store local
      const convUser = {
        id: data.user.id,
        username: data.user.username,
        displayName: data.user.username,
        isOnline: false,
        isVerified: false,
      };

      // Comprobar si ya existe localmente
      const existing = useConversationsStore.getState().conversations.find(
        c => c.id === data.conversationId
      );
      if (!existing) {
        addContact(clean);
        // Actualizar el ID real del servidor
        setTimeout(() => {
          const conv = useConversationsStore.getState().conversations.find(
            c => c.participants[0]?.username === clean
          );
          if (conv) {
            navigation.navigate('Chat', {
              conversationId: data.conversationId,
              user: convUser,
            });
          }
        }, 50);
      } else {
        navigation.navigate('Chat', {
          conversationId: data.conversationId,
          user: convUser,
        });
      }
    } catch (e: any) {
      Alert.alert('User not found', `@${clean} does not exist on PrivateSnap.`);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>New conversation</Text>
          <Text style={styles.subtitle}>
            Enter the username of the person you want to connect with
          </Text>
        </View>

        {/* Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Username</Text>
          <View style={styles.inputRow}>
            <Text style={styles.atSign}>@</Text>
            <TextInput
              style={styles.input}
              placeholder="their_username"
              placeholderTextColor={colors.textMuted}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, username.trim().length < 3 && styles.btnDisabled]}
            onPress={handleAddContact}
            disabled={username.trim().length < 3}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Start chat</Text>
          </TouchableOpacity>
        </View>

        {/* Security info */}
        <View style={styles.securityBox}>
          <Text style={styles.securityTitle}>🔒 Security levels</Text>
          <View style={styles.levelRow}>
            <Text style={styles.levelIcon}>🔒</Text>
            <Text style={styles.levelText}>
              <Text style={styles.levelBold}>Standard </Text>
              — Video stored on server, auto-deletes after viewing
            </Text>
          </View>
          <View style={styles.levelRow}>
            <Text style={styles.levelIcon}>🔒🔒</Text>
            <Text style={styles.levelText}>
              <Text style={styles.levelBold}>Private </Text>
              — Video streams from sender's phone only
            </Text>
          </View>
          <View style={styles.levelRow}>
            <Text style={styles.levelIcon}>🔒🔒🔒</Text>
            <Text style={styles.levelText}>
              <Text style={styles.levelBold}>Max security </Text>
              — Sender sees receiver's front camera live
            </Text>
          </View>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, padding: 24, gap: 28 },
  header: { gap: 8, marginTop: 8 },
  title: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  inputSection: { gap: 12 },
  label: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  atSign: {
    fontSize: typography.lg,
    color: colors.primary,
    fontWeight: typography.bold,
    marginRight: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    color: colors.textPrimary,
    fontSize: typography.md,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  btnText: {
    color: colors.textOnPrimary,
    fontSize: typography.lg,
    fontWeight: typography.semibold,
  },
  securityBox: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  securityTitle: {
    fontSize: typography.md,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  levelRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  levelIcon: { fontSize: 14, marginTop: 2 },
  levelText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  levelBold: {
    color: colors.textPrimary,
    fontWeight: typography.semibold,
  },
});
