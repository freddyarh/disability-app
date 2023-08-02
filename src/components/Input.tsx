import React from 'react';
import { TextInput } from 'react-native-paper';
import { globalStyles } from '../styles/globalStyles';

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
    <>
      <TextInput
          style={ globalStyles.textInput }
          mode="outlined"
          secureTextEntry={ secureTextEntry }
          onFocus={ onAccion }
          label={ label }
          onChangeText={ setValue }
          value={ value }
          disabled={ disabled }
      />
    </>
  )
}

export default Input;