import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
    AccessibilityInfo,
    Platform,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    useAnimatedStyle,
    useReducedMotion,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { Avatar, TextInput } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import disabilityApi from '../api/disabilityApi';
import { AuthContext } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import { Client, Clients as ClientsInterface } from '../interfaces/appInterfaces';
import { colors } from '../styles/colors';
import { ThemePalette } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';
import { LoadingScreen } from './LoadingScreen';
import Input from '../components/Input';

const MIN_TOUCH = 48;
const TIMING = { duration: 160 };

const normalizeClients = (clients: Client[] | Client): Client[] =>
    Array.isArray(clients) ? clients : clients ? [clients] : [];

const triggerSelectionHaptic = async () => {
    try {
        await Haptics.selectionAsync();
    } catch {
        // Haptics unavailable on some simulators/web
    }
};

type ActionButtonProps = {
    label: string;
    onPress: () => void;
    iconName: string;
    clientName: string;
    theme: ThemePalette;
    fullWidth?: boolean;
};

const ClientActionButton = ({
    label,
    onPress,
    iconName,
    clientName,
    theme,
    fullWidth = false,
}: ActionButtonProps) => {
    const reduceMotion = useReducedMotion();
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        if (!reduceMotion) {
            scale.value = withTiming(0.97, TIMING);
        }
    };

    const handlePressOut = () => {
        if (!reduceMotion) {
            scale.value = withTiming(1, TIMING);
        }
    };

    const handlePress = async () => {
        await triggerSelectionHaptic();
        onPress();
    };

    return (
        <Animated.View style={[fullWidth ? styles.actionFlexFull : styles.actionFlex, animatedStyle]}>
            <Pressable
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                accessibilityRole="button"
                accessibilityLabel={`${label} for ${clientName}`}
                accessibilityHint={`Opens the ${label.toLowerCase()} screen for ${clientName}`}
                hitSlop={8}
                style={({ pressed }) => [
                    styles.actionButton,
                    {
                        backgroundColor: theme.buttonBg,
                        borderColor: theme.buttonBorder,
                        opacity: pressed ? 0.85 : 1,
                    },
                ]}
            >
                <Avatar.Icon
                    icon={iconName}
                    size={26}
                    color={theme.buttonText}
                    style={styles.actionIcon}
                    accessible={false}
                />
                <Text
                    style={[styles.actionText, { color: theme.buttonText }]}
                    maxFontSizeMultiplier={2}
                    allowFontScaling
                >
                    {label}
                </Text>
            </Pressable>
        </Animated.View>
    );
};

type ClientCardProps = {
    client: Client;
    index: number;
    isSuperAdmin: boolean;
    theme: ThemePalette;
    onOpenForm: () => void;
    onOpenReport: () => void;
    onOpenInfo: () => void;
};

