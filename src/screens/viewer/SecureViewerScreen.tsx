import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '@/types';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { useScreenCapture } from '@/hooks/useScreenCapture';

type Props = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'SecureViewer'>;
  route: RouteProp<MainStackParamList, 'SecureViewer'>;
};

type ViewerState = 'loading' | 'ready' | 'blocked';

export function SecureViewerScreen({ navigation, route }: Props) {
  const { messageId, senderId } = route.params;
  const [state, setState] = useState<ViewerState>('loading');
  const [captureWarning, setCaptureWarning] = useState(false);

  // Protección contra capturas de pantalla
  useScreenCapture({
    messageId,
    senderId,
    enabled: state === 'ready',
    onCaptureDetected: () => {
      Vibration.vibrate(200);
      setCaptureWarning(true);
      setState('blocked');
    },
  });

  // Simula carga del contenido (sin backend por ahora)
  useEffect(() => {
    const timer = setTimeout(() => setState('ready'), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => navigation.goBack(), [navigation]);

  if (state === 'loading') {
    return (
      <View style={styles.center}>
        <Text style={styles.centerEmoji}>🔒</Text>
        <Text style={styles.centerText}>Preparing secure content...</Text>
      </View>
    );
  }

  if (state === 'blocked') {
    return (
      <View style={styles.center}>
        <Text style={styles.centerEmoji}>⚠️</Text>
        <Text style={styles.warningTitle}>Capture attempt detected</Text>
        <Text style={styles.warningText}>
          The sender has been notified of this attempt.
        </Text>
        <View style={styles.warningBadge}>
          <Text style={styles.warningBadgeText}>🔔 Notification sent to sender</Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
          <Text style={styles.closeBtnText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Estado ready — mostrar contenido
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleClose} style={styles.topBtn}>
          <Text style={styles.topBtnText}>✕ Close</Text>
        </TouchableOpacity>
        <View style={styles.secureIndicator}>
          <Text style={styles.secureIcon}>🛡️</Text>
          <Text style={styles.secureText}>Secured</Text>
        </View>
        <View style={styles.topBtn} />
      </View>

      {/* Media area */}
      <View style={styles.mediaArea}>
        <Text style={styles.mediaEmoji}>🎥</Text>
        <Text style={styles.mediaTitle}>Private video</Text>
        <Text style={styles.mediaSubtitle}>
          Content streams securely.{'\n'}It will never be saved on your device.
        </Text>
      </View>

      {/* Protection badges */}
      <View style={styles.bottomBar}>
        <ProtectionBadge icon="🚫" label="No download" />
        <ProtectionBadge icon="⏱️" label="Auto-deletes" />
        <ProtectionBadge icon="🔒" label="Encrypted" />
      </View>

    </SafeAreaView>
  );
}

function ProtectionBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeIcon}>{icon}</Text>
      <Text style={styles.badgeLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  centerEmoji: { fontSize: 52 },
  centerText: { color: colors.textSecondary, fontSize: typography.md },
  warningTitle: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  warningText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  warningBadge: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  warningBadgeText: { color: colors.textSecondary, fontSize: typography.sm },
  closeBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  closeBtnText: {
    color: '#fff',
    fontSize: typography.md,
    fontWeight: typography.semibold,
  },
  container: { flex: 1, backgroundColor: '#000' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topBtn: { paddingHorizontal: 12, paddingVertical: 6, minWidth: 60 },
  topBtnText: { color: colors.textSecondary, fontSize: typography.sm },
  secureIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secureIcon: { fontSize: 14 },
  secureText: {
    color: colors.secure,
    fontSize: typography.sm,
    fontWeight: typography.medium,
  },
  mediaArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  mediaEmoji: { fontSize: 72 },
  mediaTitle: {
    fontSize: typography.xl,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  mediaSubtitle: {
    fontSize: typography.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  badge: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeIcon: { fontSize: 16 },
  badgeLabel: { fontSize: 10, color: colors.textMuted },
});
