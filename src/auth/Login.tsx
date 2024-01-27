import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';

interface Props extends NativeStackScreenProps<any, any> {}

export const Login = ({ navigation }: Props) => {
  const [email, setEmail] = useState("test4@gmail.com");
  const [password, setPassword] = useState("123456");
  const [eyeButton, setEyeButton] = useState(true);

  const { signIn, errorMessage, removeError } = useContext( AuthContext );
  
  useEffect(() => {

    if( errorMessage.length === 0 ) return;
    
    Alert.alert( "Lgoin Incorrect", errorMessage, [{ text: 'Ok', onPress: removeError }] );
    
  }, [ errorMessage ]);
  
  const handleLogin = () => {
    
    signIn({ email , password });
    
  };

  const iconEye = () => {
    eyeButton ? setEyeButton(false) : setEyeButton(true);
  };
  
  const { height, width } = useWindowDimensions();
  const aspectRatio = height/width;

  return (
    <ScrollView>
      <View style={[ globalStyles.login, { height: height - 55 } ]}>
          <View style={styles.containerImg}>
            <Image
              style={[styles.logo, aspectRatio > 1.6 ? { maxHeight: 200 } : { maxHeight: 290 }, { height: height * 0.3 }]}
              source={require('../../assets/images/logo.jpg')}
              resizeMode="contain"
            /> 
          <Text style={styles.title}>Login</Text>
          </View>
          <Input 
            label={ "User" }
            value={ email }
            setValue={ setEmail }
          />
          <Input 
            label={ "Password" }
            value={ password }
            setValue={ setPassword }
            secureTextEntry={ eyeButton }
            rightEye={ true }
            rightEyeButton={ iconEye }
          />
          <Button 
            label={ "Login" }
            onPress={ handleLogin }
            disabled={ false }
          />
          <TouchableOpacity
            onPress={ () => navigation.navigate('ForgotPassword') }
          >
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  forgotPassword:{
    fontSize: 15,
    color: colors.titleColor,
    marginTop: 15,
    alignSelf: 'flex-end'
  },
  containerImg: {
    alignItems: 'center'
  },
  logo: {
    marginBottom:40,
    minWidth: 300,
  },
  title: {
    color: colors.titleColor,
    fontSize: 30
  }
});

export default Login;