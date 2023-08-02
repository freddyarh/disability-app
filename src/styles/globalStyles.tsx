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
        // height: 50,
        marginTop: 20,
        // borderWidth: 0,
        backgroundColor: 'white',
        // borderWidth: 5,
        borderTopLeftRadius: 20
    },
});