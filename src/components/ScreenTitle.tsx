import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IconGoBack from './IconGoBack';
import HighContrastToggle from './HighContrastToggle';
import { useAppTheme } from '../context/ThemeContext';

type Props = {
  navigation: any;
  clientName: string;
  showContrastToggle?: boolean;
};

const ScreenTitle = ({ navigation, clientName, showContrastToggle = true }: Props) => {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.accent,
          borderBottomColor: theme.border,
        },
      ]}
      accessibilityRole="header"
    >
      <View style={styles.side}>
        <IconGoBack
          navigation={navigation}
          color={theme.accentOn}
          backgroundColor={theme.accent}
        />
      </View>

      <Text
        style={[styles.title, { color: theme.accentOn }]}
        numberOfLines={2}
        maxFontSizeMultiplier={2}
        allowFontScaling
        accessibilityRole="header"
      >
        {clientName}
      </Text>

      <View style={[styles.side, styles.sideRight]}>
        {showContrastToggle ? (
          <HighContrastToggle showLabel={false} variant="onAccent" />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    minHeight: 56,
  },
  side: {
    minWidth: 56,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Roboto',
    paddingHorizontal: 6,
  },
});

export default ScreenTitle;
