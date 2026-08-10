import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';

const MIN_TOUCH = 48;

type Props = {
  style?: ViewStyle;
  showLabel?: boolean;
  /** Use on colored headers where default toggle colors would clash */
  variant?: 'default' | 'onAccent';
};

/**
 * Reusable high-contrast switch for any screen/form.
 * Preference is shared app-wide via ThemeProvider.
 */
const HighContrastToggle = ({
  style,
  showLabel = true,
  variant = 'default',
}: Props) => {
  const { highContrast, theme, toggleHighContrast } = useAppTheme();

  const isOnAccent = variant === 'onAccent';
  const backgroundColor = isOnAccent
    ? theme.accentOn
    : highContrast
      ? theme.toggleOn
      : theme.toggleBg;
  const contentColor = isOnAccent
    ? theme.accent
    : highContrast
      ? theme.accentOn
      : theme.text;
  const borderColor = isOnAccent ? theme.accentOn : theme.border;

  return (
    <Pressable
      onPress={toggleHighContrast}
      accessibilityRole="switch"
      accessibilityState={{ checked: highContrast }}
      accessibilityLabel="High contrast theme"
      accessibilityHint="Toggles a high contrast color theme for better visibility"
      hitSlop={8}
      style={({ pressed }) => [
        styles.toggle,
        {
          backgroundColor,
          borderColor,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Avatar.Icon
        icon={highContrast ? 'contrast-circle' : 'contrast'}
        size={24}
        color={contentColor}
        style={styles.icon}
        accessible={false}
      />
      {showLabel && (
        <Text
          style={[styles.label, { color: contentColor }]}
          maxFontSizeMultiplier={1.8}
          allowFontScaling
        >
          {highContrast ? 'HC On' : 'HC Off'}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  toggle: {
    minHeight: MIN_TOUCH,
    minWidth: MIN_TOUCH,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  icon: {
    backgroundColor: 'transparent',
    margin: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Roboto',
  },
});

export default HighContrastToggle;
