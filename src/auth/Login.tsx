import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { globalStyles } from '../styles/globalStyles';

interface Props extends NativeStackScreenProps<any, any> {}

export const Login = ({ navigation }: Props) => {
  const [email, setEmail] = useState("test4@gmail.com");
  const [password, setPassword] = useState("123456");
  const { signIn, forgotId, errorMessage, removeError } = useContext( AuthContext );
  
  useEffect(() => {
    if( errorMessage.length === 0 ) return;
    
    Alert.alert( "Lgoin Incorrect", errorMessage, [{ text: 'Ok', onPress: removeError }] );
    
  }, [ errorMessage ]);
  
  const handleLogin = () => {

    signIn({ email , password });

  }

  return (
    <View style={ globalStyles.container }>
        {/* <Text>Login</Text> */}
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
          <Text style={styles.forgotPassword}>Forogot Password</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10
  },
  forgotPassword:{
    fontSize: 15,
    color: 'gray',
    marginTop: 15,
    alignSelf: 'flex-end'
  }
});

export default Login;