import React, { useEffect, useState } from 'react';
import { View, Platform, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Alert, useWindowDimensions, Keyboard, Text } from 'react-native';
import { getFormatedDate } from "react-native-modern-datepicker";
import { gendersOptions, supportNetworkOptions } from '../../assets/RadioDataGender';

import Input from '../components/Input';
import DropDown from '../components/DropDown';
import Button from '../components/Button';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import Datepicker from '../components/Datepicker';
import disabilityApi from '../api/disabilityApi';
import IconGoBack from '../components/IconGoBack';

const CreateClientProfile = ({ navigation }: any) => {

    const { height } = useWindowDimensions();

    const [name, setName] = useState("Fredy");
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [valueGender, setValueGender] = useState([]);
    const [NDISNumber, setNDISNumber] = useState("")
    const [emergency, setEmergency] = useState<number | any>("");
    const [NDISGoals, setNDISGoals] = useState<string>("The goals are here");
    const [assessment, setAssessment] = useState<string>("This is the assessment");
    const [valueSupportNetworkItems, setValueupportNetworkItems] = useState([]);
    const [valueUsers, setValueUsers ] = useState([]);
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [startedDate, setStartedDate] = useState("12/12/2023");
    const [gender, setGender] = useState(gendersOptions);
    const [supportNetworkItems, setSupportNetworkItems] = useState(supportNetworkOptions);
    const [dataUsers, setDataUsers] = useState([]);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);

    useEffect(() => {
        getAllUsers();
    }, [])
    
    const today = new Date();
    const startDate = getFormatedDate(
        today.setDate(today.getDate()),
        "1900/01/01"
        );
    const maxiDate = getFormatedDate(
        today.setDate(today.getDate() - 1),
        "YYYY/MM/DD"
    );

    function handleChangeStartDate(propDate: any) {
        setStartedDate(propDate);
    }
    const handleOnPressStartDate = () => {
        setOpenStartDatePicker(!openStartDatePicker);
    }

    const getAllUsers = async() => {
        const { data: { users }} = await disabilityApi.get<any>('/users/getAllUsers');
        const usersList = await users.filter( (item: any) => item.role === 'STAFF' ).map((item: any) => {
            return {
              ...item,
              label: item.email,
              value: item.uid
            }
          });
        setDataUsers( usersList );
    }

    const createClient = async() => {

        Keyboard.dismiss();
        setOpen1(false);
        setOpen2(false);
        setOpen3(false);

        try {

            const { data: { msg }} = await disabilityApi.post<any>('/clients/setClient', { name, dateOfBirth: selectedStartDate, gender: valueGender, ndisNumber: NDISNumber, emergencyContact: emergency, ndisGoals: NDISGoals, assessment, supportNetwork: valueSupportNetworkItems, user: valueUsers });
            Alert.alert("Info Success", msg)
            
        } catch (error) {
            if( error.response.status === 401){
                return Alert.alert("Token expired", "Sign in again");
            }
            console.log(error.response.status);
        }
    }

  return (
    <ScrollView>
        <View style={[ globalStyles.container, { minHeight: height - 50 } ]}>
            <IconGoBack navigation={ navigation } color={ 'black' } backgroundColor={ 'rgb(242, 242, 242)' } />
            <KeyboardAvoidingView
                behavior={ ( Platform.OS === 'ios') ? 'padding': 'padding' }
            >
                <View style={{ marginTop: 20 }} >
                    <Text style={ globalStyles.label }>Name</Text>
                    <Input 
                        label={"Name"} 
                        value={ name } 
                        setValue={ setName } 
                    />
                    <Text style={ globalStyles.label }>Date of Birth</Text>
                    <TouchableOpacity>
                        <Input 
                            label={"Date of Birth"} 
                            value={ selectedStartDate }
                            onAccion={ handleOnPressStartDate }
                        />
                    </TouchableOpacity>
                    <Datepicker 
                        mode={ "calendar" }
                        openStartDatePicker={ openStartDatePicker }
                        startDate={ startDate }
                        maxiDate={ maxiDate }
                        startedDate={ startedDate }
                        handleChangeStartDate={ handleChangeStartDate }
                        setDate={ setSelectedStartDate }
                        handleOnPressStartDate={ handleOnPressStartDate }
                    />
                    <Text style={ globalStyles.label }>Select Gender</Text>
                    <DropDown
                        title={"Select Gender"}
                        items={ gender }
                        value={ valueGender }
                        open={ open1 }
                        setOpen={(val: boolean) => {
                            setOpen1(val);
                            setOpen2(false);
                            setOpen3(false);
                        }}
                        setItems={setGender}
                        setValue={ setValueGender }
                    />
                    <Text style={ globalStyles.label }>NDIS Number</Text>
                    <Input 
                        label={"NDIS Number"} 
                        value={ NDISNumber } 
                        setValue={ setNDISNumber }
                        keyboardType={ "numeric" }
                    />
                    <Text style={ globalStyles.label }>Emergency Contact</Text>
                    <Input 
                        label={"Emergency Contact"} 
                        value={ emergency } 
                        setValue={ setEmergency } 
                        keyboardType={ "numeric" }
                    />
                    <Text style={ globalStyles.label }>NDIS Goals</Text>
                    <Input 
                        label={"NDIS Goals"} 
                        value={ NDISGoals } 
                        setValue={ setNDISGoals } 
                    />
                    <Text style={ globalStyles.label }>Assessment</Text>
                    <Input 
                        label={"Assessment"} 
                        value={ assessment } 
                        setValue={ setAssessment } 
                    />
                    <Text style={ globalStyles.label }>Select Support Network</Text>
                    <DropDown
                        title={"Select Support Network"}
                        items={supportNetworkItems}
                        value={ valueSupportNetworkItems }
                        open={ open2 }
                        setOpen={(val: boolean) => {
                            setOpen1(false);
                            setOpen2(val);
                            setOpen3(false);
                        }}
                        setItems={setSupportNetworkItems}
                        setValue={ setValueupportNetworkItems }
                    />
                    <Text style={ globalStyles.label }>Select Staff</Text>
                    <DropDown
                        title={"Select Staff"}
                        items={dataUsers}
                        value={ valueUsers }
                        open={ open3 }
                        setOpen={ (val: boolean) => {
                            setOpen1(false);
                            setOpen2(false);
                            setOpen3(val);
                        }}
                        setItems={setDataUsers}
                        setValue={ setValueUsers }
                        multiple
                    />
                    <Button 
                        label={ "Create client" }
                        onPress={ createClient }
                        disabled={ false }
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: colors.obsidium,
        borderColor: "rgb(165,162, 169)",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        padding: 35,
        width: "98%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
    }
})

export default CreateClientProfile;