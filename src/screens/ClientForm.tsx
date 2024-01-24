import React, { useContext, useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, Keyboard } from 'react-native';
import { getFormatedDate } from "react-native-modern-datepicker";
import{ AuthContext } from '../context/AuthContext';
import { functionList, promptList, activities, displayedBehaviour } from '../helpers/ClientFormList'
import Button from '../components/Button';
import Datepicker from '../components/Datepicker';
import Input from '../components/Input';
import { globalStyles } from '../styles/globalStyles';
import DropDown from '../components/DropDown';
import disabilityApi from '../api/disabilityApi';
import { ClientForm as InterfaceClientForm } from '../interfaces/appInterfaces';
import IconGoBack from '../components/IconGoBack';
import { Checkbox } from 'react-native-paper';
import { colors } from '../styles/colors';

const ClientForm = ({ route, navigation }: any) => {

    const { user: { uid }} = useContext(AuthContext);
    const { height } = useWindowDimensions();
    const { clientUid, clientName } = route.params;

    const [date, setDate] = useState("0000/00/00 00:00");
    const [prompt, setPrompt] = useState(promptList);
    const [valuePrompt, setValuePrompt] = useState([]);
    const [behaviour, setBechaviour] = useState(displayedBehaviour);
    const [valueBehaviour, setValueBehaviour] = useState([]);
    const [functionality, setFunctionality] = useState(functionList);
    const [valueFunct, setValueFunct] = useState([]);
    const [activity, setActivity] = useState(activities);
    const [valueActivity, setValueActivity] = useState([]);
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [startedDate, setStartedDate] = useState("12/12/2023");
    const [checked, setChecked] = useState(false);
    const [comment, setComment] = useState("");
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);

    const today = new Date();
    const startDate = getFormatedDate(
    today.setDate(today.getDate()),
    "1900/01/01"
    );
    const maxiDate = getFormatedDate(
    today.setDate(today.getDate()),
    "YYYY/MM/DD"
    );
    
    function handleChangeStartDate(propDate: any) {
        setStartedDate(propDate);
    }
    const handleOnPressStartDate = () => {
        setOpenStartDatePicker(!openStartDatePicker);
        Keyboard.dismiss();
    }

    useEffect(() => {
        cleanFields();
    }, [clientUid]);
    

    const cleanFields = () => {
        setValueFunct([]);
        setValuePrompt([]);
        setValueBehaviour([]);
        setValueActivity([]);
        setChecked(false);
        setComment("");
    }
            
    const handleCLientForm = async() => {

        Keyboard.dismiss();
        setOpen1(false);
        setOpen2(false);
        setOpen3(false);
        setOpen4(false);
        
        const behaviour = valueBehaviour.map((item: string) => {
            return {
                name: item
            }
        });
        
        try {
            const resp = await disabilityApi.post<InterfaceClientForm>('/clients/setClientForm', { clientId: clientUid, date, prompt: valuePrompt, behaviour, functionality: valueFunct, activity: valueActivity, incidentReport: checked, comment, userId: uid });
            
            if( resp.status === 200){
                Alert.alert("Successful info", "Form saved successfully", [{ text: 'Ok', onPress: cleanFields }] );
            }
        } catch (error: any) {
            Alert.alert('Invalid info', error.response.data.msg);
        }

    }
  return (
    <ScrollView>
        <View style={[globalStyles.container, { minHeight: height - 50 }]}>
        <IconGoBack navigation={ navigation } color={ 'black' } backgroundColor={ 'rgb(242, 242, 242)' }/>
        <Text style={{ textAlign: 'center', fontSize: 19, fontWeight: 'bold', backgroundColor: 'rgba(100, 156, 198, 0.15)', padding: 10, marginVertical: 15 }}>{ clientName }</Text>
            <Text style={ styles.label }>Time</Text>
            <TouchableOpacity>
                <Input 
                    label={"Time"} 
                    value={ date }
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
                setDate={ setDate }
                handleOnPressStartDate={ handleOnPressStartDate }
            />
            <Text style={ styles.label }>Function</Text>
            <DropDown
                title={"Select function"}
                items={ functionality }
                value={ valueFunct }
                open={ open1 }
                setOpen={(val: boolean) => {
                    setOpen1(val);
                    setOpen2(false);
                    setOpen3(false);
                    setOpen4(false);
                }}
                setItems={ setFunctionality }
                setValue={ setValueFunct }
            />
            <Text style={ styles.label }>Prompt</Text>
            <DropDown
                title={"Select prompt"}
                items={ prompt }
                value={ valuePrompt }
                open={ open2 }
                setOpen={(val: boolean) => {
                    setOpen1(false);
                    setOpen2(val);
                    setOpen3(false);
                    setOpen4(false);
                }}
                setItems={ setPrompt }
                setValue={ setValuePrompt }
            />
            <Text style={ styles.label }>Displayed Behaviour</Text>
            <DropDown
                title={"Behaviour"}
                items={behaviour}
                value={ valueBehaviour }
                open={ open3 }
                setOpen={(val: boolean) => {
                    setOpen1(false);
                    setOpen2(false);
                    setOpen3(val);
                    setOpen4(false);
                }}
                setItems={setBechaviour}
                setValue={ setValueBehaviour }
                multiple={ true }
            />
            <Text style={ styles.label }>Activities</Text>
            <DropDown
                title={"Activities"}
                items={activity}
                value={ valueActivity }
                open={ open4 }
                setOpen={(val: boolean) => {
                    setOpen1(false);
                    setOpen2(false);
                    setOpen3(false);
                    setOpen4(val);
                }}
                setItems={setActivity}
                setValue={ setValueActivity }
            />
            <Text style={ styles.label }>Incident Report?</Text>
            <Checkbox
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => {
                    setChecked(!checked);
                }}
                />
            <Text style={ styles.label }>Comments</Text>
            <Input 
                label="Comments" 
                value={ comment } 
                setValue={ setComment }
                multiline={ true }
            />
            <Button label="Create" onPress={ handleCLientForm } disabled={false}/>
        </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    checkbox: {
        alignSelf: 'center',
    },
    labelCheckbox: {
        margin: 8,
        color: colors.white
    },
    label: {
        margin: 6,
        color: colors.black,
        fontSize: 18
    }
  });

export default ClientForm;