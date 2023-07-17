import React, { useContext, useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { LoginData } from '../interfaces/appInterfaces';

interface Props extends NativeStackScreenProps<any, any> {}

export const Login = ({ navigation }: Props) => {
  const [email, setEmail] = useState("fredy@gmail.com");
  const [password, setPassword] = useState("123456");
  const { signIn, errorMessage, removeError } = useContext( AuthContext );

  useEffect(() => {
    if( errorMessage.length === 0 ) return;

    Alert.alert( "Lgoin Incorrect", errorMessage, [{ text: 'Ok', onPress: removeError }] );

  }, [ errorMessage ])
  

  const handleLogin = () => {

    signIn({ email , password });

  }

  return (
    <View>
        <Text>Login</Text>
        <Input 
          label={ "User" }
          value={ email }
          setValue={ setEmail }
        />
        <Input 
          label={ "Password" }
          value={ password }
          setValue={ setPassword }
          secureTextEntry={ true }
        />
        <Button 
          label={ "Login" }
          buttonEvent={ handleLogin }
          disabled={ false }
        />
        <TouchableOpacity
          onPress={ () => navigation.navigate('ForgotPassword') }
        >
          <Text>Forogot Password</Text>
        </TouchableOpacity>
    </View>
  )
}

export default Login;