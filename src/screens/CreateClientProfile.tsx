import React, { useEffect, useState } from 'react';
import { View, Platform, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert, Keyboard, Text } from 'react-native';
import { getFormatedDate } from "react-native-modern-datepicker";
import { gendersOptions, supportNetworkOptions } from '../../assets/RadioDataGender';
import Animated, { FadeIn } from 'react-native-reanimated';

import Input from '../components/Input';
import DropDown from '../components/DropDown';
import Button from '../components/Button';
import ScreenTitle from '../components/ScreenTitle';
import { globalStyles } from '../styles/globalStyles';
import Datepicker from '../components/Datepicker';
import disabilityApi from '../api/disabilityApi';
import { setNewFormatDate } from '../helpers/setNewFormatDate';
import { useAppTheme } from '../context/ThemeContext';

const CreateClientProfile = ({ navigation }: any) => {
    const { theme } = useAppTheme();

    const _today = new Date();
    const today_ = setNewFormatDate(_today);

    const [date, setDate] = useState(today_);
    const [name, setName] = useState("");
    const [valueGender, setValueGender] = useState([]);
    const [NDISNumber, setNDISNumber] = useState("");
    const [emergency, setEmergency] = useState<any>("");
    const [NDISGoals, setNDISGoals] = useState<string>("");
    const [assessment, setAssessment] = useState<string>("");
    const [valueSupportNetworkItems, setValueupportNetworkItems] = useState([]);
    const [valueUsers, setValueUsers] = useState([]);
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [gender, setGender] = useState(gendersOptions);
    const [supportNetworkItems, setSupportNetworkItems] = useState(supportNetworkOptions);
    const [dataUsers, setDataUsers] = useState([]);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);

    useEffect(() => {
        getAllUsers();
    }, []);

    const startDate = getFormatedDate(new Date(), "1900/01/01");

    const handleOnPressStartDate = () => {
        setOpenStartDatePicker(!openStartDatePicker);
        Keyboard.dismiss();
    };

    const getAllUsers = async () => {
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

    const resetFields = () => {
        setName("");
        setValueGender([]);
        setNDISNumber("");
        setEmergency("");
        setNDISGoals("");
        setAssessment("");
        setValueupportNetworkItems([]);
        setValueUsers([]);
    };

    const createClient = async () => {
        Keyboard.dismiss();
        setOpen1(false);
        setOpen2(false);
        setOpen3(false);

        try {
            const nameTrim = name.trim();
            const NDISGoalsTrim = NDISGoals.trim();
            const assessmentTrim = assessment.trim();

            const { data: { msg } } = await disabilityApi.post<any>('/clients/setClient', {
                name: nameTrim,
                dateOfBirth: date,
                gender: valueGender,
                ndisNumber: NDISNumber,
                emergencyContact: emergency,
                ndisGoals: NDISGoalsTrim,
                assessment: assessmentTrim,
                supportNetwork: valueSupportNetworkItems,
                user: valueUsers,
            });

            Alert.alert("Success", msg, [{ text: 'Ok', onPress: resetFields }]);
        } catch (error: any) {
            if (error.response?.status === 401) {
                return Alert.alert("Token expired", "Sign in again");
            }
            console.log(error);
            Alert.alert('Invalid information', error.response?.data?.msg || 'Unable to create client');
        }
    };

    const labelStyle = [styles.label, { color: theme.accent }];

    return (
        <Animated.ScrollView
            entering={FadeIn.duration(500)}
            style={{ backgroundColor: theme.background }}
            contentContainerStyle={styles.content}
            accessibilityLabel="Create client profile form"
        >
            <ScreenTitle navigation={navigation} clientName="Create client" />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
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
                        value={name}
                        setValue={setName}
                        accessibilityLabel="Client name"
                        accessibilityHint="Enter the client's full name"
                    />

                    <Text style={labelStyle} maxFontSizeMultiplier={2} allowFontScaling>
                        Date of Birth
                    </Text>
                    <TouchableOpacity
                        onPress={handleOnPressStartDate}
                        accessibilityRole="button"
                        accessibilityLabel="Select date of birth"
                    >
                        <Input
                            label="Date of Birth"
                            value={date}
                            onAccion={handleOnPressStartDate}
                            accessibilityLabel="Date of birth"
                        />
                    </TouchableOpacity>
                    <Datepicker
                        mode="calendar"
                        openStartDatePicker={openStartDatePicker}
                        startDate={startDate}
                        maximumDate={today_}
                        startedDate={today_}
                        setDate={setDate}
                        handleOnPressStartDate={handleOnPressStartDate}
                    />

                    <Text style={labelStyle} maxFontSizeMultiplier={2} allowFontScaling>
                        Select Gender
                    </Text>
                    <DropDown
                        title="Select Gender"
                        items={gender}
                        value={valueGender}
                        open={open1}
                        setOpen={(val: boolean) => {
                            setOpen1(val);
                            setOpen2(false);
                            setOpen3(false);
                        }}
                        setItems={setGender}
                        setValue={setValueGender}
                    />

                    <Text style={labelStyle} maxFontSizeMultiplier={2} allowFontScaling>
                        NDIS Number
                    </Text>
                    <Input
                        label="NDIS Number"
                        value={NDISNumber}
                        setValue={setNDISNumber}
                        keyboardType="numeric"
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
                        value={assessment}
                        setValue={setAssessment}
                        accessibilityLabel="Assessment"
                    />

                    <Text style={labelStyle} maxFontSizeMultiplier={2} allowFontScaling>
                        Select Support Network
                    </Text>
                    <DropDown
                        title="Select Support Network"
                        items={supportNetworkItems}
                        value={valueSupportNetworkItems}
                        open={open2}
                        setOpen={(val: boolean) => {
                            setOpen1(false);
                            setOpen2(val);
                            setOpen3(false);
                        }}
                        setItems={setSupportNetworkItems}
                        setValue={setValueupportNetworkItems}
                    />

                    <Text style={labelStyle} maxFontSizeMultiplier={2} allowFontScaling>
                        Select Staff
                    </Text>
                    <DropDown
                        title="Select Staff"
                        items={dataUsers}
                        value={valueUsers}
                        open={open3}
                        setOpen={(val: boolean) => {
                            setOpen1(false);
                            setOpen2(false);
                            setOpen3(val);
                        }}
                        setItems={setDataUsers}
                        setValue={setValueUsers}
                        multiple
                    />

                    <Button
                        iconName="account-plus"
                        label="Create client"
                        onPress={createClient}
                        disabled={false}
                    />
                </View>
            </KeyboardAvoidingView>
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

export default CreateClientProfile;
