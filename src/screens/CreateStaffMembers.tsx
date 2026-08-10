import React, { useContext, useEffect, useState } from 'react';
import { Text, View, Alert, Keyboard, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import disabilityApi from '../api/disabilityApi';
import Button from '../components/Button';
import DropDown from '../components/DropDown';
import Input from '../components/Input';
import ScreenTitle from '../components/ScreenTitle';
import { AuthContext } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import { globalStyles } from '../styles/globalStyles';

const CreateStaffMembers = ({ navigation }: any) => {
  const { theme } = useAppTheme();
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [open1, setOpen1] = useState(false);
  const [role, setRole] = useState([]);
  const [valueRole, setValueRole] = useState([]);

  useEffect(() => {
    getAllRoles();
  }, []);

  const getAllRoles = async () => {
    const { data } = await disabilityApi.get<any>('/users/getAllRoles');

    const roleList = await data.roles.map((item: any) => {
      return {
        ...item,
        label: item.role,
        value: item.role,
      };
    });
    setRole(roleList);
  };

  const resetFields = () => {
    setName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setRepeatPassword("");
    setValueRole([]);
    Keyboard.dismiss();
  };

  const handleCreateStaff = async () => {
    if (password !== repeatPassword) {
      return Alert.alert("Invalid information", "Password and repeat password are not the same");
    }

    const resp = await signUp({ name, lastName, email, password, role: valueRole });
    if (resp === 200) return resetFields();
  };

  const labelStyle = [styles.label, { color: theme.accent }];

  return (
    <Animated.ScrollView
      entering={FadeIn.duration(500)}
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      accessibilityLabel="Create staff member form"
    >
      <ScreenTitle navigation={navigation} clientName="Create staff" />

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
          accessibilityLabel="Staff first name"
        />

        <Text style={labelStyle} maxFontSizeMultiplier={2} allowFontScaling>
          Last name
        </Text>
        <Input
          label="Last name"
          value={lastName}
          setValue={setLastName}
          accessibilityLabel="Staff last name"
        />

        <Text style={labelStyle} maxFontSizeMultiplier={2} allowFontScaling>
          Email
        </Text>
        <Input
          label="Email"
          value={email}
          setValue={setEmail}
          accessibilityLabel="Staff email"
        />

        <Text style={labelStyle} maxFontSizeMultiplier={2} allowFontScaling>
          Password
        </Text>
        <Input
          label="Password"
          value={password}
          setValue={setPassword}
          accessibilityLabel="Password"
          accessibilityHint="Enter a password for the new staff account"
        />

        <Text style={labelStyle} maxFontSizeMultiplier={2} allowFontScaling>
          Repeat password
        </Text>
        <Input
          label="Repeat password"
          value={repeatPassword}
          setValue={setRepeatPassword}
          accessibilityLabel="Repeat password"
          accessibilityHint="Re-enter the password to confirm"
        />

        <Text style={labelStyle} maxFontSizeMultiplier={2} allowFontScaling>
          Select role
        </Text>
        <DropDown
          title="Select role"
          items={role}
          value={valueRole}
          open={open1}
          setOpen={(val: boolean) => {
            setOpen1(val);
          }}
          setItems={setRole}
          setValue={setValueRole}
        />

        <Button
          label="Create Staff"
          iconName="account-plus"
          onPress={handleCreateStaff}
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

export default CreateStaffMembers;
