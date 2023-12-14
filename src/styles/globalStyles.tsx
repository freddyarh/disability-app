import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: '4%',
        backgroundColor: colors.white
    },
    login: {
        flex: 1,
        padding: '4%',
        backgroundColor: "rgb(6, 3, 2)"
    },
    forgotPassword:{
        fontSize: 15,
        color: 'gray',
        marginTop: 15,
        alignSelf: 'flex-end'
    },
    textInput: {
        width: '100%',
        marginBottom: 15,
        borderWidth: 1,
        borderBottomWidth: 0.8,
        borderTopWidth: 0.8,
        borderBottomColor: "rgb(103, 80, 164)",
        borderTopColor: "rgb(103, 80, 164)",
        backgroundColor: colors.white,
        borderColor: "rgb(103, 80, 164)",
        borderTopLeftRadius: 20,
    },
    label: {
        margin: 6,
        color: colors.black,
        fontSize: 18
    }
});