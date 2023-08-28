import React, { useEffect, useState } from 'react';
import { View, Platform, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
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
        try {

            const { data: { msg }} = await disabilityApi.post<any>('/clients/setClient', { name, dateOfBirth: selectedStartDate, gender: valueGender, ndisNumber: NDISNumber, emergencyContact: emergency, ndisGoals: NDISGoals, assessment, supportNetwork: valueSupportNetworkItems, user: valueUsers });
            Alert.alert("Info Success", msg)
            
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <ScrollView>
        <View style={ globalStyles.container }>
            <IconGoBack navigation={ navigation }/>
            <KeyboardAvoidingView
                behavior={ ( Platform.OS === 'ios') ? 'padding': 'padding' }
            >
                <View>
                    <Input 
                        label={"Name"} 
                        value={ name } 
                        setValue={ setName } 
                    />
                    <TouchableOpacity>
                        <Input 
                            label={"Date of Birth"} 
                            value={ selectedStartDate }
                            onAccion={ handleOnPressStartDate }
                        />
                    </TouchableOpacity>
                    <Datepicker 
                        mode={ "datepicker" }
                        openStartDatePicker={ openStartDatePicker }
                        startDate={ startDate }
                        maxiDate={ maxiDate }
                        startedDate={ startedDate }
                        handleChangeStartDate={ handleChangeStartDate }
                        setDate={ setSelectedStartDate }
                        handleOnPressStartDate={ handleOnPressStartDate }
                    />
                    <DropDown
                        title={"Select Gender"}
                        items={ gender }
                        value={ valueGender }
                        setItems={setGender}
                        setValue={ setValueGender }
                    />
                    <Input 
                        label={"NDIS Number"} 
                        value={ NDISNumber } 
                        setValue={ setNDISNumber } 
                    />
                    <Input 
                        label={"Emergency Contact"} 
                        value={ emergency } 
                        setValue={ setEmergency } 
                    />
                    <Input 
                        label={"NDIS Goals"} 
                        value={ NDISGoals } 
                        setValue={ setNDISGoals } 
                    />
                    <Input 
                        label={"Assessment"} 
                        value={ assessment } 
                        setValue={ setAssessment } 
                    />
                    <DropDown
                        title={"Select Support Network"}
                        items={supportNetworkItems}
                        value={ valueSupportNetworkItems }
                        setItems={setSupportNetworkItems}
                        setValue={ setValueupportNetworkItems }
                    />
                    <DropDown
                        title={"Select Staff"}
                        items={dataUsers}
                        value={ valueUsers }
                        setItems={setDataUsers}
                        setValue={ setValueUsers }
                        multiple
                    />

                    <Button 
                        label={ "Create client" }
                        buttonEvent={ createClient }
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