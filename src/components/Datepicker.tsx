import React from 'react';
import { Text, View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import { colors } from '../styles/colors';

const Datepicker = ({
    mode,
    openStartDatePicker,
    startDate,
    maxiDate,
    startedDate,
    handleChangeStartDate,
    setDate,
    handleOnPressStartDate
}: any) => {
    
  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={openStartDatePicker}
>
    <View style={styles.centeredView}>
    <View style={styles.modalView}>
        <DatePicker
            options={{
                backgroundColor: colors.obsidium,
                textHeaderColor: "#469ab6",
                textDefaultColor: colors.white,
                selectedTextColor: "#FFF",
                mainColor: "#469ab6",
                textSecondaryColor: "#FFFFFF",
                borderColor: "rgb(101, 110, 164)",
            }}
            mode={ mode }
            minimumDate={startDate}
            maximumDate={maxiDate}
            selected={startedDate}
            onDateChange={handleChangeStartDate}
            onSelectedChange={(date) => setDate(date)}
            onTimeChange={(date) => console.log(date)}
        />
        <TouchableOpacity onPress={handleOnPressStartDate}>
            <Text style={{ color: "white" }}>Close</Text>
        </TouchableOpacity>
    </View>
    </View>
</Modal>
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

export default Datepicker;