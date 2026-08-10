import React, { useCallback, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

interface Props {
  onAccion?: () => void,
  onPressIn?: () => void,
  label: string,
  placeholder?: string,
  textContentType?: "none" | "password" | "emailAddress" | 'familyName'| 'givenName' | 'jobTitle' | 'location' | 'middleName' | 'name',
  value: string,
  setValue?: React.SetStateAction<any>,
  rightEye?: any,
  left?: React.ReactNode,
  multiline?: boolean,
  disabled?: boolean;
  keyboardType?: "default" | "numeric";
  backgroundInputColor?: "white" | "black";
  inputTextColor?: "white" | "black";
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const Input = ({
  label,
  placeholder,
  textContentType = "none",
  value,
  setValue,
  onAccion,
  onPressIn,
  rightEye,
  left,
  multiline = false,
  disabled = false,
  keyboardType = 'default',
  backgroundInputColor = "white",
  inputTextColor = "black",
  accessibilityLabel,
  accessibilityHint,
}: Props ) => {
  
  const [eyeButton, setEyeButton] = useState(true);

  const iconEye = useCallback(() => {
    
    setEyeButton(!eyeButton);
  }, [eyeButton]);

  const eye = eyeButton ? <TextInput.Icon nativeID="eye" icon="eye" size={33} color={ colors.titleColor } onPress={ iconEye }/> : <TextInput.Icon nativeID="eye-off" icon="eye-off" size={33} color={ colors.titleColor } onPress={ iconEye } />;
  return (
    <>
      <TextInput
          textContentType={textContentType}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={accessibilityHint}
          autoCapitalize={"none"}
          textColor={ disabled ? 'gray' : inputTextColor}
          autoCorrect={ false }
          style={ [globalStyles.textInput, disabled ? { backgroundColor: 'rgb(238, 233, 237)' } : { backgroundColor: backgroundInputColor }, { height: 48, minHeight: 48 }]}
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
          left={left}
      />
    </>
  )
}

export default Input;