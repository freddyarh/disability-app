import React from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../styles/colors';
import IconGoBack from './IconGoBack';

const ScreenTitle = ({ navigation, clientName }: any) => {
  return (
    <View style={ styles.container }>
        <View style={{ flex: 1 }}>
            <IconGoBack navigation={ navigation } color={ 'black' } backgroundColor={ colors.white }/>
        </View>
        {/* <View><Text>Holaaa</Text></View> */}
        <Text style={ styles.title }>{ clientName }</Text>
        <View style={{ flex: 1 }}></View>
    </View>
  )
};

const styles = StyleSheet.create({
    container : {
        display: "flex",
        padding: 13,
        flexDirection: "row",
        backgroundColor: colors.aquaDark,
        alignItems: 'center'
    },
    title : { 
        flex: 10,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: "center",
        color: colors.white
    }
  });

export default ScreenTitle;