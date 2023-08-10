import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        margin: '4%'
    },
    fondo: {
        flex: 1,
        backgroundColor: 'white',
        marginLeft: 20,
        marginRight: 20,
    },
    forgotPassword:{
        fontSize: 15,
        color: 'gray',
        marginTop: 15,
        alignSelf: 'flex-end'
    },
    textInput: {
        width: '100%',
        marginBottom: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 20
    },
});