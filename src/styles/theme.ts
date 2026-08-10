import { colors } from './colors';

export type ThemePalette = {
  background: string;
  card: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentOn: string;
  errorBg: string;
  errorText: string;
  errorBorder: string;
  buttonBorder: string;
  buttonBg: string;
  buttonText: string;
  avatarBg: string;
  toggleBg: string;
  toggleOn: string;
  inputBg: string;
  inputText: string;
};

export const defaultTheme: ThemePalette = {
  background: '#F4F7FB',
  card: colors.white,
  border: '#C5D0DE',
  text: colors.black,
  textMuted: '#333333',
  accent: colors.aquaDark,
  accentOn: colors.white,
  errorBg: '#FFF1F0',
  errorText: '#8B0000',
  errorBorder: '#D32F2F',
  buttonBorder: colors.black,
  buttonBg: colors.white,
  buttonText: colors.aquaDark,
  avatarBg: colors.aquaGreen,
  toggleBg: '#D9E2EC',
  toggleOn: colors.aquaDark,
  inputBg: colors.white,
  inputText: colors.black,
};

export const highContrastTheme: ThemePalette = {
  background: '#000000',
  card: '#111111',
  border: '#FFFFFF',
  text: '#FFFFFF',
  textMuted: '#F5F5F5',
  accent: '#FFD400',
  accentOn: '#000000',
  errorBg: '#2A0000',
  errorText: '#FFB4B4',
  errorBorder: '#FF6666',
  buttonBorder: '#FFFFFF',
  buttonBg: '#000000',
  buttonText: '#FFD400',
  avatarBg: '#FFD400',
  toggleBg: '#333333',
  toggleOn: '#FFD400',
  inputBg: '#000000',
  inputText: '#FFFFFF',
};
