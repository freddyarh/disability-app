import React, { useCallback, useEffect, useState } from 'react';
import disabilityApi from '../api/disabilityApi';
import { StyleSheet, Text, View, RefreshControl } from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import { User } from '../interfaces/appInterfaces';
import Button from '../components/Button';
import ScreenTitle from '../components/ScreenTitle';
import { globalStyles } from '../styles/globalStyles';
import { LoadingScreen } from './LoadingScreen';
import { useAppTheme } from '../context/ThemeContext';
import Animated, { FadeIn } from 'react-native-reanimated';

export const StaffMembers = ({ navigation }: any) => {
  const { theme } = useAppTheme();
  const [staffUsers, setStaffUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    getStaffMembers();
  }, []);

  const getStaffMembers = async () => {
    const { data: users } = await disabilityApi.get<any>('/users/getAllUsers');
    setStaffUsers(users.users);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getStaffMembers();
      setRefreshing(false);
    }, 1000);
  }, []);

  const usersSuperAdmin = staffUsers.filter((user: any) => user?.role === 'SUPER_ADMIN');
  const usersStaff = staffUsers.filter((user: any) => user?.role === 'STAFF');

  if (usersSuperAdmin.length === 0) return <LoadingScreen />;

  return (
    <Animated.ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.accent}
          colors={[theme.accent]}
        />
      }
      entering={FadeIn.duration(500)}
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      accessibilityLabel="Staff members list"
    >
      <ScreenTitle navigation={navigation} clientName="Staff members" />

      <View style={[globalStyles.container, styles.body]}>
        <Button
          label="Create new staff"
          iconName="account-plus"
          onPress={() => navigation.navigate('Create Staff Members')}
          disabled={false}
        />

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text
            style={[styles.title, { color: theme.accent }]}
            maxFontSizeMultiplier={2}
            allowFontScaling
            accessibilityRole="header"
          >
            Super admin
          </Text>
          {usersSuperAdmin.map((user) => (
            <Card.Title
              key={user.uid}
              title={`${user.name} ${user.lastName}`}
              titleStyle={{ color: theme.text }}
              subtitleStyle={{ color: theme.textMuted }}
              subtitle={user.email}
              style={{ backgroundColor: theme.card }}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  color={theme.accentOn}
                  style={{ backgroundColor: theme.avatarBg }}
                  icon="account"
                  accessible={false}
                />
              )}
            />
          ))}
        </View>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text
            style={[styles.title, { color: theme.accent }]}
            maxFontSizeMultiplier={2}
            allowFontScaling
            accessibilityRole="header"
          >
            Staff
          </Text>
          {usersStaff.map((user) => (
            <Card.Title
              key={user.uid}
              title={`${user.name} ${user.lastName}`}
              titleStyle={{ color: theme.text }}
              subtitleStyle={{ color: theme.textMuted }}
              subtitle={user.email}
              style={{ backgroundColor: theme.card }}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  color={theme.accentOn}
                  style={{ backgroundColor: theme.avatarBg }}
                  icon="account"
                  accessible={false}
                />
              )}
            />
          ))}
        </View>
      </View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
    flexGrow: 1,
  },
  body: {
    marginTop: 8,
  },
  sectionCard: {
    marginTop: 16,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  title: {
    marginLeft: 14,
    marginBottom: 4,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Roboto',
  },
});

export default StaffMembers;
