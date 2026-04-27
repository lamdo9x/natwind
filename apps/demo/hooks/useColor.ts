import { useColorScheme } from 'react-native';

const lightColors: Record<string, string> = {
  background: '#ffffff',
  card: '#f9fafb',
  border: '#e5e7eb',
  text: '#111827',
  textMuted: '#6b7280',
  primary: '#3b82f6',
  primaryForeground: '#ffffff',
  secondary: '#f3f4f6',
  secondaryForeground: '#111827',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  muted: '#f3f4f6',
  mutedForeground: '#9ca3af',
  red: '#ef4444',
  green: '#22c55e',
  foreground: '#111827',
  accent: '#eff6ff',
  accentForeground: '#1d4ed8',
};

const darkColors: Record<string, string> = {
  background: '#111827',
  card: '#1f2937',
  border: '#374151',
  text: '#f9fafb',
  textMuted: '#9ca3af',
  primary: '#60a5fa',
  primaryForeground: '#ffffff',
  secondary: '#374151',
  secondaryForeground: '#f9fafb',
  destructive: '#f87171',
  destructiveForeground: '#ffffff',
  muted: '#374151',
  mutedForeground: '#6b7280',
  red: '#f87171',
  green: '#4ade80',
  foreground: '#f9fafb',
  accent: '#1e3a5f',
  accentForeground: '#93c5fd',
};

export function useColor(colorKey: string): string {
  const scheme = useColorScheme();
  const palette = scheme === 'dark' ? darkColors : lightColors;
  return palette[colorKey] ?? '#000000';
}
