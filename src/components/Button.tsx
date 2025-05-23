import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../src/styles/colors';
import { Avatar } from 'react-native-paper';

interface Props {
    label: string,
    onPress: () => void,
    disabled: boolean,
    iconName?: string,
    iconPosition?: 'left' | 'right'
}

const Button = ({ label, onPress, disabled, iconName, iconPosition = 'left' } : Props ) => {
    return (
        <TouchableOpacity 
            style={ disabled ? styles.buttonDisable : styles.button }
            onPress={ onPress }
            disabled={ disabled }
        >
            <View style={styles.contentContainer}>
                {iconName && iconPosition === 'left' && (
                    <Avatar.Icon icon={iconName} size={28} color="#fff" style={{ backgroundColor: 'rgba(0,0,0,0)', paddingRight: 7 }}/>

                )}
                <Text style={styles.text}>{ label }</Text>
                {iconName && iconPosition === 'right' && (
                    <Avatar.Icon icon={iconName} size={28} color="#fff" style={{ backgroundColor: 'rgba(0,0,0,0)', paddingRight: 7 }}/>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    text: {
      fontSize: Platform.OS === 'android' ? 17 : 17,
      color: '#fff',
      fontWeight: 'bold',
      fontFamily: 'Roboto'
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
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    icon: {
      marginHorizontal: 5
    }
});

export default Button;
  