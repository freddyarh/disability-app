import React, { useState } from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet, Modal, ScrollView, KeyboardAvoidingView } from 'react-native';
import DatePicker from "react-native-modern-datepicker";
import { getFormatedDate } from "react-native-modern-datepicker";
import { gendersOptions, supportNetworkOptions } from '../../assets/RadioDataGender';

import Input from '../components/Input';
import DropDown from '../components/DropDown';
import Button from '../components/Button';
import { colors } from '../styles/colors';

const ClientProfileForm = () => {
    
    const [name, setName] = useState("");
    const [emergency, setEmergency] = useState<number>();
    const [NDISGoals, setNDISGoals] = useState<string>("");
    const [assessment, setAssessment] = useState<string>("");
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const [startedDate, setStartedDate] = useState("12/12/2023");
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState(gendersOptions);
    const [supportNetworkOpen, setSupportNetworkOpen] = useState(false);
    const [supportNetworkValue, setSupportNetworkValue] = useState(null);
    const [supportNetworkItems, setSupportNetworkItems] = useState(supportNetworkOptions);
    
    const today = new Date();
    const startDate = getFormatedDate(
        today.setDate(today.getDate()),
        "1900/01/01"
        );
    const maxiDate = getFormatedDate(
        today.setDate(today.getDate() - 1),
        "YYYY/MM/DD"
    );
    const [selectedStartDate, setSelectedStartDate] = useState("");

    function handleChangeStartDate(propDate: any) {
        console.log(propDate)
        setStartedDate(propDate);
    }
    const handleOnPressStartDate = () => {
        setOpenStartDatePicker(!openStartDatePicker);
    }

  return (
    <>
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#fff' }}
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

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={openStartDatePicker}
                >
                    <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <DatePicker
                            mode="calendar"
                            minimumDate={startDate}
                            maximumDate={maxiDate}
                            selected={startedDate}
                            onDateChange={handleChangeStartDate}
                            onSelectedChange={(date) => setSelectedStartDate(date)}
                            options={{
                            backgroundColor: colors.obsidium,
                            textHeaderColor: "#469ab6",
                            textDefaultColor: colors.white,
                            selectedTextColor: "#FFF",
                            mainColor: "#469ab6",
                            textSecondaryColor: "#FFFFFF",
                            borderColor: "rgb(165,162, 169)",
                            }}
                        />
                        <TouchableOpacity onPress={handleOnPressStartDate}>
                            <Text style={{ color: "white" }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </Modal>

                <DropDown
                    title={"Select Gender"}
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                />
                
                <Input 
                    label={"NDIS Number"} 
                    value={ name } 
                    setValue={ setName } 
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
                    open={supportNetworkOpen}
                    value={supportNetworkValue}
                    items={supportNetworkItems}
                    setOpen={setSupportNetworkOpen}
                    setValue={setSupportNetworkValue}
                    setItems={setSupportNetworkItems}
                />

                <Button 
                    label={ "Create client" }
                    buttonEvent={ () => console.log("Ejecuto") }
                    disabled={ false }
                />
                
            </View>
        </KeyboardAvoidingView>
    </>
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
        width: "90%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
    }
})

export default ClientProfileForm;