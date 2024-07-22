import React, { useCallback, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

interface Props {
    label: string,
    placeholder?: string,
    textContentType?: "none" | "password" | "emailAddress" | 'familyName'| 'givenName' | 'jobTitle' | 'location' | 'middleName' | 'name',
    accessibilityLabelledBy?: string,
    value: string,
    setValue?: React.SetStateAction<any>,
    onAccion?: () => void,
    onPressIn?: () => void,
    rightEye?: any,
    multiline?: boolean,
    disabled?: boolean;
    keyboardType?: "default" | "numeric";
    backgroundInputColor?: "white" | "black";
    inputTextColor?: "white" | "black";
}

const Input = ({ label, placeholder, textContentType="none", accessibilityLabelledBy="", value, setValue, onAccion, onPressIn, rightEye, multiline=false, disabled=false, keyboardType='default', backgroundInputColor="white", inputTextColor="black"}: Props ) => {
  
  const [eyeButton, setEyeButton] = useState(true);

  const iconEye = useCallback(() => {
    
    setEyeButton(!eyeButton);
  }, [eyeButton]);

  const eye = eyeButton ? <TextInput.Icon nativeID="eye" icon="eye" size={33} iconColor={ colors.titleColor } onPress={ iconEye }/> : <TextInput.Icon nativeID="eye-off" icon="eye-off" size={33} iconColor={ colors.titleColor } onPress={ iconEye } />;
  return (
    <>
      <TextInput
          textContentType={textContentType}
          accessibilityLabel="input"
          autoCapitalize={"none"}
          accessibilityLabelledBy={ accessibilityLabelledBy }
          textColor={ disabled ? 'gray' : inputTextColor}
          autoCorrect={ false }
          style={ [globalStyles.textInput, disabled ? { backgroundColor: 'rgb(238, 233, 237)' } : { backgroundColor: backgroundInputColor }]}
          mode="flat"
          keyboardType={ keyboardType }
          secureTextEntry={ rightEye ? eyeButton : false }
          onPressIn={onPressIn}
          onFocus={ onAccion }
          label={ label }
          placeholder={ placeholder }
          theme={ backgroundInputColor === 'white' ? { colors: { primary: colors.aquaDark, onSurfaceVariant: colors.black } } : { colors: { primary: colors.titleColor, onSurfaceVariant: colors.titleColor } }}
          onChangeText={ setValue }
          value={ value }
          disabled={ disabled }
          multiline={ multiline }
          right={rightEye ? eye : null}
      />
    </>
  )
}

export default Input;