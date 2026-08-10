import React, { useEffect, useState } from 'react';
import { View, Keyboard, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import disabilityApi from '../api/disabilityApi';
import Button from '../components/Button';
import DropDown from '../components/DropDown';
import Input from '../components/Input';
import ScreenTitle from '../components/ScreenTitle';
import { globalStyles } from '../styles/globalStyles';
import { LoadingScreen } from './LoadingScreen';
import LottieScreen from '../components/LottieScreen';
import { useAppTheme } from '../context/ThemeContext';

const ClientProfile = ({ route, navigation }: any) => {
    const { theme } = useAppTheme();
    const { clientUid } = route.params;

    const [dataClient, setDataClient] = useState<any>(null);
    const [dataUsers, setDataUsers] = useState([]);
    const [emergency, setEmergency] = useState<number | any>('');
    const [NDISGoals, setNDISGoals] = useState<string>('');
    const [valueUsers, setValueUsers] = useState([]);
    const [updateLottie, setUpdateLottie] = useState(false);
    const [open1, setOpen1] = useState(false);

    useEffect(() => {
        getClient();
    }, [clientUid]);

    useEffect(() => {
        getAllStaff();
    }, [clientUid]);

    const getClient = async () => {
        const { data } = await disabilityApi.get<Client | any>(`/clients/${clientUid}`);
        const staffClient: any = data.client.user.map((staff: { uid: string }) => {
            return staff.uid;
        });
        setEmergency(JSON.stringify(data.client.emergencyContact));
        setNDISGoals(data.client.ndisGoals);
        setValueUsers(staffClient);
        setDataClient(data);
    };

    const getAllStaff = async () => {
        const { data: { users } } = await disabilityApi.get<any>('/users/getAllUsers');
        const usersList = await users.filter((item: any) => item.role === 'STAFF').map((item: any) => {
            return {
                ...item,
                label: item.email,
                value: item.uid,
            };
        });
        setDataUsers(usersList);
    };

    const updateClient = async () => {
        Keyboard.dismiss();
        setOpen1(false);
        setUpdateLottie(true);

        try {
            const { status } = await disabilityApi.put<any>(`/clients/updateClient/${clientUid}`, {
                emergencyContact: Number(emergency),
                ndisGoals: NDISGoals,
                user: valueUsers,
            });
            if (status !== 200) {
                setUpdateLottie(false);
                return console.log(status);
            }
            setTimeout(() => {
                setUpdateLottie(false);
            }, 2900);
        } catch (error) {
            setUpdateLottie(false);
            console.log(error);
        }
    };

    if (updateLottie) return <LottieScreen />;

    if (!dataClient) return <LoadingScreen />;

    const clientName = dataClient.client?.name || 'Client profile';
    const labelStyle = [styles.label, { color: theme.accent }];

    return (
        <Animated.ScrollView
            entering={FadeIn.duration(500)}
            style={{ backgroundColor: theme.background }}
            contentContainerStyle={styles.content}
            accessibilityLabel={`Client profile for ${clientName}`}
        >
            <ScreenTitle navigation={navigation} clientName={clientName} />

            <View style={[
                globalStyles.container,
                styles.formCard,
                {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                },
            ]}>
                <Text style={labelStyle} maxFontSizeMultiplier={2} allowFontScaling>
                    Name
                </Text>
                <Input
                    label="Name"
                    value={dataClient.client.name}
                    disabled
                    accessibilityLabel="Client name"
                />

                <Text style={labelStyle} maxFontSizeMultiplier={2} allowFontScaling>
                    Date of Birth
                </Text>
                <Input
                    label="Date of Birth"
                    value={dataClient.client.dateOfBirth}
                    disabled
                    accessibilityLabel="Date of birth"
                />

                <Text style={labelStyle} maxFontSizeMultiplier={2} allowFontScaling>
                    Gender
                </Text>
                <Input
                    label="Gender"
                    value={dataClient.client.gender}
                    disabled
                    accessibilityLabel="Gender"
                />

                <Text style={labelStyle} maxFontSizeMultiplier={2} allowFontScaling>
                    NDIS Number
                </Text>
                <Input
                    label="NDIS Number"
                    value={JSON.stringify(dataClient.client.ndisNumber)}
                    disabled
                    accessibilityLabel="NDIS number"
                />

                <Text style={labelStyle} maxFontSizeMultiplier={2} allowFontScaling>
                    Emergency Contact
                </Text>
                <Input
                    label="Emergency Contact"
                    value={emergency}
                    setValue={setEmergency}
                    keyboardType="numeric"
                    accessibilityLabel="Emergency contact"
                />

                <Text style={labelStyle} maxFontSizeMultiplier={2} allowFontScaling>
                    NDIS Goals
                </Text>
                <Input
                    label="NDIS Goals"
                    value={NDISGoals}
                    setValue={setNDISGoals}
                    accessibilityLabel="NDIS goals"
                />

                <Text style={labelStyle} maxFontSizeMultiplier={2} allowFontScaling>
                    Assessment
                </Text>
                <Input
                    label="Assessment"
                    value={dataClient.client.assessment}
                    disabled
                    accessibilityLabel="Assessment"
                />

                <Text style={labelStyle} maxFontSizeMultiplier={2} allowFontScaling>
                    Staffs
                </Text>
                <DropDown
                    title="Select Staff"
                    items={dataUsers}
                    value={valueUsers}
                    setItems={setDataUsers}
                    setValue={setValueUsers}
                    open={open1}
                    setOpen={(val: boolean) => {
                        setOpen1(val);
                    }}
                    multiple
                />

                <Button
                    iconName="update"
                    label="Update client"
                    onPress={updateClient}
                    disabled={false}
                />
            </View>
        </Animated.ScrollView>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingBottom: 32,
        flexGrow: 1,
    },
    formCard: {
        marginTop: 12,
        marginHorizontal: 8,
        borderWidth: 2,
        borderRadius: 12,
        paddingBottom: 16,
    },
    label: {
        marginVertical: 6,
        fontSize: 18,
        fontWeight: '700',
        fontFamily: 'Roboto',
    },
});

export default ClientProfile;
