import React, { useContext } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Drawer,
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';

import { AuthContext } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import HighContrastToggle from '../components/HighContrastToggle';

export function DrawerContent(props: any) {
    const { logOut, user } = useContext(AuthContext);
    const { theme } = useAppTheme();

    return (
        <View style={[styles.root, { backgroundColor: theme.background }]}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ backgroundColor: theme.background }}
            >
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={styles.userRow}>
                            <Avatar.Icon
                                {...props}
                                icon="account"
                                style={{ backgroundColor: theme.avatarBg }}
                                color={theme.accentOn}
                                size={50}
                                accessible={false}
                            />
                            <View style={styles.userTextWrap}>
                                <Title
                                    style={[styles.title, { color: theme.text }]}
                                    maxFontSizeMultiplier={2}
                                    allowFontScaling
                                >
                                    {user?.name + ' ' + user?.lastName}
                                </Title>
                                <Caption
                                    style={[styles.caption, { color: theme.textMuted }]}
                                    maxFontSizeMultiplier={2}
                                    allowFontScaling
                                >
                                    {user?.email}
                                </Caption>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <Caption
                                style={[styles.caption, { color: theme.textMuted }]}
                                maxFontSizeMultiplier={2}
                                allowFontScaling
                            >
                                Menu
                            </Caption>
                        </View>

                        <View style={styles.contrastRow}>
                            <Text
                                style={[styles.contrastLabel, { color: theme.text }]}
                                maxFontSizeMultiplier={2}
                                allowFontScaling
                            >
                                Accessibility
                            </Text>
                            <HighContrastToggle />
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({ size }) => (
                                <Avatar.Icon
                                    {...props}
                                    icon="home-account"
                                    style={{ backgroundColor: theme.avatarBg }}
                                    color={theme.accentOn}
                                    size={size}
                                    accessible={false}
                                />
                            )}
                            label="Participants"
                            onPress={() => { props.navigation.navigate('Clients'); }}
                            labelStyle={[styles.listItem, { color: theme.text }]}
                        />
                        {user?.role === 'SUPER_ADMIN' && (
                            <DrawerItem
                                icon={({ size }) => (
                                    <Avatar.Icon
                                        {...props}
                                        icon="account-multiple"
                                        style={{ backgroundColor: theme.avatarBg }}
                                        color={theme.accentOn}
                                        size={size}
                                        accessible={false}
                                    />
                                )}
                                label="Users"
                                onPress={() => { props.navigation.navigate('Staff Members'); }}
                                labelStyle={[styles.listItem, { color: theme.text }]}
                            />
                        )}
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>

            <Drawer.Section
                style={[
                    styles.bottomDrawerSection,
                    { borderTopColor: theme.border },
                ]}
            >
                <DrawerItem
                    icon={({ size }) => (
                        <Avatar.Icon
                            {...props}
                            icon="logout"
                            style={{ backgroundColor: theme.avatarBg }}
                            color={theme.accentOn}
                            size={size}
                            accessible={false}
                        />
                    )}
                    label="Sign Out"
                    onPress={logOut}
                    labelStyle={[styles.listItem, { color: theme.text }]}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
        paddingRight: 16,
    },
    userRow: {
        flexDirection: 'row',
        marginTop: 15,
        alignItems: 'center',
    },
    userTextWrap: {
        marginLeft: 15,
        flexDirection: 'column',
        flex: 1,
    },
    title: {
        fontSize: Platform.OS === 'android' ? 18 : 17,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: Platform.OS === 'android' ? 16 : 15,
    },
    listItem: {
        fontSize: Platform.OS === 'android' ? 18 : 17,
        fontWeight: '600',
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contrastRow: {
        marginTop: 16,
        marginBottom: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        minHeight: 48,
    },
    contrastLabel: {
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'Roboto',
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopWidth: 2,
    },
});
