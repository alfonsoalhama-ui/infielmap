import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { useAuthStore } from '@/services/store';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export function RegisterScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { registerUser } = useAuthStore();

  const isValid =
    username.trim().length >= 3 &&
    password.length >= 6 &&
    password === password2;

  async function handleRegister() {
    if (!isValid) return;
    try {
      setIsLoading(true);
      await registerUser(username.trim().toLowerCase(), password);
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 409) {
        Alert.alert('Username taken', `@${username} is already in use. Please choose a different username.`);
      } else if (status === 400) {
        Alert.alert('Invalid data', 'Username must be at least 3 characters and password at least 6.');
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
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>No email. No phone number. Just you.</Text>

          {/* Username */}
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. dark_wolf_77"
            placeholderTextColor={colors.textMuted}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.hint}>At least 3 characters. Letters, numbers and _ only.</Text>

          {/* Password */}
          <Text style={[styles.label, { marginTop: 24 }]}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              placeholder="At least 6 characters"
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

          {/* Repeat Password */}
          <Text style={[styles.label, { marginTop: 24 }]}>Repeat password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Repeat your password"
              placeholderTextColor={colors.textMuted}
              value={password2}
              onChangeText={setPassword2}
              secureTextEntry={!showPassword2}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword2(v => !v)}
            >
              <Text style={styles.eyeIcon}>{showPassword2 ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          {password.length > 0 && password2.length > 0 && password !== password2 && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}

          {/* Anon warning */}
          <View style={styles.anonBox}>
            <Text style={styles.anonIcon}>🛡️</Text>
            <Text style={styles.anonText}>
              We don't store your email or phone number. If you lose your password,{' '}
              <Text style={{ color: colors.warning }}>we cannot recover it.</Text>
              {' '}Keep it safe.
            </Text>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={[styles.btn, !isValid && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={!isValid || isLoading}
            activeOpacity={0.85}
          >
            {isLoading
              ? <ActivityIndicator color={colors.textOnPrimary} />
              : <Text style={styles.btnText}>Create account</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Already have an account? Sign in</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 28, paddingBottom: 40 },
  back: { marginTop: 8, marginBottom: 8 },
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
  hint: { fontSize: typography.xs, color: colors.textMuted, marginTop: 4 },
  errorText: { fontSize: typography.xs, color: colors.danger, marginTop: 4 },
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
  anonBox: {
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
  anonIcon: { fontSize: 20 },
  anonText: {
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
