import React, { useReducer, useState } from 'react';
import { Alert, Platform, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
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
}

  const [state, dispatch] = useReducer(authReducer, authInitialState);
  const [email, setEmail] = useState("");

  const handleForgotPassword = async() => {

    try {
      const resp = await disabilityApi.post<any>('/auth/forgotPassword', { email });
      
      if(resp.status !== 200){
        return dispatch({ type: 'addError', payload: resp.data.msg });
      };

      if(resp.status === 200){
        navigation.replace('InsertCode', {
          id: await resp.data.id
        });
      };
      
    } catch (error: any) {
      console.log(error);
      Alert.alert('Invalid information', error.response.data.msg);
    }
    
  }
  return (
    <View style={ globalStyles.container }>
        <Text style={{ color: 'white', marginVertical: 20, fontSize: Platform.OS === 'android' ? 20 : 17 }}>Enter the email associated with your account and we'll send an email with instructions to reset your password.</Text>
        <Input 
          label="Email"
          placeholder={ "Email" }
          backgroundInputColor={"black"}
          inputTextColor="white"
          value={ email }
          setValue={ setEmail }
        />

        <Button label="Send" onPress={ handleForgotPassword } disabled={false}/>
    </View>
  )
}

export default ForgotPassword;