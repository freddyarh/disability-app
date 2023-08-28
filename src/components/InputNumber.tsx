import React from 'react';
import { TextInput } from 'react-native-paper';
import { globalStyles } from '../styles/globalStyles';

interface Props {
    label: string,
    value: string,
    setValue?: React.SetStateAction<any>,
    onAccion?: () => void,
    secureTextEntry?: boolean,
    rightEye?: any,
    rightEyeButton?: any,
    multiline?: boolean,
    disabled?: boolean;
}

const Input = ({ label, value, setValue, onAccion, secureTextEntry, rightEye, rightEyeButton, multiline=false, disabled=false }: Props ) => {
  return (
    <>
      <TextInput
          style={ globalStyles.textInput }
          mode="flat"
          secureTextEntry={ secureTextEntry }
          onFocus={ onAccion }
          label={ label }
          onChangeText={ setValue }
          value={ value }
          disabled={ disabled }
          multiline={ multiline }
          right={rightEye ? <TextInput.Icon icon="eye" onPress={ rightEyeButton }/> : null}
      />
    </>
  )
}

export default Input;