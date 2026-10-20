
import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#172B4D',
    background: '#F7F9FC',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E8F0FE',
    textSecondary: '#667085',
    primary: '#2563EB',
    primaryLight: '#DBEAFE',
    border: '#E4E7EC',
    success: '#15803D',
    error: '#DC2626',
  },
  dark: {
    text: '#F2F4F7',
    background: '#101828',
    backgroundElement: '#1D2939',
    backgroundSelected: '#344054',
    textSecondary: '#B0B8C5',
    primary: '#60A5FA',
    primaryLight: '#1E3A5F',
    border: '#344054',
    success: '#4ADE80',
    error: '#F87171',
  },
} as const;

export type ThemeColor =
  keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset =
  Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
