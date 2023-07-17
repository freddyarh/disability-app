import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

interface Input {
    label: string,
    value: string,
    setValue?: React.SetStateAction<any>,
    onAccion?: () => void,
    secureTextEntry?: boolean,
    disabled?: boolean;
}

const Input = ({ label, value, setValue, onAccion, secureTextEntry, disabled=false }: Input ) => {
  return (
    <TextInput
        mode="outlined"
        secureTextEntry={ secureTextEntry }
        onFocus={ onAccion }
        style={styles.textInput}
        label={ label }
        onChangeText={ setValue }
        value={ value }
        disabled={ disabled }
    />
  )
}

const styles = StyleSheet.create({
    textInput: {
      width: '100%',
      height: 50,
      marginTop: 20,
      borderWidth: 0,
      backgroundColor: '#f1f1f1'
    },
});

export default Input;