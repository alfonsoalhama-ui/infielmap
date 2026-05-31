import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, SafeAreaView, Alert, ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '@/types';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { api } from '@/services/api';
import { useAuthStore } from '@/services/store';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'VerifyPhone'>;
  route: RouteProp<AuthStackParamList, 'VerifyPhone'>;
};

export function VerifyPhoneScreen({ navigation, route }: Props) {
  const { phone } = route.params;
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);
  const { checkAuth } = useAuthStore();

  function handleInput(value: string, index: number) {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Avanza al siguiente input automáticamente
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Auto-enviar cuando los 6 dígitos estén completos
    if (index === 5 && value) {
      const fullCode = [...newCode].join('');
      if (fullCode.length === 6) {
        verify(fullCode);
      }
    }
  }

  async function verify(fullCode?: string) {
    const codeStr = fullCode ?? code.join('');
    if (codeStr.length !== 6) {
      Alert.alert('Código incompleto', 'Introduce los 6 dígitos del SMS.');
      return;
    }
    setIsLoading(true);
    try {
      await api.verifyPhone({ phone, code: codeStr });
      await checkAuth();
    } catch {
      Alert.alert('Código incorrecto', 'Verifica el código e inténtalo de nuevo.');
      setCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  }

  async function resendCode() {
    try {
      await api.sendVerificationCode(phone);
      Alert.alert('SMS enviado', 'Te hemos enviado un nuevo código.');
    } catch {
      Alert.alert('Error', 'No se pudo reenviar el código. Inténtalo en un momento.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Verificación</Text>
      <Text style={styles.subtitle}>
        Hemos enviado un código de 6 dígitos a{'\n'}
        <Text style={styles.phone}>{phone}</Text>
      </Text>

      <View style={styles.codeRow}>
        {code.map((digit, i) => (
          <TextInput
            key={i}
            ref={ref => { inputs.current[i] = ref; }}
            style={[styles.codeInput, digit && styles.codeInputFilled]}
            value={digit}
            onChangeText={v => handleInput(v.replace(/[^0-9]/g, '').slice(-1), i)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.btnPrimary, isLoading && styles.btnDisabled]}
        onPress={() => verify()}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnPrimaryText}>Verificar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={resendCode} style={styles.resendBtn}>
        <Text style={styles.resendText}>
          ¿No recibiste el SMS? <Text style={styles.resendLink}>Reenviar</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 28, justifyContent: 'center' },
  title: { fontSize: typography.xxxl, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: typography.md, color: colors.textSecondary, textAlign: 'center', marginBottom: 40, lineHeight: 22 },
  phone: { color: colors.textPrimary, fontWeight: typography.semibold },
  codeRow: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginBottom: 40 },
  codeInput: {
    width: 48, height: 58, borderRadius: 12, borderWidth: 1.5,
    borderColor: colors.border, backgroundColor: colors.surface,
    textAlign: 'center', fontSize: typography.xxl, fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  codeInputFilled: { borderColor: colors.primary },
  btnPrimary: {
    backgroundColor: colors.primary, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginBottom: 20,
  },
  btnDisabled: { opacity: 0.6 },
  btnPrimaryText: { color: '#fff', fontSize: typography.lg, fontWeight: typography.semibold },
  resendBtn: { alignItems: 'center' },
  resendText: { color: colors.textSecondary, fontSize: typography.sm },
  resendLink: { color: colors.primary, fontWeight: typography.semibold },
});
