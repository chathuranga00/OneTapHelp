export const colors = {
  primary: '#CC0000',
  primaryDark: '#990000',
  background: '#1A1A1A',
  surface: '#252525',
  surfaceElevated: '#2E2E2E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#707070',
  border: '#333333',
  error: '#FF4444',
  success: '#2E7D32',
  overlay: 'rgba(0, 0, 0, 0.75)',
} as const;

export type ColorKey = keyof typeof colors;
