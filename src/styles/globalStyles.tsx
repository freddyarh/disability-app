import { Platform } from 'react-native';
import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const globalStyles = StyleSheet.create({
    container: {
        padding: '4%',
    },
    forgotPassword:{
        fontSize: 15,
        color: 'gray',
        marginTop: 15,
        alignSelf: 'flex-end'
    },
    textInput: {
        borderWidth: 1,
        borderBottomWidth: 0.8,
        borderTopWidth: 0.8,
        borderBottomColor: colors.aquaDark,
        borderTopColor: colors.aquaDark,
        borderColor: colors.aquaDark,
        fontSize: Platform.OS === 'android' ? 17 : 16,
        marginBottom: 12,
    },
    label: {
        marginVertical: 6,
        color: colors.black,
        fontSize: 18
    }
});