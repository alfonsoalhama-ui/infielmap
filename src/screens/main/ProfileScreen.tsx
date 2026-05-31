import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { useAuthStore } from '@/services/store';
import { Shield, Bell, Camera, HelpCircle, ChevronRight, LogOut } from 'lucide-react-native';

export function ProfileScreen() {
  const { user, logout } = useAuthStore();

  function handleLogout() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: logout },
    ]);
  }

  function handleMenuItem(label: string) {
    Alert.alert(label, 'Coming soon.');
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.inner}>

        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.displayName?.charAt(0)?.toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.displayName ?? 'User'}</Text>
        <Text style={styles.username}>@{user?.username ?? ''}</Text>

        {/* Menu */}
        <View style={styles.menu}>
          <MenuItem icon={<Shield size={20} color={colors.primary} strokeWidth={1.8} />} label="Privacy & security" onPress={() => handleMenuItem('Privacy & security')} />
          <MenuItem icon={<Bell size={20} color={colors.primary} strokeWidth={1.8} />} label="Notifications" onPress={() => handleMenuItem('Notifications')} />
          <MenuItem icon={<Camera size={20} color={colors.primary} strokeWidth={1.8} />} label="Anti-camera detection" onPress={() => handleMenuItem('Anti-camera detection')} />
          <MenuItem icon={<HelpCircle size={20} color={colors.primary} strokeWidth={1.8} />} label="Help & support" onPress={() => handleMenuItem('Help & support')} />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color={colors.danger} strokeWidth={1.8} />
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuIcon}>{icon}</View>
      <Text style={styles.menuLabel}>{label}</Text>
      <ChevronRight size={18} color={colors.textMuted} strokeWidth={1.8} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, alignItems: 'center', padding: 24 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarText: { fontSize: 40, fontWeight: typography.bold, color: '#fff' },
  name: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  username: {
    fontSize: typography.md,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 32,
  },
  menu: { width: '100%', gap: 2 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 2,
  },
  menuIcon: { fontSize: 20, width: 28 },
  menuLabel: { flex: 1, fontSize: typography.md, color: colors.textPrimary },
  menuArrow: { fontSize: typography.xl, color: colors.textMuted },
  logoutBtn: {
    marginTop: 'auto',
    marginBottom: 8,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.danger,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    color: colors.danger,
    fontSize: typography.md,
    fontWeight: typography.medium,
  },
});
