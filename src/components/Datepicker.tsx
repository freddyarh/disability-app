import React from 'react';
import { Text, View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import { colors } from '../styles/colors';

const Datepicker = ({
    mode,
    openStartDatePicker,
    maximumDate,
    minimumDate,
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
                        backgroundColor: colors.white,
                        textHeaderColor: colors.black,
                        textDefaultColor: colors.black,
                        selectedTextColor: colors.white,
                        mainColor: colors.titleColor,
                        textSecondaryColor: 'rgba(52, 92, 184, 1)',
                        borderColor: 'rgba(52, 92, 184, 1)',
                    }}
                    mode={ mode }
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                    selected={startedDate}
                    onDateChange={handleChangeStartDate}
                    onSelectedChange={(date) => setDate(date)}
                    onTimeChange={(date) => console.log(date)}
                />
                <TouchableOpacity style={{ justifyContent: 'center', backgroundColor: 'rgba(52, 92, 184, 1)', height: 40, width: 110, marginBottom: 20, borderBottomStartRadius: 10, borderBottomEndRadius: 10, borderTopStartRadius: 10, borderTopEndRadius: 10, marginTop: -25 }} onPress={handleOnPressStartDate}>
                    <Text style={{ color: colors.white, textAlign: 'center' }}>Close All</Text>
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
        backgroundColor: 'rgba(255, 255, 255, 1)',
        alignItems: "center",
        justifyContent: "center",
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10,
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        borderColor: 'rgba(52, 92, 184, 1)',
        borderWidth: 1,
        paddingTop: 10,
        width: "90%",
        shadowOffset: {
            width: 0,
            height: 2,
        },
    }
})

export default Datepicker;