const ClientCard = ({
    client,
    index,
    isSuperAdmin,
    theme,
    onOpenForm,
    onOpenReport,
    onOpenInfo,
}: ClientCardProps) => {
    const reduceMotion = useReducedMotion();
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const staffNames = client.user?.map((staff) => staff.name).join(', ') || 'No staff assigned';

    return (
        <Animated.View
            entering={reduceMotion ? undefined : FadeInDown.delay(Math.min(index * 40, 240)).duration(280)}
        >
            <Animated.View style={animatedStyle}>
            <Pressable
                accessibilityRole="summary"
                accessibilityLabel={`Client ${client.name}`}
                accessibilityHint={
                    isSuperAdmin
                        ? `Assigned staff: ${staffNames}. Use the Form, Report, or Info buttons below.`
                        : 'Use the Form button below to open this client form.'
                }
                onPressIn={() => {
                    if (!reduceMotion) scale.value = withTiming(0.985, TIMING);
                }}
                onPressOut={() => {
                    if (!reduceMotion) scale.value = withTiming(1, TIMING);
                }}
                style={({ pressed }) => [
                    styles.clientBox,
                    {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        shadowColor: theme.accent,
                    },
                    pressed && styles.clientBoxPressed,
                ]}
            >
                <View style={styles.btnRow} accessible={false}>
                    <View
                        style={[styles.avatarWrap, { backgroundColor: theme.avatarBg }]}
                        accessibilityElementsHidden
                        importantForAccessibility="no-hide-descendants"
                    >
                        <Avatar.Icon
                            icon="account"
                            color={theme.accentOn}
                            size={40}
                            style={styles.avatar}
                            accessible={false}
                        />
                    </View>
                    <View style={styles.clientMeta}>
                        <Text
                            style={[styles.clientName, { color: theme.text }]}
                            maxFontSizeMultiplier={2}
                            allowFontScaling
                            accessibilityRole="header"
                        >
                            {client.name}
                        </Text>
                        {isSuperAdmin && (
                            <View
                                accessible
                                accessibilityRole="text"
                                accessibilityLabel={`Staff for ${client.name}: ${staffNames}`}
                            >
                                <Text
                                    style={[styles.staffHeading, { color: theme.accent }]}
                                    maxFontSizeMultiplier={2}
                                    allowFontScaling
                                    importantForAccessibility="no"
                                >
                                    Staff
                                </Text>
                                {client.user?.length ? (
                                    client.user.map((staffUser, staffIndex) => (
                                        <View key={`${staffUser.name}-${staffIndex}`} style={styles.staffRow}>
                                            <Avatar.Icon
                                                icon="account-tie"
                                                color={theme.avatarBg}
                                                size={28}
                                                style={[styles.staffIcon, { backgroundColor: theme.card }]}
                                                accessible={false}
                                            />
                                            <Text
                                                style={[styles.staffName, { color: theme.text }]}
                                                maxFontSizeMultiplier={2}
                                                allowFontScaling
                                                importantForAccessibility="no"
                                            >
                                                {staffUser.name}
                                            </Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text
                                        style={[styles.staffName, { color: theme.textMuted }]}
                                        maxFontSizeMultiplier={2}
                                        allowFontScaling
                                        importantForAccessibility="no"
                                    >
                                        No staff assigned
                                    </Text>
                                )}
                            </View>
                        )}
                    </View>
                </View>

                <View
                    style={styles.actionsRow}
                    accessibilityRole="toolbar"
                    accessibilityLabel={`Actions for ${client.name}`}
                >
                    <ClientActionButton
                        label="Form"
                        iconName="pencil"
                        clientName={client.name}
                        theme={theme}
                        fullWidth={!isSuperAdmin}
                        onPress={onOpenForm}
                    />
                    {isSuperAdmin && (
                        <>
                            <ClientActionButton
                                label="Report"
                                iconName="chart-bar"
                                clientName={client.name}
                                theme={theme}
                                onPress={onOpenReport}
                            />
                            <ClientActionButton
                                label="Info"
                                iconName="information-variant"
                                clientName={client.name}
                                theme={theme}
                                onPress={onOpenInfo}
                            />
                        </>
                    )}
                </View>
            </Pressable>
            </Animated.View>
        </Animated.View>
    );
};

const Clients = ({ navigation }: any) => {
    const { user } = useContext(AuthContext);
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';
    const reduceMotion = useReducedMotion();

    const [dataClients, setDataClients] = useState<Client[]>([]);
    const [searchClient, setSearchClient] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(searchClient);
    const [status, setStatus] = useState<number>();
    const [statusByStaff, setStatusByStaff] = useState<number>();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const { theme } = useAppTheme();

    const loadClients = useCallback(async () => {
        setErrorMessage('');
        try {
            if (isSuperAdmin) {
                const { data: { clients }, status: responseStatus } =
                    await disabilityApi.get<ClientsInterface>('/clients/getAllClients');
                const list = normalizeClients(clients);
                setDataClients(list);
                setStatus(responseStatus);
                AccessibilityInfo.announceForAccessibility(
                    `Loaded ${list.length} clients`
                );
            } else {
                const { data: { clients }, status: responseStatus } =
                    await disabilityApi.get<ClientsInterface>(
                        `/clients/getClientsByStaff/${user?.uid}`
                    );
                const list = normalizeClients(clients);
                setDataClients(list);
                setStatusByStaff(responseStatus);
                AccessibilityInfo.announceForAccessibility(
                    `Loaded ${list.length} clients`
                );
            }
        } catch {
            const message = 'Unable to load clients. Pull down to retry, or check your connection.';
            setErrorMessage(message);
            AccessibilityInfo.announceForAccessibility(message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [isSuperAdmin, user?.uid]);

    useEffect(() => {
        loadClients();
    }, [loadClients]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchClient);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchClient]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadClients();
    }, [loadClients]);

    const filteringClients = useMemo(() => {
        const search = debouncedSearch.trim().toLowerCase();
        if (!search) return dataClients;
        return dataClients.filter((client: Client) =>
            client.name.toLowerCase().includes(search)
        );
    }, [dataClients, debouncedSearch]);

    const navigateWithHaptic = async (routeName: string, params?: object) => {
        await triggerSelectionHaptic();
        navigation.navigate(routeName, params);
    };

    if (loading && statusByStaff !== 200 && status !== 200) {
        return (
            <View
                style={[styles.loadingWrap, { backgroundColor: theme.background }]}
                accessibilityRole="progressbar"
                accessibilityLabel="Loading clients"
                accessibilityLiveRegion="polite"
            >
                <LoadingScreen />
            </View>
        );
    }

    return (
        <Animated.ScrollView
            entering={reduceMotion ? undefined : FadeIn.duration(400)}
            style={{ backgroundColor: theme.background }}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={theme.accent}
                    colors={[theme.accent]}
                    accessibilityLabel="Refresh clients list"
                />
            }
            accessibilityLabel="Clients list screen"
        >
            <View style={[globalStyles.container, styles.screenPad]}>
                <Text
                    style={[styles.screenTitle, { color: theme.text }]}
                    accessibilityRole="header"
                    maxFontSizeMultiplier={2}
                    allowFontScaling
                >
                    Clients
                </Text>

                {!!errorMessage && (
                    <View
                        style={[
                            styles.errorBanner,
                            {
                                backgroundColor: theme.errorBg,
                                borderColor: theme.errorBorder,
                            },
                        ]}
                        accessibilityRole="alert"
                        accessibilityLiveRegion="assertive"
                        accessible
                        accessibilityLabel={errorMessage}
                    >
                        <Text
                            style={[styles.errorTitle, { color: theme.errorText }]}
                            maxFontSizeMultiplier={2}
                            allowFontScaling
                        >
                            Something went wrong
                        </Text>
                        <Text
                            style={[styles.errorBody, { color: theme.errorText }]}
                            maxFontSizeMultiplier={2}
                            allowFontScaling
                        >
                            {errorMessage}
                        </Text>
                        <Pressable
                            onPress={onRefresh}
                            accessibilityRole="button"
                            accessibilityLabel="Retry loading clients"
                            accessibilityHint="Attempts to load the clients list again"
                            style={({ pressed }) => [
                                styles.retryButton,
                                {
                                    borderColor: theme.errorBorder,
                                    backgroundColor: pressed ? theme.errorBorder : 'transparent',
                                },
                            ]}
                        >
                            <Text
                                style={[styles.retryText, { color: theme.errorText }]}
                                maxFontSizeMultiplier={2}
                                allowFontScaling
                            >
                                Retry
                            </Text>
                        </Pressable>
                    </View>
                )}

                {isSuperAdmin && (
                    <>
                        <Pressable
                            onPress={() => navigateWithHaptic('CreateClientProfile')}
                            accessibilityRole="button"
                            accessibilityLabel="Create new client"
                            accessibilityHint="Opens the form to create a new client profile"
                            hitSlop={4}
                            style={({ pressed }) => [
                                styles.primaryButton,
                                {
                                    backgroundColor: theme.accent,
                                    opacity: pressed ? 0.9 : 1,
                                },
                            ]}
                        >
                            <Avatar.Icon
                                icon="account-plus"
                                size={28}
                                color={theme.accentOn}
                                style={styles.primaryIcon}
                                accessible={false}
                            />
                            <Text
                                style={[styles.primaryButtonText, { color: theme.accentOn }]}
                                maxFontSizeMultiplier={2}
                                allowFontScaling
                            >
                                Create new client
                            </Text>
                        </Pressable>

                        <View style={styles.searchWrap}>
                            <Input
                                label="Search Client"
                                placeholder="Search by client name"
                                value={searchClient}
                                setValue={setSearchClient}
                                onAccion={() => {}}
                                rightEye={false}
                                multiline={false}
                                disabled={false}
                                keyboardType="default"
                                backgroundInputColor="white"
                                inputTextColor="black"
                                accessibilityLabel="Search clients"
                                accessibilityHint="Type a client name to filter the list"
                                left={
                                    <TextInput.Icon
                                        icon="magnify"
                                        color={theme.accent}
                                        size={28}
                                        accessibilityLabel="Search icon"
                                    />
                                }
                            />
                            {!!debouncedSearch && (
                                <Text
                                    style={[styles.resultCount, { color: theme.textMuted }]}
                                    accessibilityLiveRegion="polite"
                                    maxFontSizeMultiplier={2}
                                    allowFontScaling
                                >
                                    {filteringClients.length} result
                                    {filteringClients.length === 1 ? '' : 's'} for “{debouncedSearch}”
                                </Text>
                            )}
                        </View>
                    </>
                )}

                {!errorMessage && filteringClients.length === 0 ? (
                    <View
                        style={[
                            styles.emptyState,
                            { backgroundColor: theme.card, borderColor: theme.border },
                        ]}
                        accessible
                        accessibilityRole="text"
                        accessibilityLabel={
                            debouncedSearch
                                ? `No clients found for ${debouncedSearch}`
                                : 'No clients available'
                        }
                    >
                        <Text
                            style={[styles.emptyTitle, { color: theme.text }]}
                            maxFontSizeMultiplier={2}
                            allowFontScaling
                        >
                            No clients found
                        </Text>
                        <Text
                            style={[styles.emptyBody, { color: theme.textMuted }]}
                            maxFontSizeMultiplier={2}
                            allowFontScaling
                        >
                            {debouncedSearch
                                ? 'Try a different name, or clear the search field.'
                                : 'Pull down to refresh, or create a new client.'}
                        </Text>
                    </View>
                ) : (
                    filteringClients.map((client: Client, index: number) => (
                        <ClientCard
                            key={client._id || `${client.name}-${index}`}
                            client={client}
                            index={index}
                            isSuperAdmin={isSuperAdmin}
                            theme={theme}
                            onOpenForm={() =>
                                navigateWithHaptic('Client Form', {
                                    clientUid: client._id,
                                    clientName: client.name,
                                })
                            }
                            onOpenReport={() =>
                                navigateWithHaptic('Client Report', {
                                    clientUid: client._id,
                                    clientName: client.name,
                                })
                            }
                            onOpenInfo={() =>
                                navigateWithHaptic('Client Profile', {
                                    clientUid: client._id,
                                })
                            }
                        />
                    ))
                )}
            </View>
        </Animated.ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 32,
        flexGrow: 1,
    },
    screenPad: {
        paddingTop: 8,
    },
    loadingWrap: {
        flex: 1,
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: '700',
        fontFamily: 'Roboto',
        marginBottom: 16,
    },
    errorBanner: {
        borderWidth: 2,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 6,
        fontFamily: 'Roboto',
    },
    errorBody: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 12,
        fontFamily: 'Roboto',
    },
    retryButton: {
        minHeight: MIN_TOUCH,
        minWidth: MIN_TOUCH,
        borderWidth: 2,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
    },
    retryText: {
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'Roboto',
    },
    primaryButton: {
        minHeight: MIN_TOUCH,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    primaryIcon: {
        backgroundColor: 'transparent',
        marginRight: 4,
    },
    primaryButtonText: {
        fontSize: 17,
        fontWeight: '700',
        fontFamily: 'Roboto',
    },
    searchWrap: {
        marginBottom: 12,
    },
    resultCount: {
        marginTop: 8,
        fontSize: 14,
        fontFamily: 'Roboto',
    },
    emptyState: {
        borderWidth: 2,
        borderRadius: 12,
        padding: 20,
        marginTop: 8,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 6,
        fontFamily: 'Roboto',
    },
    emptyBody: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: 'Roboto',
    },
    clientBox: {
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.18,
        shadowRadius: 4,
        elevation: 4,
    },
    clientBoxPressed: {
        opacity: 0.96,
    },
    btnRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatarWrap: {
        width: MIN_TOUCH,
        height: MIN_TOUCH,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        backgroundColor: 'transparent',
    },
    clientMeta: {
        flex: 1,
        marginLeft: 14,
    },
    clientName: {
        fontSize: Platform.OS === 'android' ? 20 : 18,
        fontWeight: '700',
        marginBottom: 8,
        fontFamily: 'Roboto',
    },
    staffHeading: {
        marginBottom: 6,
        fontSize: Platform.OS === 'android' ? 16 : 15,
        fontWeight: '700',
        fontFamily: 'Roboto',
    },
    staffRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 36,
        marginBottom: 2,
    },
    staffIcon: {
        marginRight: 2,
    },
    staffName: {
        fontSize: Platform.OS === 'android' ? 16 : 15,
        fontFamily: 'Roboto',
    },
    actionsRow: {
        flexDirection: 'row',
        marginTop: 14,
        gap: 8,
    },
    actionFlex: {
        flex: 1,
    },
    actionFlexFull: {
        flex: 1,
    },
    actionButton: {
        minHeight: MIN_TOUCH,
        borderRadius: 12,
        borderWidth: 2,
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIcon: {
        backgroundColor: 'transparent',
        margin: 0,
    },
    actionText: {
        fontSize: 15,
        fontWeight: '700',
        fontFamily: 'Roboto',
    },
});

export default Clients;
