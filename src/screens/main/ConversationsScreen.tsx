import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, Conversation } from '@/types';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { useConversationsStore } from '@/services/store';
import { format } from 'date-fns';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Tabs'>;
};

export function ConversationsScreen({ navigation }: Props) {
  const { conversations, isLoading, fetchConversations } = useConversationsStore();

  useEffect(() => {
    fetchConversations();
  }, []);

  function formatTime(date?: Date) {
    if (!date) return '';
    return format(new Date(date), 'HH:mm');
  }

  function renderItem({ item }: { item: Conversation }) {
    const other = item.participants[0];
    const hasUnread = item.unreadCount > 0;

    return (
      <TouchableOpacity
        style={styles.convRow}
        onPress={() => navigation.navigate('Chat', {
          conversationId: item.id,
          user: other,
        })}
        activeOpacity={0.7}
      >
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {other.displayName.charAt(0).toUpperCase()}
          </Text>
          {other.isOnline && <View style={styles.onlineDot} />}
        </View>

        {/* Info */}
        <View style={styles.convInfo}>
          <View style={styles.convHeader}>
            <Text style={styles.convName}>{other.displayName}</Text>
            <Text style={styles.convTime}>{formatTime(item.updatedAt)}</Text>
          </View>
          <View style={styles.convPreview}>
            <Text
              style={[styles.convLastMsg, hasUnread && styles.convLastMsgUnread]}
              numberOfLines={1}
            >
              {item.lastMessage?.type === 'image' ? '📷 Photo' :
               item.lastMessage?.type === 'video' ? '🎥 Video' :
               item.lastMessage?.content ?? 'No messages yet'}
            </Text>
            {hasUnread && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Search size={20} color={colors.textSecondary} strokeWidth={1.8} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 60 }} color={colors.primary} />
      ) : conversations.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>No conversations yet</Text>
          <Text style={styles.emptyText}>
            Add a contact to start sharing{'\n'}private content securely
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  searchBtn: { padding: 8 },
  searchIcon: { fontSize: 20 },
  convRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: '#fff',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: colors.secure,
    borderWidth: 2,
    borderColor: colors.background,
  },
  convInfo: { flex: 1 },
  convHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  convName: {
    fontSize: typography.md,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  convTime: { fontSize: typography.sm, color: colors.textMuted },
  convPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  convLastMsg: { fontSize: typography.sm, color: colors.textSecondary, flex: 1 },
  convLastMsgUnread: { color: colors.textPrimary, fontWeight: typography.medium },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: { color: '#fff', fontSize: 11, fontWeight: typography.bold },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 86,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyIcon: { fontSize: 52 },
  emptyTitle: {
    fontSize: typography.xl,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
