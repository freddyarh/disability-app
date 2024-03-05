import { StyleSheet, Text, TouchableOpacity} from 'react-native';
import { colors } from '../../src/styles/colors';

interface Props {
    label: string,
    onPress: () => void,
    disabled: boolean
}

const Button = ({ label, onPress, disabled } : Props ) => {
    return (
        <TouchableOpacity 
            style={ disabled ? styles.buttonDisable : styles.button }
            onPress={ onPress }
            disabled={ disabled }
        >
            <Text style={styles.text}>{ label }</Text>
        </TouchableOpacity>
        );
}

const styles = StyleSheet.create({
    text: {
      fontSize: 14,
      color: '#fff',
      fontWeight: 'bold'
    },
    button: {
      marginTop: 25,
      height: 50,
      borderRadius: 30,
      backgroundColor: colors.aquaDark,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonDisable: {
      marginVertical: '2%',
      height: 50,
      borderRadius: 5,
      backgroundColor: colors.gray,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center'
    },
});

export default Button;
  