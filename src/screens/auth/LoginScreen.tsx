import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { useAuthStore } from '@/services/store';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const isValid = username.trim().length >= 3 && password.length >= 6;

  async function handleLogin() {
    if (!isValid) return;
    try {
      setIsLoading(true);
      await login(username.trim().toLowerCase(), password);
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 401) {
        Alert.alert('Wrong credentials', 'Username or password is incorrect.');
      } else {
        Alert.alert('Connection error', 'Could not reach the server. Check your internet connection.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}
      >
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in with your username and password</Text>

        {/* Username */}
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="your_username"
          placeholderTextColor={colors.textMuted}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Password */}
        <Text style={[styles.label, { marginTop: 24 }]}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword(v => !v)}
          >
            <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>

        {/* Warning */}
        <View style={styles.warnBox}>
          <Text style={styles.warnIcon}>⚠️</Text>
          <Text style={styles.warnText}>
            We cannot recover your password. There is no recovery email.
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={[styles.btn, !isValid && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={!isValid || isLoading}
          activeOpacity={0.85}
        >
          {isLoading
            ? <ActivityIndicator color={colors.textOnPrimary} />
            : <Text style={styles.btnText}>Sign in</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? Create one</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, paddingHorizontal: 28 },
  back: { marginTop: 8, marginBottom: 24 },
  backText: { color: colors.textSecondary, fontSize: typography.md },
  title: {
    fontSize: typography.xxxl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  label: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.textPrimary,
    fontSize: typography.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passwordRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.textPrimary,
    fontSize: typography.md,
  },
  eyeBtn: { paddingHorizontal: 16 },
  eyeIcon: { fontSize: 18 },
  warnBox: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 28,
    marginBottom: 28,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  warnIcon: { fontSize: 20 },
  warnText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnDisabled: { opacity: 0.4 },
  btnText: {
    color: colors.textOnPrimary,
    fontSize: typography.lg,
    fontWeight: typography.semibold,
  },
  link: {
    color: colors.primary,
    fontSize: typography.md,
    textAlign: 'center',
  },
});
