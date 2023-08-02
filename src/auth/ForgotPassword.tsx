import React, { useReducer, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import disabilityApi from '../api/disabilityApi';
import Button from '../components/Button';
import Input from '../components/Input';
import { authReducer, AuthState } from '../context/authReducer';
import { globalStyles } from '../styles/globalStyles';

export const ForgotPassword = ({ navigation }: any ) => {

  const authInitialState: AuthState = {
    status: 'not-authenticated',
    token: null,
    user: null,
    errorMessage: '',
    forgotId: ''
}

  const [state, dispatch] = useReducer(authReducer, authInitialState);
  const [email, setEmail] = useState("");

  const handleForgotPassword = async() => {

    try {
      const resp = await disabilityApi.post<any>('/auth/forgotPassword', { email });

      if(resp.status !== 200){
        return dispatch({ type: 'addError', payload: resp.data.msg });
      }

      navigation.navigate('ChangePassword');

      return dispatch({ type: 'forgotPassword', payload: { forgotId: resp.data.code }});

      setEmail("");
      
    } catch (error: any) {
      console.log(error);
      Alert.alert('Invalid info', error.response.data.msg);
    }
    
  }
  return (
    <View style={ globalStyles.container } >
        {/* <Text>Forgot Password</Text> */}
        <Text>Enter the email associated with your account and we'll send an email with instructions to reset your password.</Text>
        <Input label="Email" value={ email } setValue={ setEmail } />

        <Button label="Send" buttonEvent={ handleForgotPassword } disabled={false}/>
    </View>
  )
}

export default ForgotPassword;