import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
};

const { width } = Dimensions.get('window');

export function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🔒</Text>
        </View>
        <Text style={styles.appName}>PrivateSnap</Text>
        <Text style={styles.tagline}>Share. Enjoy. Disappear.</Text>
      </View>

      {/* Features */}
      <View style={styles.features}>
        <FeatureRow icon="🛡️" text="Content that never gets downloaded" />
        <FeatureRow icon="⏱️" text="Auto-destructs when you decide" />
        <FeatureRow icon="👁️" text="Alert if someone tries to capture it" />
        <FeatureRow icon="🔐" text="End-to-end encrypted" />
      </View>

      {/* Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryText}>Create account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnSecondaryText}>I already have an account</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.legal}>
        By continuing you accept the Terms of Use and confirm you are 18 or older.
      </Text>

    </SafeAreaView>
  );
}

function FeatureRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    paddingTop: 24,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginBottom: 20,
  },
  logoEmoji: { fontSize: 44 },
  appName: {
    fontSize: typography.xxxl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: typography.md,
    color: colors.textSecondary,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  features: { gap: 18 },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  featureIcon: { fontSize: 22, width: 32, textAlign: 'center' },
  featureText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    flex: 1,
  },
  actions: { gap: 12 },
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: colors.textOnPrimary,
    fontSize: typography.lg,
    fontWeight: typography.semibold,
  },
  btnSecondary: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnSecondaryText: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: typography.medium,
  },
  legal: {
    fontSize: typography.xs,
    color: colors.textMuted,
    textAlign: 'center',
    paddingBottom: 8,
    lineHeight: 16,
  },
});
