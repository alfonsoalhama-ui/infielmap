// Paleta de colores de PrivateSnap
// Estética oscura y premium, transmite privacidad y seguridad

export const colors = {
  // Fondos
  background: '#0a0a0f',        // Negro casi puro
  surface: '#13131a',           // Superficie de tarjetas
  surfaceElevated: '#1c1c27',   // Superficie elevada

  // Marca principal
  primary: '#6C63FF',           // Violeta principal
  primaryDark: '#4a43cc',       // Violeta oscuro (pressed)
  primaryLight: '#9d97ff',      // Violeta claro

  // Acento / seguridad
  secure: '#00d4aa',            // Verde azulado = "seguro"
  secureLight: '#00ffcc',
  warning: '#FF9500',
  danger: '#FF3B30',
  success: '#34C759',

  // Texto
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8EA0',
  textMuted: '#4a4a5a',
  textOnPrimary: '#FFFFFF',

  // Bordes y separadores
  border: '#2a2a3a',
  borderLight: '#1e1e2e',

  // Overlays
  overlay: 'rgba(0,0,0,0.7)',
  overlayLight: 'rgba(0,0,0,0.4)',

  // Gradientes (usados como array en LinearGradient)
  gradientPrimary: ['#6C63FF', '#4a43cc'],
  gradientDark: ['#13131a', '#0a0a0f'],
  gradientSecure: ['#00d4aa', '#00a8d4'],
};

export type Colors = typeof colors;
